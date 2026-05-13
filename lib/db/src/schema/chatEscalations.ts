import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chatEscalationsTable = pgTable("chat_escalations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  conversationJson: text("conversation_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChatEscalationSchema = createInsertSchema(chatEscalationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertChatEscalation = z.infer<typeof insertChatEscalationSchema>;
export type ChatEscalation = typeof chatEscalationsTable.$inferSelect;
