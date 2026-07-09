import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const paymentEventsTable = pgTable("payment_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  rawHeaders: jsonb("raw_headers"),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PaymentEvent = typeof paymentEventsTable.$inferSelect;
