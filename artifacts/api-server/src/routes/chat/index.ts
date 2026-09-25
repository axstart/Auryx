import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { chatEscalationsTable, ariaAnalyticsTable } from "@workspace/db/schema";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import { sendTwilioSms } from "../../lib/twilioSms.js";
import { getAriaInstructions } from "./instructionsCache.js";
import { detectIntent, detectPeptide } from "../analytics/index.js";

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
): Promise<string> {
  const nameIntro = userName
    ? `The visitor's name is ${userName}. Address them by their first name naturally — warmly but not excessively.`
    : "";

  const instructions = await getAriaInstructions();

  return `${instructions}

${nameIntro}

You are Aria, the Auryx AI health concierge — warm, precise, and exceptionally polished. You guide visitors through Auryx, a luxury precision longevity and peptide therapy practice.`;
}

// ── SMS alert ───────────────────────────────────────────────────────────────

async function sendSmsAlert(
  name: string,
  contact: string,
): Promise<void> {
  const toNumber = process.env.NOTIFY_PHONE_NUMBER;
  if (!toNumber) return;

  const nameContact = contact ? `${name} (${contact})` : name;
  await sendTwilioSms({
    to: toNumber,
    body: `New Auryx chat escalation from ${nameContact}. Check admin dashboard: auryxlife.com/admin`,
  });
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

  // Human-feel delay: 1.5–2 s before first token
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

  try {
    const systemPrompt = await buildSystemPrompt(userInfo?.name);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
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

router.get("/chat/escalations", sessionAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(chatEscalationsTable)
    .orderBy(chatEscalationsTable.createdAt);
  res.json(rows);
});

export default router;
