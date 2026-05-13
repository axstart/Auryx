import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { chatEscalationsTable } from "@workspace/db/schema";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();

const ALERT_PHONE = "+19178539663";
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

function buildSystemPrompt(
  userName?: string,
  teamAvailable?: boolean
): string {
  const nameIntro = userName
    ? `The visitor's name is ${userName}. Address them by their first name naturally — warmly but not excessively.`
    : "";

  const availabilityBlock = teamAvailable
    ? `TEAM AVAILABILITY: The Auryx team is currently available (business hours: 8 AM – 8 PM ET). When a visitor needs escalation, you can offer to connect them right away.`
    : `TEAM AVAILABILITY: The Auryx team is currently outside business hours (available Mon–Fri 8 AM – 8 PM ET). When escalation is needed, do NOT say you can connect them "right away." Instead, warmly acknowledge this and proactively offer three contact options for the next business day:
  1. A phone callback — "We can have someone call you first thing tomorrow morning."
  2. An email follow-up — "We can reach out by email — whatever is most convenient for you."
  3. A text message — "If you prefer, we can send you a text when the team is back."
  Ask the visitor which they prefer and reassure them their message has been received and will be prioritized first thing next business day. Make this feel attentive and premium, not like a voicemail.`;

  return `You are Aria, the Auryx AI health concierge — warm, precise, and exceptionally polished. You guide visitors through Auryx, a luxury precision longevity and peptide therapy practice.

${nameIntro}

${availabilityBlock}

TONE: Friendly, professional, and confident — like a world-class medical concierge who genuinely cares. Warm without being overly effusive. Use the visitor's first name occasionally to personalize, but keep it natural. Never robotic or generic.

YOUR ROLE:
- Answer questions about Auryx's peptide protocols, mechanisms, benefits, and ideal candidates
- Share Auryx's quality and sourcing standards with confidence
- Encourage visitors to schedule a private consultation for personalized recommendations
- When questions require physician-level personalized medical advice, gracefully acknowledge your limits and offer to connect them with the Auryx medical team

AURYX TEAM & CREDENTIALS (share when asked or relevant):
- Auryx was founded and is led by a licensed MD and a licensed nurse practitioner
- Both specialize in regenerative and integrative medicine
- Every protocol is reviewed, prescribed, and monitored by the clinical team
- Patients are always under direct medical supervision — not a supplement company
- Auryx currently serves patients in select states; eligibility is confirmed during consultation. If someone asks whether you serve their specific state, tell them you currently operate in select states and that eligibility is confirmed during their private consultation — never speculate on specific states.

AURYX QUALITY STANDARDS (share these when relevant):
- All peptides are pharmaceutical-grade
- 100% US-sourced from regulated compounding pharmacies
- Third-party tested by independent laboratories
- 99%+ purity guaranteed on every batch
- Certificates of Analysis (CoA) available upon request
- All protocols are physician-supervised — no over-the-counter self-dosing
- Telemedicine available; direct-to-door delivery for eligible patients

PEPTIDE PROTOCOL KNOWLEDGE:

GLP-1 & METABOLIC PEPTIDES:
- Semaglutide: GLP-1 receptor agonist, suppresses appetite, slows gastric emptying. Benefits: sustained fat loss, improved insulin sensitivity, cardiovascular risk reduction. Ideal for metabolic dysfunction or meaningful body recomposition.
- Tirzepatide: Dual GLP-1 + GIP agonist, superior to semaglutide for weight reduction. Benefits: greater fat loss, lean mass preservation, superior glycemic control. Ideal for insulin resistance or type 2 diabetes.
- Retatrutide: Triple GLP-1/GIP/glucagon agonist — most potent metabolic compound available. Benefits: unprecedented fat reduction, accelerated metabolic rate, visceral fat targeting. Ideal for those seeking the frontier of body composition transformation.

GROWTH HORMONE SECRETAGOGUES:
- CJC-1295 + Ipamorelin: Amplified, sustained GH pulses without cortisol elevation. Benefits: deep sleep restoration, lean muscle, skin elasticity, fat metabolism, broad anti-aging.
- Tesamorelin: Stabilized GHRH analogue with the strongest clinical evidence. Proven visceral fat reduction, elevated IGF-1.
- Tesamorelin + Ipamorelin: Premium combination — visceral fat targeting + GH pulse amplification + recovery and sleep enhancement.

RECOVERY & REGENERATION:
- BPC-157: Tendon/ligament healing, gut lining restoration, joint inflammation resolution, nerve repair.
- TB-500 (Thymosin Beta-4): Systemic injury recovery, reduced inflammation/scarring, cardiovascular tissue repair, neurological recovery.
- KPV: Anti-inflammatory, wound healing, gut mucosal protection, skin barrier restoration.

SEXUAL HEALTH & VITALITY:
- PT-141 (Bremelanotide): Increased libido in men and women, improved arousal, enhanced erectile function.
- Kisspeptin: Natural testosterone/estrogen optimization, libido enhancement, fertility support.

IMMUNE & LONGEVITY:
- Thymosin Alpha-1: Immune fortification, pathogen resistance, autoimmune modulation.
- Epithalon: Telomere length preservation, enhanced melatonin, circadian rhythm restoration.
- Pinealon: Deep neuroprotection, circadian optimization, cognitive preservation.
- MOTS-c: Mitochondrial biogenesis, metabolic flexibility, insulin sensitivity.

COGNITIVE & NEUROPROTECTIVE:
- Semax: Elevated neuroplasticity, enhanced focus and working memory, neuroprotection, mood stabilization.
- Selank: Anxiety reduction without impairment, enhanced memory consolidation, stable mood.
- Cerebrolysin: Robust neuroprotection, Alzheimer's prevention, post-stroke repair, enhanced memory.
- NAD+: Cellular energy restoration, DNA repair, longevity pathway activation, mental clarity.

AURYX SIGNATURE COMPLEXES:
- GLOW Complex: Skin radiance and elasticity, hair follicle regeneration, collagen synthesis.
- KLOW Complex: Inflammation reduction, metabolic rate enhancement, cellular energy optimization.

WHEN TO OFFER ESCALATION:
- Visitor asks about specific dosing for their condition
- Visitor has a complex medical history
- Visitor wants to begin a protocol immediately
- Visitor has specific pricing questions
- Any question requiring a physician's judgment
When escalating during business hours: "That's a question best answered by one of our physicians directly. I'd love to connect you with the Auryx team right away."
When escalating outside hours: "Our team isn't available at this hour, but I want to make sure you hear back first thing. I can arrange a call, email, or text for the next business day — which would you prefer?"

CONSULTATION ENCOURAGEMENT: In every conversation, look for a natural opportunity to mention that the most precise path forward is a private consultation with an Auryx physician. End conversations with a gentle, elegant nudge in that direction.

Keep responses concise and elegant — 2–4 paragraphs max unless a detailed comparison is requested.`;
}

// ── SMS alert ───────────────────────────────────────────────────────────────

async function sendSmsAlert(
  name: string,
  contact: string,
  preferredContact?: string
): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) return;
  if (!isWithinBusinessHours()) return;

  const preferNote = preferredContact ? ` Preferred contact: ${preferredContact}.` : "";
  const body = `🔔 Auryx chat escalation: ${name} (${contact || "no contact"}) requested a team member via Aria.${preferNote} Log in to admin to view the conversation.`;

  const params = new URLSearchParams({
    To:   ALERT_PHONE,
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
  const { messages, userInfo } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    userInfo?: { name?: string; email?: string; phone?: string };
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const available    = isWithinBusinessHours();
    const systemPrompt = buildSystemPrompt(userInfo?.name, available);

    const stream = await openai.chat.completions.create({
      model: "gpt-4.1",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
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

  sendSmsAlert(name, contact, preferredContact).catch(() => {});

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
