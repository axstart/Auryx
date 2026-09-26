import { Router } from "express";
import { db } from "@workspace/db";
import { consultationRequestsTable, patientStagesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import { selectOrders } from "../shop/ordersSelect.js";

const router = Router();

// GET /api/admin/patients — unified patient list (consultations + orders merged by email)
router.get("/admin/patients", sessionAuth, async (_req, res): Promise<void> => {
  const [consultations, orders, stages] = await Promise.all([
    db.select().from(consultationRequestsTable).orderBy(consultationRequestsTable.createdAt),
    selectOrders(),
    db.select().from(patientStagesTable),
  ]);

  const stageMap = new Map(stages.map(s => [s.email, s]));

  type PatientRecord = {
    email: string;
    name: string;
    phone?: string;
    state?: string;
    age?: number;
    interest: string;
    primaryGoal: string;
    usedPeptidesBefore: string;
    hearAboutUs: string;
    stage: string;
    notes: string;
    consultationId?: number;
    consultationStatus?: string;
    orders: Array<{
      id: number;
      status: string;
      totalCents: number;
      createdAt: string;
      items: unknown;
      trackingNumber?: string | null;
    }>;
    lastActivity: string;
  };

  const map = new Map<string, PatientRecord>();

  for (const c of consultations) {
    const stageRow = stageMap.get(c.email);
    map.set(c.email, {
      email: c.email,
      name: c.name,
      phone: c.phone ?? undefined,
      state: c.state || undefined,
      age: c.age || undefined,
      interest: c.interest,
      primaryGoal: c.primaryGoal,
      usedPeptidesBefore: c.usedPeptidesBefore,
      hearAboutUs: c.hearAboutUs,
      stage: stageRow?.stage ?? "lead",
      notes: stageRow?.notes ?? "",
      consultationId: c.id,
      consultationStatus: c.status,
      orders: [],
      lastActivity: c.updatedAt.toISOString(),
    });
  }

  for (const o of orders) {
    const existing = map.get(o.email);
    const orderEntry = {
      id: o.id,
      status: o.status,
      totalCents: o.totalCents,
      createdAt: o.createdAt.toISOString(),
      items: o.items,
      trackingNumber: o.trackingNumber,
    };

    if (existing) {
      existing.orders.push(orderEntry);
      const oTime = o.updatedAt.toISOString();
      if (oTime > existing.lastActivity) existing.lastActivity = oTime;
    } else {
      const stageRow = stageMap.get(o.email);
      map.set(o.email, {
        email: o.email,
        name: o.customerName,
        phone: o.phone ?? undefined,
        interest: "",
        primaryGoal: "",
        usedPeptidesBefore: "",
        hearAboutUs: "",
        stage: stageRow?.stage ?? "lead",
        notes: stageRow?.notes ?? "",
        orders: [orderEntry],
        lastActivity: o.updatedAt.toISOString(),
      });
    }
  }

  const patients = [...map.values()].sort(
    (a, b) => b.lastActivity.localeCompare(a.lastActivity),
  );

  res.json(patients);
});

// PATCH /api/admin/patients/:email/stage
router.patch("/admin/patients/:email/stage", sessionAuth, requireAdmin, async (req, res): Promise<void> => {
  const email = decodeURIComponent(req.params["email"] as string);
  const { stage } = req.body as { stage: string };

  const validStages = ["lead", "consultation", "active_patient", "churned"];
  if (!stage || !validStages.includes(stage)) {
    res.status(400).json({ error: "Invalid stage" });
    return;
  }

  await db
    .insert(patientStagesTable)
    .values({ email, stage, notes: "" })
    .onConflictDoUpdate({
      target: patientStagesTable.email,
      set: { stage, updatedAt: new Date() },
    });

  res.json({ email, stage });
});

// PATCH /api/admin/patients/:email/notes
router.patch("/admin/patients/:email/notes", sessionAuth, requireAdmin, async (req, res): Promise<void> => {
  const email = decodeURIComponent(req.params["email"] as string);
  const { notes } = req.body as { notes: string };

  if (typeof notes !== "string") {
    res.status(400).json({ error: "notes must be a string" });
    return;
  }

  const existing = await db
    .select()
    .from(patientStagesTable)
    .where(eq(patientStagesTable.email, email));

  if (existing.length > 0) {
    await db
      .update(patientStagesTable)
      .set({ notes, updatedAt: new Date() })
      .where(eq(patientStagesTable.email, email));
  } else {
    await db
      .insert(patientStagesTable)
      .values({ email, stage: "lead", notes });
  }

  res.json({ email, notes });
});

export default router;
