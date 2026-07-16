import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, ordersTable, consultationFormsTable } from "@workspace/db";
import { sendMail } from "../../lib/mailer.js";
import { logger } from "../../lib/logger.js";

const router: IRouter = Router();

const SubmitFormSchema = z.object({
  orderId: z.number().int(),
  patientName: z.string().min(1),
  dob: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  conditions: z.array(z.string()).optional(),
  medications: z.string().optional(),
  goal: z.string().optional(),
  priorPeptideUse: z.boolean().default(false),
  priorPeptidesDetail: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

router.post("/consultation-form", async (req, res): Promise<void> => {
  const parsed = SubmitFormSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data;

  // Verify the order exists
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, data.orderId))
    .limit(1);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // Save form to DB
  try {
    const insertData = {
      ...data,
      conditions: data.conditions ? JSON.stringify(data.conditions) : undefined,
    };
    const [formRecord] = await db
      .insert(consultationFormsTable)
      .values(insertData)
      .returning();

    // Mark order as form submitted
    await db
      .update(ordersTable)
      .set({ consultationFormSubmitted: true })
      .where(eq(ordersTable.id, data.orderId));

    // Format medical conditions for email
    const conditionLabels: Record<string, string> = {
      "hormone-sensitive-cancer": "History of hormone-sensitive cancer",
      "other-cancer": "History of other cancer",
      "cancer-treatment": "Currently undergoing cancer treatment",
      "cardiovascular-disease": "Significant cardiovascular disease",
      "diabetes": "Diabetes — Type 1 or Type 2",
      "thyroid-disorder": "Thyroid disorder",
      "autoimmune": "Autoimmune condition",
      "kidney-liver-disease": "Kidney or liver disease",
      "eating-disorder": "History of eating disorder",
      "psychiatric": "Active psychiatric condition",
      "pregnant-nursing": "Pregnant or nursing",
      "other": "Other (see notes)",
      "none": "None of the above",
    };
    const conditionsText = (() => {
      if (!data.conditions || data.conditions.length === 0) return "None reported";
      return "  - " + data.conditions.map((c: string) => conditionLabels[c] ?? c).join("\n  - ");
    })();

    // Send notification email to admin
    sendMail({
      subject: `New Consultation Request — Order #${data.orderId} — ${data.patientName}`,
      text: [
        `New consultation intake form submitted.`,
        ``,
        `Order: #${data.orderId}`,
        `Patient: ${data.patientName}`,
        `DOB: ${data.dob ?? "—"}`,
        `Height: ${data.height ?? "—"}`,
        `Weight: ${data.weight ?? "—"}`,
        `Goal: ${data.goal ?? "—"}`,
        `Prior peptide use: ${data.priorPeptideUse ? "Yes" : "No"}`,
        data.priorPeptidesDetail ? `Prior peptides: ${data.priorPeptidesDetail}` : "",
        ``,
        `Medical conditions:`,
        conditionsText,
        ``,
        `Current medications:`,
        data.medications ?? "—",
        ``,
        `Allergies:`,
        data.allergies ?? "—",
        ``,
        `Additional notes:`,
        data.notes ?? "—",
      ].join("\n"),
    }).catch((err) => logger.error({ err }, "Failed to send consultation email"));

    res.status(201).json({ success: true, formId: formRecord.id });
  } catch (err) {
    logger.error({ err }, "Consultation form insert failed");
    res.status(500).json({ error: "Failed to save form. Please try again." });
  }
});

router.get("/consultation-form/:orderId", async (req, res): Promise<void> => {
  const orderId = parseInt(req.params.orderId, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const [form] = await db
    .select()
    .from(consultationFormsTable)
    .where(eq(consultationFormsTable.orderId, orderId))
    .limit(1);

  if (!form) {
    res.status(404).json({ error: "Consultation form not found for this order" });
    return;
  }

  // Parse conditions JSON string back to array for the client
  const parsedForm = {
    ...form,
    conditions: (() => {
      const raw = form.conditions;
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    })(),
  };

  res.json(parsedForm);
});

export default router;
