import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const protocolContinuationsTable = pgTable("protocol_continuations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  peptides: text("peptides").notNull(),
  duration: text("duration").notNull(),
  prescribingContext: text("prescribing_context").notNull(),
  prescribingDetails: text("prescribing_details"),
  redFlagsJson: text("red_flags_json").notNull().default("[]"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ProtocolContinuation = typeof protocolContinuationsTable.$inferSelect;
