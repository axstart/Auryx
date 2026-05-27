import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@workspace/db";
import { chatEscalationsTable, ariaAnalyticsTable } from "@workspace/db/schema";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { getAriaInstructions } from "./instructionsCache.js";
import { detectIntent, detectPeptide } from "../analytics/index.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const router = Router();

const BUSINESS_START = 8;   // 8 AM Eastern
const BUSINESS_END   = 20;  // 8 PM Eastern

// ── Business hours helpers ──────────────────────────────────────────────────

function getEasternDateTime(): { day: number; hour: number } {
  const eastern = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return { day: eastern.getDay(), hour: eastern.getHours() };
}

/** Mon–Fri, 8 AM – 8 PM Eastern. */
function isWithinBusinessHours(): boolean {
  const { day, hour } = getEasternDateTime();
  return day >= 1 && day <= 5 && hour >= BUSINESS_START && hour < BUSINESS_END;
}

/** Human-readable label for the next available opening. */
function nextAvailableLabel(): string {
  const { day, hour } = getEasternDateTime();

  // Before 8 AM on a weekday → later today
  if (day >= 1 && day <= 5 && hour < BUSINESS_START) return "today at 8 AM ET";

  // Friday after hours, Saturday, or Sunday → Monday
  if ((day === 5 && hour >= BUSINESS_END) || day === 6 || day === 0) return "Monday at 8 AM ET";

  // Mon–Thu after 8 PM → next weekday morning
  return "tomorrow at 8 AM ET";
}

// ── System prompt ───────────────────────────────────────────────────────────

async function buildSystemPrompt(
  userName?: string,
  teamAvailable?: boolean
): Promise<string> {
  const nameIntro = userName
    ? `The visitor's name is ${userName}. Address them by their first name naturally — warmly but not excessively.`
    : "";

  const availabilityBlock = teamAvailable
    ? `TEAM AVAILABILITY: The Auryx team is currently available (business hours: 8 AM – 8 PM ET). When a visitor needs escalation, you can offer to connect them right away.`
    : `TEAM AVAILABILITY: The Auryx team is currently outside business hours (available Mon–Fri 8 AM – 8 PM ET). When escalation is needed, do NOT say you can connect them "right away." Instead, warmly acknowledge this and direct them to email admin@auryxlife.com — reassure them the team will respond first thing next business day. Make this feel attentive and premium, not like a voicemail.`;

  const instructions = await getAriaInstructions();

  return `You are Aria, the Auryx AI health concierge — warm, precise, and exceptionally polished. You guide visitors through Auryx, a luxury precision longevity and peptide therapy practice.

${nameIntro}

${availabilityBlock}

${instructions}`;
}

// ── SMS alert ───────────────────────────────────────────────────────────────

async function sendSmsAlert(
  name: string,
  contact: string,
): Promise<void> {
  const accountSid  = process.env.TWILIO_ACCOUNT_SID;
  const authToken   = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber  = process.env.TWILIO_FROM_NUMBER;
  const toNumber    = process.env.NOTIFY_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) return;

  const nameContact = contact ? `${name} (${contact})` : name;
  const body = `New Auryx chat escalation from ${nameContact}. Check admin dashboard: auryxlife.com/admin`;

  const params = new URLSearchParams({
    To:   toNumber,
    From: fromNumber,
    Body: body,
  });

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Twilio ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("SMS alert failed:", err);
  }
}

// ── Routes ──────────────────────────────────────────────────────────────────

router.get("/chat/hours", (_req, res) => {
  const available = isWithinBusinessHours();
  res.json({
    available,
    nextAvailable: available ? null : nextAvailableLabel(),
  });
});

router.post("/chat/message", async (req, res) => {
  const { messages, userInfo, sessionId } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    userInfo?: { name?: string; email?: string; phone?: string };
    sessionId?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  // Silent analytics — log the last user message, fire-and-forget
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  if (lastUserMsg) {
    const sid = sessionId ?? "unknown";
    const text = lastUserMsg.content;
    db.insert(ariaAnalyticsTable).values({
      sessionId: sid,
      userMessage: text,
      detectedIntent: detectIntent(text),
      peptideMentioned: detectPeptide(text),
      userName: userInfo?.name ?? null,
    }).catch(() => {});
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const available    = isWithinBusinessHours();
    const systemPrompt = await buildSystemPrompt(userInfo?.name, available);

    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "chat stream error");
    res.write(`data: ${JSON.stringify({ error: "Something went wrong" })}\n\n`);
    res.end();
  }
});

router.post("/chat/escalate", async (req, res) => {
  const { name, email, phone, preferredContact, conversationJson } = req.body as {
    name: string;
    email?: string;
    phone?: string;
    preferredContact?: string;
    conversationJson: string;
  };

  if (!name || !conversationJson) {
    res.status(400).json({ error: "name and conversationJson required" });
    return;
  }

  const contact = phone || email || "";

  const [row] = await db
    .insert(chatEscalationsTable)
    .values({
      name,
      email: email ?? "",
      phone: phone ?? null,
      preferredContact: preferredContact ?? null,
      conversationJson,
    })
    .returning();

  sendSmsAlert(name, contact).catch(() => {});

  res.status(201).json(row);
});

router.get("/chat/escalations", adminAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(chatEscalationsTable)
    .orderBy(chatEscalationsTable.createdAt);
  res.json(rows);
});

export default router;
