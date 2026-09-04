import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ariaAnalyticsTable = pgTable("aria_analytics", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  detectedIntent: text("detected_intent").notNull(), // purchase | consultation | pricing | medical | general
  peptideMentioned: text("peptide_mentioned"),
  userName: text("user_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAriaAnalyticsSchema = createInsertSchema(ariaAnalyticsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertAriaAnalytics = z.infer<typeof insertAriaAnalyticsSchema>;
export type AriaAnalytics = typeof ariaAnalyticsTable.$inferSelect;
