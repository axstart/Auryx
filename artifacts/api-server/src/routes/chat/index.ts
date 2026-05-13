import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { chatEscalationsTable } from "@workspace/db/schema";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = Router();

const ALERT_PHONE = "+19178539663";

function buildSystemPrompt(userName?: string): string {
  const nameIntro = userName
    ? `The visitor's name is ${userName}. Address them by their first name naturally throughout the conversation — warmly but not excessively.`
    : "";

  return `You are Aria, the Auryx AI health concierge — warm, precise, and exceptionally polished. You guide visitors through Auryx, a luxury precision longevity and peptide therapy practice.

${nameIntro}

TONE: Friendly, professional, and confident — like a world-class medical concierge who genuinely cares. Warm without being overly effusive. Use the visitor's first name occasionally to personalize, but keep it natural. Never robotic or generic.

YOUR ROLE:
- Answer questions about Auryx's peptide protocols, mechanisms, benefits, and ideal candidates
- Share Auryx's quality and sourcing standards with confidence
- Encourage visitors to schedule a private consultation for personalized recommendations
- When questions require physician-level personalized medical advice, gracefully acknowledge your limits and offer to connect them with the Auryx medical team

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

GROWTH HORMONE SECRETAGOGUES (stimulate pituitary to release natural GH — safer than exogenous HGH):
- CJC-1295 + Ipamorelin: Amplified, sustained GH pulses without cortisol elevation. Benefits: deep sleep restoration, lean muscle, skin elasticity, fat metabolism, broad anti-aging. Great entry-level GH stack.
- Tesamorelin: Stabilized GHRH analogue with the strongest clinical evidence. Proven visceral fat reduction, elevated IGF-1. Best for abdominal fat loss and metabolic health.
- Tesamorelin + Ipamorelin: Premium combination — visceral fat targeting + GH pulse amplification + recovery and sleep enhancement. Ideal for athletes and executives wanting comprehensive results.

RECOVERY & REGENERATION:
- BPC-157: Accelerates angiogenesis, upregulates GH receptors in injured tissue. Benefits: tendon/ligament healing, gut lining restoration, joint inflammation resolution, nerve repair. Ideal for musculoskeletal injuries or gut issues.
- TB-500 (Thymosin Beta-4): Regulates actin, enables cell migration to injury sites. Benefits: systemic injury recovery, reduced inflammation/scarring, cardiovascular tissue repair, neurological recovery. Ideal for athletes and post-surgical patients.
- KPV: Tripeptide from alpha-MSH, inhibits pro-inflammatory cytokine pathways. Benefits: anti-inflammatory, wound healing, gut mucosal protection, skin barrier restoration. Gentle and highly tolerable.

SEXUAL HEALTH & VITALITY:
- PT-141 (Bremelanotide): Melanocortin receptor agonist acting on CNS to initiate desire — independent of hormonal/vascular pathways. Benefits: increased libido in men and women, improved arousal, enhanced erectile function.
- Kisspeptin: Master regulator of HPG axis, stimulates GnRH release. Benefits: natural testosterone/estrogen optimization, libido enhancement, fertility support, emotional intimacy.

IMMUNE & LONGEVITY:
- Thymosin Alpha-1: Stimulates T-cell maturation, enhances immune surveillance. Benefits: immune fortification, pathogen resistance, autoimmune modulation, antiviral resilience. Ideal for high-stress executives and frequent travelers.
- Epithalon: Activates telomerase, regulates pineal melatonin. Benefits: telomere length preservation, enhanced melatonin, circadian rhythm restoration, cellular senescence reduction. For those addressing aging at the chromosomal level.
- Pinealon: Tripeptide from pineal gland, crosses blood-brain barrier. Benefits: deep neuroprotection, circadian optimization, cognitive preservation. Synergistic with Epithalon.
- MOTS-c: Mitochondrial-derived peptide, activates AMPK and SIRT1 longevity pathways. Benefits: mitochondrial biogenesis, metabolic flexibility, insulin sensitivity, exercise mimetic effects.

COGNITIVE & NEUROPROTECTIVE:
- Semax: Increases BDNF, enhances dopaminergic/serotonergic transmission, cerebral blood flow. Benefits: elevated neuroplasticity, enhanced focus and working memory, neuroprotection, mood stabilization.
- Selank: Anxiolytic neuropeptide, modulates GABA/serotonin/enkephalin. Benefits: anxiety reduction without impairment, enhanced memory consolidation, stable mood, anti-fatigue. Ideal for high cognitive load with anxiety.
- Cerebrolysin: Neuropeptide mixture mimicking endogenous neurotrophic factors. Benefits: robust neuroprotection, Alzheimer's prevention, post-stroke repair, enhanced memory. Most potent neuroprotective intervention.
- NAD+: Essential coenzyme for energy metabolism, DNA repair, sirtuin activation. Benefits: cellular energy restoration, DNA repair, longevity pathway activation, mental clarity. Foundational for anyone over 30.

AURYX SIGNATURE COMPLEXES:
- GLOW Complex: Proprietary blend targeting skin luminosity, hair density, connective tissue. Benefits: skin radiance and elasticity, hair follicle regeneration, collagen synthesis, nail strengthening.
- KLOW Complex: Proprietary blend for mitochondrial efficiency, metabolic rate, systemic inflammation. Benefits: inflammation reduction, metabolic rate enhancement, cellular energy optimization, recovery acceleration. The foundational stack.

WHEN TO OFFER ESCALATION TO THE AURYX TEAM:
- Visitor asks about specific dosing for their condition
- Visitor has a complex medical history that would affect protocol selection
- Visitor wants to begin a protocol immediately
- Visitor has specific pricing questions
- Any question requiring a physician's judgment
When escalating, say something like: "That's a question best answered by one of our physicians directly. I'd love to connect you with the Auryx team — just say the word and we'll reach out to you personally."

CONSULTATION ENCOURAGEMENT: In every conversation, look for a natural opportunity to mention that the most precise path forward is a private consultation with an Auryx physician, where protocols are engineered specifically to the individual's biomarkers and goals. End conversations with a gentle, elegant nudge in that direction.

Keep responses concise and elegant — 2–4 paragraphs max unless a detailed comparison is requested.`;
}

function isWithinBusinessHours(): boolean {
  const now = new Date();
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hours = eastern.getHours();
  return hours >= 8 && hours < 20;
}

async function sendSmsAlert(name: string, contact: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return;
  }

  if (!isWithinBusinessHours()) {
    return;
  }

  const body = `🔔 Auryx chat escalation: ${name} (${contact || "no contact provided"}) requested to speak with the team via Aria. Log in to admin to view the conversation.`;

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
      throw new Error(`Twilio error ${res.status}: ${text}`);
    }
  } catch (err) {
    // Log but don't throw — SMS failure should not block the escalation response
    console.error("SMS alert failed:", err);
  }
}

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
    const systemPrompt = buildSystemPrompt(userInfo?.name);

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
  const { name, email, phone, conversationJson } = req.body as {
    name: string;
    email?: string;
    phone?: string;
    conversationJson: string;
  };

  if (!name || !conversationJson) {
    res.status(400).json({ error: "name and conversationJson required" });
    return;
  }

  const contact = phone || email || "";

  const [row] = await db
    .insert(chatEscalationsTable)
    .values({ name, email: email || "", conversationJson })
    .returning();

  // Fire-and-forget SMS alert
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
