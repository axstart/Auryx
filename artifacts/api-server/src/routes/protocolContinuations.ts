import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { protocolContinuationsTable } from "@workspace/db/schema";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router.post("/protocol-continuations", async (req, res) => {
  const { name, email, phone, peptides, duration, prescribingContext, prescribingDetails, redFlagsJson, notes } =
    req.body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !peptides?.trim() || !duration?.trim() || !prescribingContext?.trim()) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }

  const [row] = await db
    .insert(protocolContinuationsTable)
    .values({
      name,
      email,
      phone: phone || null,
      peptides,
      duration,
      prescribingContext,
      prescribingDetails: prescribingDetails || null,
      redFlagsJson: redFlagsJson || "[]",
      notes: notes || null,
      status: "pending",
    })
    .returning();

  res.status(201).json(row);
});

router.get("/admin/protocol-continuations", adminAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(protocolContinuationsTable)
    .orderBy(protocolContinuationsTable.createdAt);
  res.json(rows);
});

router.patch("/admin/protocol-continuations/:id", adminAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body as { status: string };

  if (!["pending", "approved", "needs-review", "rejected"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const [row] = await db
    .update(protocolContinuationsTable)
    .set({ status })
    .where(eq(protocolContinuationsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(row);
});

export default router;
