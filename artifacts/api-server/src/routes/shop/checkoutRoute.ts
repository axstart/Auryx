import { Router } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import { sendMail } from "../../lib/mailer.js";
import { sendOrderStatusEmail } from "../../lib/orderEmail.js";
import { getProductBySlug } from "./products.js";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

const CartItemSchema = z.object({
  slug: z.string(),
  quantity: z.number().int().min(1).max(10),
  variantLabel: z.string().optional(),
});

const CreatePaymentIntentSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  customerEmail: z.string().email().optional(),
});

const ShippingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
});

const CompleteOrderSchema = z.object({
  paymentIntentId: z.string(),
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CartItemSchema).min(1),
});

const ORDER_STATUSES = ["pending", "approved", "sent_to_pharmacy", "shipped", "delivered"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function resolveItemPrice(item: z.infer<typeof CartItemSchema>): {
  priceCents: number;
  name: string;
  slug: string;
  variantLabel?: string;
  error?: string;
} {
  const product = getProductBySlug(item.slug);
  if (!product) return { priceCents: 0, name: "", slug: item.slug, error: `Unknown product: ${item.slug}` };

  let priceCents = product.priceCents;

  if (item.variantLabel) {
    const variant = product.variants?.find(v => v.label === item.variantLabel);
    if (!variant) {
      return { priceCents: 0, name: product.name, slug: product.slug, error: `Unknown variant "${item.variantLabel}" for ${product.slug}` };
    }
    priceCents = variant.priceCents;
  }

  return { priceCents, name: product.name, slug: product.slug, variantLabel: item.variantLabel };
}

// Status-change emails sent to customer
function sendStatusEmail(order: typeof ordersTable.$inferSelect) {
  const name = order.customerName;
  const id = order.id;
  const email = order.email;
  const tracking = order.trackingNumber;

  const templates: Partial<Record<OrderStatus, { subject: string; body: string[] }>> = {
    approved: {
      subject: `Auryx Order #${id} — Approved`,
      body: [
        `Hi ${name},`,
        ``,
        `Great news — your Auryx order #${id} has been approved and is being prepared for fulfillment.`,
        ``,
        `We'll send you another update when your order is sent to the pharmacy.`,
        ``,
        `Questions? Email us at admin@auryxlife.com`,
        ``,
        `— The Auryx Team`,
      ],
    },
    sent_to_pharmacy: {
      subject: `Auryx Order #${id} — Sent to Pharmacy`,
      body: [
        `Hi ${name},`,
        ``,
        `Your Auryx order #${id} has been sent to our compounding pharmacy for preparation.`,
        ``,
        `Once it ships, you'll receive a tracking number via email.`,
        ``,
        `Questions? Email us at admin@auryxlife.com`,
        ``,
        `— The Auryx Team`,
      ],
    },
    shipped: {
      subject: `Auryx Order #${id} — Shipped`,
      body: [
        `Hi ${name},`,
        ``,
        `Your Auryx order #${id} has shipped!`,
        ``,
        ...(tracking ? [`Tracking number: ${tracking}`, ``] : []),
        `Thank you for choosing Auryx.`,
        ``,
        `— The Auryx Team`,
      ],
    },
    delivered: {
      subject: `Auryx Order #${id} — Delivered`,
      body: [
        `Hi ${name},`,
        ``,
        `Your Auryx order #${id} has been marked as delivered. We hope you're pleased with your protocol.`,
        ``,
        `For any questions about your protocol or to book a follow-up consultation, reply to this email.`,
        ``,
        `— The Auryx Team`,
      ],
    },
  };

  const tpl = templates[order.status as OrderStatus];
  if (!tpl) return;

  sendMail({
    to: email,
    subject: tpl.subject,
    text: tpl.body.join("\n"),
  }).catch(() => {});
}

const router = Router();

router.get("/checkout/publishable-key", (_req, res) => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) { res.status(500).json({ error: "Stripe not configured" }); return; }
  res.json({ publishableKey: key });
});

router.post("/checkout/create-payment-intent", async (req, res) => {
  const parsed = CreatePaymentIntentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let totalCents = 0;
  const lineItems: { slug: string; name: string; quantity: number; priceCents: number; variantLabel?: string }[] = [];

  for (const item of parsed.data.items) {
    const resolved = resolveItemPrice(item);
    if (resolved.error) {
      res.status(400).json({ error: resolved.error });
      return;
    }
    totalCents += resolved.priceCents * item.quantity;
    lineItems.push({
      slug: resolved.slug,
      name: resolved.name,
      quantity: item.quantity,
      priceCents: resolved.priceCents,
      ...(resolved.variantLabel ? { variantLabel: resolved.variantLabel } : {}),
    });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: parsed.data.customerEmail,
      metadata: { items: JSON.stringify(lineItems) },
    });
    res.json({ clientSecret: intent.client_secret, totalCents });
  } catch (err) {
    req.log.error({ err }, "Stripe createPaymentIntent failed");
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.post("/checkout/complete", async (req, res) => {
  const parsed = CompleteOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { paymentIntentId, customerName, email, phone, shippingAddress, items } = parsed.data;

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    req.log.error({ err }, "Stripe retrieve failed");
    res.status(400).json({ error: "Could not verify payment" });
    return;
  }

  if (intent.status !== "succeeded") {
    res.status(400).json({ error: `Payment not completed (status: ${intent.status})` });
    return;
  }

  let totalCents = 0;
  const lineItems: { slug: string; name: string; quantity: number; priceCents: number; variantLabel?: string }[] = [];
  let requiresConsultation = false;

  for (const item of items) {
    const resolved = resolveItemPrice(item);
    if (resolved.error) continue;
    totalCents += resolved.priceCents * item.quantity;
    lineItems.push({
      slug: resolved.slug,
      name: resolved.name,
      quantity: item.quantity,
      priceCents: resolved.priceCents,
      ...(resolved.variantLabel ? { variantLabel: resolved.variantLabel } : {}),
    });
    const product = getProductBySlug(item.slug);
    if (product?.requiresConsultation) requiresConsultation = true;
  }

  const [order] = await db.insert(ordersTable).values({
    customerName,
    email,
    phone: phone ?? null,
    shippingAddress,
    items: lineItems,
    totalCents,
    status: "pending",
    stripePaymentIntentId: paymentIntentId,
    requiresConsultation,
  }).returning();

  req.log.info({ id: order.id, email }, "Order created");

  const itemsList = lineItems.map(i => {
    const label = i.variantLabel ? ` (${i.variantLabel})` : "";
    return `  • ${i.name}${label} ×${i.quantity} — $${(i.priceCents / 100).toFixed(2)}`;
  }).join("\n");
  const totalDisplay = `$${(totalCents / 100).toFixed(2)}`;

  // Admin notification
  sendMail({
    subject: `New Order #${order.id} — ${customerName}`,
    text: [
      `New order received on Auryx.`,
      ``,
      `Order #${order.id}`,
      `Customer: ${customerName}`,
      `Email:    ${email}`,
      `Phone:    ${phone ?? "—"}`,
      ``,
      `Items:`,
      itemsList,
      ``,
      `Total: ${totalDisplay}`,
      ``,
      requiresConsultation ? `⚠️  CONSULTATION REQUIRED before fulfillment.` : `No consultation required.`,
      ``,
      `Shipping:`,
      `  ${shippingAddress.street}`,
      `  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`,
      ``,
      `Stripe Payment Intent: ${paymentIntentId}`,
      ``,
      `View in admin: auryxlife.com/admin`,
    ].join("\n"),
  }).catch(() => {});

  // Customer confirmation
  sendMail({
    to: email,
    subject: `Your Auryx Order Confirmation — #${order.id}`,
    text: [
      `Hi ${customerName},`,
      ``,
      `Thank you for your order. We've received it and our team will be in touch shortly.`,
      ``,
      `Order #${order.id}`,
      ``,
      `Items:`,
      itemsList,
      ``,
      `Total: ${totalDisplay}`,
      ``,
      requiresConsultation
        ? `One or more items in your order require a physician consultation before fulfillment. A member of our clinical team will reach out to you at ${email} to schedule a brief review.`
        : `Your order is being reviewed and will be fulfilled as soon as our clinical team processes it. Expected shipping within 24–48 hours after approval.`,
      ``,
      `Questions? Email us at admin@auryxlife.com`,
      ``,
      `— The Auryx Team`,
    ].join("\n"),
  }).catch(() => {});

  res.status(201).json(order);
});

// ── Admin: orders ──────────────────────────────────────────────────────────

router.get("/orders", sessionAuth, async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.patch("/orders/:id", sessionAuth, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = z.object({
    status: z.enum(ORDER_STATUSES).optional(),
    trackingNumber: z.string().optional().nullable(),
  }).safeParse(req.body);

  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  if (!parsed.data.status && parsed.data.trackingNumber === undefined) {
    res.status(400).json({ error: "No fields to update" }); return;
  }

  const updates: Partial<typeof ordersTable.$inferInsert> = {};
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.trackingNumber !== undefined) updates.trackingNumber = parsed.data.trackingNumber;

  const [order] = await db.update(ordersTable)
    .set(updates)
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) { res.status(404).json({ error: "Not found" }); return; }

  // Send customer email for every status change
  if (parsed.data.status) {
    sendOrderStatusEmail({
      id: order.id,
      email: order.email,
      customerName: order.customerName,
      status: order.status,
      trackingNumber: order.trackingNumber,
      items: order.items as { name: string; quantity: number; variantLabel?: string }[],
    });
  }

  res.json(order);
});

export default router;
