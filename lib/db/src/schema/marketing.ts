import { pgTable, text, serial, integer, timestamp, boolean, index, unique } from "drizzle-orm/pg-core";

export const marketingSubscribersTable = pgTable(
  "marketing_subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    source: text("source").notNull().default("checkout"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("marketing_subscribers_email_idx").on(table.email)],
);

export const emailJourneyStateTable = pgTable(
  "email_journey_state",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    journey: text("journey").notNull(),
    step: integer("step").notNull().default(0),
    nextSendAt: timestamp("next_send_at", { withTimezone: true }),
    status: text("status").notNull().default("active"),
    meta: text("meta"),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique("email_journey_email_journey_unique").on(table.email, table.journey),
    index("email_journey_next_send_idx").on(table.nextSendAt),
    index("email_journey_status_idx").on(table.status),
  ],
);

export const cartAbandonSnapshotsTable = pgTable("cart_abandon_snapshots", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  cartJson: text("cart_json").notNull(),
  totalCents: integer("total_cents").notNull().default(0),
  converted: boolean("converted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type MarketingSubscriber = typeof marketingSubscribersTable.$inferSelect;
export type EmailJourneyState = typeof emailJourneyStateTable.$inferSelect;
export type CartAbandonSnapshot = typeof cartAbandonSnapshotsTable.$inferSelect;
