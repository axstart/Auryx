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
