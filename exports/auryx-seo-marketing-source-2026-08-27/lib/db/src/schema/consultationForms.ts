import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const consultationFormsTable = pgTable("consultation_forms", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  patientName: text("patient_name").notNull(),
  dob: text("dob"),
  height: text("height"),
  weight: text("weight"),
  conditions: text("conditions"),
  medications: text("medications"),
  goal: text("goal"),
  priorPeptideUse: boolean("prior_peptide_use").notNull().default(false),
  priorPeptidesDetail: text("prior_peptides_detail"),
  allergies: text("allergies"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertConsultationFormSchema = createInsertSchema(consultationFormsTable).omit({
  id: true,
  submittedAt: true,
});

export type InsertConsultationForm = z.infer<typeof insertConsultationFormSchema>;
export type ConsultationForm = typeof consultationFormsTable.$inferSelect;
