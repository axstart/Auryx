import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  shippingAddress: jsonb("shipping_address").notNull(),
  items: jsonb("items").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentMethodId: text("payment_method_id"),
  paynodePaymentId: text("paynode_payment_id"),
  requiresConsultation: boolean("requires_consultation").notNull().default(false),
  researchField: text("research_field"),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ShippingAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().default("US"),
});

export const OrderItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
  priceCents: z.number().int().min(0),
  variantLabel: z.string().optional(),
});

export const insertOrderSchema = createInsertSchema(ordersTable, {
  shippingAddress: ShippingAddressSchema,
  items: z.array(OrderItemSchema),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
