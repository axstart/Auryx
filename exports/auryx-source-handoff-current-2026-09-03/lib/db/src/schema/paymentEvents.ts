import { pgTable, serial, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const paymentEventsTable = pgTable("payment_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  webhookId: text("webhook_id"),
  /** x-idempotency-key from PaymentNode — unique so duplicate deliveries can be detected via insert conflict. */
  idempotencyKey: text("idempotency_key").unique(),
  verified: boolean("verified").notNull().default(false),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PaymentEvent = typeof paymentEventsTable.$inferSelect;
