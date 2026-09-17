import { pgTable, text, serial, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const funnelEventsTable = pgTable(
  "funnel_events",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    eventName: text("event_name").notNull(),
    stepKey: text("step_key"),
    productSlug: text("product_slug"),
    valueCents: integer("value_cents"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("funnel_events_event_name_idx").on(table.eventName),
    index("funnel_events_created_at_idx").on(table.createdAt),
    index("funnel_events_session_id_idx").on(table.sessionId),
  ],
);

export type FunnelEvent = typeof funnelEventsTable.$inferSelect;
