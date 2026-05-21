import { Router } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { sendMail } from "../../lib/mailer.js";
import { getProductBySlug } from "./products.js";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-04-30.basil",
});

const CartItemSchema = z.object({
  slug: z.string(),
  quantity: z.number().int().min(1).max(10),
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
  const lineItems: { slug: string; name: string; quantity: number; priceCents: number }[] = [];

  for (const item of parsed.data.items) {
    const product = getProductBySlug(item.slug);
    if (!product) {
      res.status(400).json({ error: `Unknown product: ${item.slug}` });
      return;
    }
    totalCents += product.priceCents * item.quantity;
    lineItems.push({ slug: product.slug, name: product.name, quantity: item.quantity, priceCents: product.priceCents });
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

  // Verify payment with Stripe
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
  const lineItems: { slug: string; name: string; quantity: number; priceCents: number }[] = [];
  let requiresConsultation = false;

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) continue;
    totalCents += product.priceCents * item.quantity;
    lineItems.push({ slug: product.slug, name: product.name, quantity: item.quantity, priceCents: product.priceCents });
    if (product.requiresConsultation) requiresConsultation = true;
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

  const itemsList = lineItems.map(i => `  • ${i.name} ×${i.quantity} — $${(i.priceCents / 100).toFixed(2)}`).join("\n");
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
        : `Your order is being reviewed and will be fulfilled as soon as our clinical team processes it.`,
      ``,
      `Questions? Email us at admin@auryxlife.com`,
      ``,
      `— The Auryx Team`,
    ].join("\n"),
  }).catch(() => {});

  res.status(201).json(order);
});

// ── Admin: orders ──────────────────────────────────────────────────────────

router.get("/orders", adminAuth, async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.patch("/orders/:id", adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = z.object({
    status: z.enum(["pending", "approved", "shipped"]),
  }).safeParse(req.body);

  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [order] = await db.update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
});

export default router;
