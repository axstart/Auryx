import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { z } from "zod/v4";

const router = Router();

const InputSchema = z.object({
  knowledge: z.string().optional(),
  goal: z.string().optional(),
  energySleep: z.string().optional(),
  activityLevel: z.string().optional(),
  intent: z.string().optional(),
  medical: z.array(z.string()).optional(),
  currentPeptides: z.string().optional(),
  protocolIntent: z.string().optional(),
});

const MEDICAL_FLAGS = ["hormone-sensitive-cancer", "other-cancer", "active-treatment"];

const AURYX_PROTOCOLS = `
AURYX PEPTIDE COLLECTIONS (use exactly these names):
- "Sermorelin" — GH secretagogue. Anti-aging, sleep depth, lean body composition, GH pulse restoration.
- "BPC-157" — Body Protection Compound. Injury recovery, tendon/ligament repair, gut healing, inflammation.
- "NAD+" — Cellular energy cofactor. Sustained energy, cognitive performance, mitochondrial health, longevity.
- "CJC-1295 / Ipamorelin" — GH-releasing peptide stack. Muscle growth, fat loss, deep sleep, anti-aging.
- "Thymosin Alpha-1" — Immune modulator. Immune optimization, chronic fatigue, resilience, longevity.
- "PT-141" — Melanocortin agonist. Sexual health, libido restoration, arousal in men and women.
- "Tirzepatide" — GLP-1/GIP dual agonist. Metabolic health, fat loss, blood sugar regulation, weight management.
- "Epithalon" — Telomere-lengthening peptide. Cellular aging, circadian rhythm repair, longevity, sleep.

GOAL → PROTOCOL MAPPING GUIDANCE:
- antiaging → Sermorelin, Epithalon, or CJC-1295/Ipamorelin
- fatloss → Tirzepatide or CJC-1295/Ipamorelin
- sexual → PT-141
- recovery → BPC-157
- cognitive → NAD+
- energy → NAD+ or Sermorelin
- unsure → consider the most clinically versatile option based on all other signals
`;

router.post("/protocol-recommendation", async (req, res) => {
  const parsed = InputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { knowledge, goal, energySleep, activityLevel, intent, medical, currentPeptides, protocolIntent } = parsed.data;

  const hasMedicalFlag = medical?.some((m) => MEDICAL_FLAGS.includes(m));
  if (hasMedicalFlag) {
    res.status(400).json({ error: "Medical consultation required" });
    return;
  }

  const userContext = [
    knowledge && `Experience level with peptides: ${knowledge}`,
    currentPeptides && currentPeptides !== "Prefer not to say" && currentPeptides !== "Not specified" && `Current peptides: ${currentPeptides}`,
    protocolIntent && `Protocol intent: ${protocolIntent}`,
    goal && `Primary wellness goal: ${goal}`,
    energySleep && `Energy & sleep quality: ${energySleep}`,
    activityLevel && `Activity level: ${activityLevel}`,
    intent && `What brings them to AURYX: ${intent}`,
    medical && medical.length > 0 && !medical.includes("none") && `Medical notes: ${medical.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1200,
    messages: [
      {
        role: "system",
        content: `You are Aria, the AURYX protocol recommendation AI. AURYX is a luxury precision peptide therapy practice.

${AURYX_PROTOCOLS}

Based on a user's assessment answers, recommend 3 to 5 AURYX protocols that best match their profile. NAD+ MUST always be included in the recommendations. Order the protocols from most to least relevant.

Respond ONLY with a valid JSON object, no markdown, no preamble:
{
  "summary": "2-3 sentences in AURYX brand voice explaining why this combination of protocols was selected for this person. Be specific to their goals, energy, and lifestyle. Do NOT start with 'Based on your answers'. Lead with the outcome or the physiology.",
  "protocols": [
    {
      "protocol": "Exact protocol name from the list above",
      "tagline": "3-5 word evocative phrase, e.g. 'Restore. Rebuild. Outperform.'",
      "why": "1-2 sentences on why this specific compound fits their profile.",
      "peptides": ["Primary peptide name", "Secondary if applicable"]
    }
  ],
  "nextStep": "One clear action sentence. If they selected consultation, direct them there. Otherwise, guide them to explore the protocols or speak with the team.",
  "disclaimer": "This recommendation is for educational guidance only and does not constitute medical advice. Consult a licensed healthcare provider before beginning any protocol."
}`,
      },
      {
        role: "user",
        content: `Recommend an AURYX protocol for this person:\n\n${userContext}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object in response");
    const recommendation = JSON.parse(jsonMatch[0]);
    res.json(recommendation);
  } catch {
    req.log.error({ text }, "Failed to parse AI protocol recommendation");
    res.status(500).json({ error: "Failed to parse AI response" });
  }
});

export default router;
