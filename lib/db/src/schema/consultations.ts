import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const consultationRequestsTable = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interest: text("interest").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  state: text("state").notNull().default(""),
  instagramHandle: text("instagram_handle"),
  age: integer("age").notNull().default(0),
  primaryGoal: text("primary_goal").notNull().default(""),
  usedPeptidesBefore: text("used_peptides_before").notNull().default(""),
  hearAboutUs: text("hear_about_us").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertConsultationSchema = createInsertSchema(consultationRequestsTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type ConsultationRequest = typeof consultationRequestsTable.$inferSelect;
