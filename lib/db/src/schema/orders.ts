import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const influencerCouponsTable = pgTable("influencer_coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  influencerName: text("influencer_name").notNull(),
  influencerEmail: text("influencer_email").notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("10"),
  commissionPercent: numeric("commission_percent", { precision: 5, scale: 2 }).notNull().default("5"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  shippingAddress: jsonb("shipping_address").notNull(),
  items: jsonb("items").notNull(),
  totalCents: integer("total_cents").notNull(),
  originalTotalCents: integer("original_total_cents"),
  discountCents: integer("discount_cents").notNull().default(0),
  status: text("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentMethodId: text("payment_method_id"),
  paynodePaymentId: text("paynode_payment_id"),
  couponCode: text("coupon_code"),
  couponId: integer("coupon_id").references(() => influencerCouponsTable.id),
  requiresConsultation: boolean("requires_consultation").notNull().default(false),
  consultationRequested: boolean("consultation_requested").default(false),
  consultationFormSubmitted: boolean("consultation_form_submitted").notNull().default(false),
  researchField: text("research_field"),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const influencerCouponUsesTable = pgTable("influencer_coupon_uses", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").notNull().references(() => influencerCouponsTable.id),
  orderId: integer("order_id").notNull().references(() => ordersTable.id),
  orderAmountBeforeDiscount: numeric("order_amount_before_discount", { precision: 12, scale: 2 }).notNull(),
  discountApplied: numeric("discount_applied", { precision: 12, scale: 2 }).notNull(),
  orderAmountAfterDiscount: numeric("order_amount_after_discount", { precision: 12, scale: 2 }).notNull(),
  commissionOwed: numeric("commission_owed", { precision: 12, scale: 2 }).notNull(),
  commissionPaid: boolean("commission_paid").notNull().default(false),
  commissionPaidAt: timestamp("commission_paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("influencer_coupon_uses_order_unique").on(table.orderId),
]);

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

export const insertInfluencerCouponSchema = createInsertSchema(influencerCouponsTable)
  .omit({ id: true, createdAt: true });
export const insertInfluencerCouponUseSchema = createInsertSchema(influencerCouponUsesTable)
  .omit({ id: true, createdAt: true });

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type InfluencerCoupon = typeof influencerCouponsTable.$inferSelect;
export type InfluencerCouponUse = typeof influencerCouponUsesTable.$inferSelect;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
