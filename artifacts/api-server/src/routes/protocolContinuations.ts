import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { protocolContinuationsTable } from "@workspace/db/schema";
import { sessionAuth, requireAdmin } from "../middlewares/sessionAuth.js";
import { sendMail } from "../lib/mailer.js";

const DURATION_LABELS: Record<string, string> = {
  "less-than-1-month": "< 1 month",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-12-months": "6–12 months",
  "more-than-1-year": "> 1 year",
};

const PRESCRIBING_LABELS: Record<string, string> = {
  "md-do": "MD / DO",
  "np-pa": "NP / PA",
  "functional": "Functional / integrative",
  "telehealth": "Online clinic / telehealth",
  "self-managed": "Self-managed",
  "other": "Other",
};

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

  let flags: string[] = [];
  try { flags = JSON.parse(row.redFlagsJson ?? "[]"); } catch {}

  sendMail({
    subject: `New Protocol Continuation — ${row.name}`,
    text: [
      `New protocol continuation intake submitted on Auryx.`,
      ``,
      `Name:               ${row.name}`,
      `Email:              ${row.email}`,
      `Phone:              ${row.phone ?? "—"}`,
      `Current Peptides:   ${row.peptides}`,
      `Duration on Protocol: ${DURATION_LABELS[row.duration] ?? row.duration}`,
      `Prescribing Context: ${PRESCRIBING_LABELS[row.prescribingContext] ?? row.prescribingContext}`,
      row.prescribingDetails ? `Provider / Clinic:  ${row.prescribingDetails}` : null,
      row.notes ? `Patient Notes:      ${row.notes}` : null,
      flags.length > 0 ? `Red Flags:          ${flags.join(", ")}` : null,
      ``,
      `Submitted: ${new Date(row.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ].filter(Boolean).join("\n"),
  }).catch((err) => req.log.error({ err }, "Continuation email notification failed"));

  res.status(201).json(row);
});

router.get("/admin/protocol-continuations", sessionAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(protocolContinuationsTable)
    .orderBy(protocolContinuationsTable.createdAt);
  res.json(rows);
});

router.patch("/admin/protocol-continuations/:id", sessionAuth, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
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
