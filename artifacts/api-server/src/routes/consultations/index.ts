import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, consultationRequestsTable } from "@workspace/db";
import { adminAuth } from "../../middlewares/adminAuth";
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
  "anti-aging": "Anti-Aging & Longevity",
  "fat-loss": "Fat Loss & Body Composition",
  "sexual-health": "Sexual Health & Vitality",
  "recovery": "Recovery & Regeneration",
  "cognitive": "Cognitive Performance",
  "energy": "Energy & Vitality",
};

const router: IRouter = Router();

router.post("/consultations", async (req, res): Promise<void> => {
  const parsed = CreateConsultationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [record] = await db
    .insert(consultationRequestsTable)
    .values(parsed.data)
    .returning();
  req.log.info({ id: record.id }, "Consultation request created");

  sendMail({
    subject: `New Consultation Request — ${record.name}`,
    text: [
      `New consultation request submitted on Auryx.`,
      ``,
      `Name:     ${record.name}`,
      `Email:    ${record.email}`,
      `Phone:    ${record.phone ?? "—"}`,
      `Interest: ${INTEREST_LABELS[record.interest] ?? record.interest}`,
      `Message:  ${record.message ?? "—"}`,
      ``,
      `Submitted: ${new Date(record.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ].join("\n"),
  }).catch(() => {});

  res.status(201).json(ListConsultationsResponseItem.parse(record));
});

router.get("/consultations", adminAuth, async (req, res): Promise<void> => {
  const records = await db
    .select()
    .from(consultationRequestsTable)
    .orderBy(consultationRequestsTable.createdAt);
  res.json(ListConsultationsResponse.parse(records));
});

router.patch("/consultations/:id", adminAuth, async (req, res): Promise<void> => {
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
