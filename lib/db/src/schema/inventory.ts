import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inventoryItemsTable = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  slug: text("slug"),
  name: text("name").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  unit: text("unit").notNull().default("vials"),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  costPerUnit: integer("cost_per_unit").notNull().default(0),
  sellPriceCents: integer("sell_price_cents").notNull().default(0),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInventorySchema = createInsertSchema(inventoryItemsTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;
export type InventoryItem = typeof inventoryItemsTable.$inferSelect;
