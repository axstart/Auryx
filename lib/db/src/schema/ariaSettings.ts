import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const ariaSettingsTable = pgTable("aria_settings", {
  id: serial("id").primaryKey(),
  instructions: text("instructions").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AriaSettings = typeof ariaSettingsTable.$inferSelect;
