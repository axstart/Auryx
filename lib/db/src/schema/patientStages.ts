import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const patientStagesTable = pgTable("patient_stages", {
  email: text("email").primaryKey(),
  stage: text("stage").notNull().default("lead"),
  notes: text("notes").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type PatientStage = typeof patientStagesTable.$inferSelect;
