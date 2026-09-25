import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, consultationRequestsTable } from "@workspace/db";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import {
  CreateConsultationBody,
  ListConsultationsResponseItem,
  ListConsultationsResponse,
  UpdateConsultationBody,
  UpdateConsultationParams,
  UpdateConsultationResponse,
} from "@workspace/api-zod";
import { sendMail } from "../../lib/mailer.js";

const INTEREST_LABELS: Record<string, string> = {
  "fat-loss": "Fat Loss & Body Composition",
  "anti-aging": "Anti-Aging & Longevity",
  "performance": "Performance & Strength",
  "energy-focus": "Energy & Focus",
  "recovery": "Recovery & Injury Healing",
  "hormonal": "Hormonal Balance",
  "sexual-health": "Sexual Health & Vitality",
  "sleep": "Sleep Optimization",
  "cognitive": "Cognitive Performance",
  "other": "Other",
  "energy": "Energy & Vitality",
};

const GOAL_LABELS: Record<string, string> = {
  "weight-loss": "Weight Loss",
  "anti-aging": "Anti-Aging",
  "performance": "Performance & Strength",
  "energy-focus": "Energy & Focus",
  "recovery": "Recovery",
  "hormonal": "Hormonal Balance",
  "other": "Other",
};

const SOURCE_LABELS: Record<string, string> = {
  "instagram": "Instagram",
  "google": "Google Search",
  "referral": "Referral from a Friend",
  "ai-search": "AI Search (ChatGPT, Gemini, Claude, etc.)",
  "tiktok": "TikTok",
  "other": "Other",
};

const router: IRouter = Router();

router.post("/consultations", async (req, res): Promise<void> => {
  const parsed = CreateConsultationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const interestStr = Array.isArray(parsed.data.interest)
    ? parsed.data.interest.join(",")
    : parsed.data.interest as string;
  const [record] = await db
    .insert(consultationRequestsTable)
    .values({ ...parsed.data, interest: interestStr })
    .returning();
  req.log.info({ id: record.id }, "Consultation request created");

  const interestDisplay = record.interest
    .split(",")
    .map((i) => INTEREST_LABELS[i.trim()] ?? i.trim())
    .join(", ");

  sendMail({
    subject: `New Consultation Request — ${record.name}`,
    text: [
      `New consultation request submitted on Auryx.`,
      ``,
      `Name:               ${record.name}`,
      `Email:              ${record.email}`,
      `Phone:              ${record.phone ?? "—"}`,
      `Age:                ${record.age || "—"}`,
      `State:              ${record.state || "—"}`,
      `Instagram:          ${record.instagramHandle ?? "—"}`,
      ``,
      `Interest:           ${interestDisplay}`,
      `Primary Goal:       ${GOAL_LABELS[record.primaryGoal] ?? record.primaryGoal}`,
      `Used Peptides:      ${record.usedPeptidesBefore === "yes" ? "Yes" : record.usedPeptidesBefore === "no" ? "No" : "—"}`,
      `How They Found Us:  ${SOURCE_LABELS[record.hearAboutUs] ?? record.hearAboutUs}`,
      ``,
      `Message:  ${record.message ?? "—"}`,
      ``,
      `Submitted: ${new Date(record.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ].join("\n"),
  }).catch((err) => req.log.error({ err }, "Consultation email notification failed"));

  res.status(201).json(ListConsultationsResponseItem.parse(record));
});

router.get("/consultations", sessionAuth, async (req, res): Promise<void> => {
  const records = await db
    .select()
    .from(consultationRequestsTable)
    .orderBy(consultationRequestsTable.createdAt);
  res.json(ListConsultationsResponse.parse(records));
});

router.patch("/consultations/:id", sessionAuth, requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateConsultationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateConsultationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [record] = await db
    .update(consultationRequestsTable)
    .set(parsed.data)
    .where(eq(consultationRequestsTable.id, params.data.id))
    .returning();
  if (!record) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateConsultationResponse.parse(record));
});

export default router;
