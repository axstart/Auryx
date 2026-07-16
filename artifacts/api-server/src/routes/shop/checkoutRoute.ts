import { Router } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { createHash, randomBytes, randomInt } from "crypto";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable, emailVerificationsTable } from "@workspace/db/schema";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import { sendMail } from "../../lib/mailer.js";
import { sendOrderStatusEmail } from "../../lib/orderEmail.js";
import { getProductBySlug } from "./products.js";
import { getIp } from "../../lib/loginRateLimiter.js";
import { checkPersistentRateLimit } from "../../lib/otpRateLimiter.js";
import { and, eq, isNull, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

// ── OTP helpers ────────────────────────────────────────────────────────────────

/**
 * Salted SHA-256. The salt is per-record (stored alongside the hash) — this is
 * defense in depth against precomputed/rainbow-table lookups. The primary
 * defense against brute force is the attempt counter + rate limits below,
 * since the salt alone doesn't change the fact that the OTP space is only
 * 10^6 and SHA-256 is fast to compute.
 */
function hashOtp(otp: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${otp}`).digest("hex");
}

function generateOtpSalt(): string {
  return randomBytes(16).toString("hex");
}

// Persistent (DB-backed) rate limits — survive restarts and work across
// multiple server instances, unlike an in-memory Map.
const OTP_REQUEST_WINDOW_MS = 10 * 60 * 1000;
const OTP_REQUEST_MAX = 3; // max /request-otp calls per email per window

const OTP_VERIFY_WINDOW_MS = 10 * 60 * 1000;
const OTP_VERIFY_MAX_PER_EMAIL = 15; // max /verify-otp calls per email per window
const OTP_VERIFY_MAX_PER_IP = 30; // max /verify-otp calls per IP per window, across all emails

// Per-record attempt limit — once a single OTP record has this many wrong
// guesses, it's permanently locked and a fresh code must be requested. This
// is the primary defense: it caps any single code's exposure regardless of
// how the attempts are distributed across time/IPs.
const MAX_OTP_ATTEMPTS = 5;

const CartItemSchema = z.object({
  slug: z.string(),
  quantity: z.number().int().min(1).max(10),
  variantLabel: z.string().optional(),
});

const CreatePaymentIntentSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  customerEmail: z.string().email().optional(),
});

const PO_BOX_RE = /^\s*(p\.?\s*o\.?\s*box|post\s+office\s+box|po\s+box)\b/i;

const ShippingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
}).refine(
  (addr) => !PO_BOX_RE.test(addr.street),
  { message: "P.O. Box addresses are not accepted. Please provide a physical shipping address.", path: ["street"] },
);

const RESEARCH_FIELDS = [
  "Longevity & healthspan research",
  "Metabolic function & body composition research",
  "Cognitive function & neuroprotection research",
  "Muscle recovery & physical performance research",
  "Immune function & cellular health research",
  "Analytical chemistry & quality assurance",
  "Academic or institutional research",
  "Other research application",
] as const;

const CompleteOrderSchema = z.object({
  paymentIntentId: z.string(),
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CartItemSchema).min(1),
  researchField: z.enum(RESEARCH_FIELDS).optional(),
  termsAccepted: z.literal(true, { message: "You must accept the Terms of Service" }),
}).superRefine((data, ctx) => {
  const hasResearchItems = data.items.some(item => {
    const product = getProductBySlug(item.slug);
    return product?.regulatoryStatus === "research";
  });
  if (hasResearchItems && !data.researchField) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Research application field is required for research-grade compounds",
      path: ["researchField"],
    });
  }
});

const ORDER_STATUSES = ["pending", "approved", "sent_to_pharmacy", "shipped", "delivered", "cancelled", "refunded"] as const;
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

// GET /checkout/paymentnode-public-key — PaymentNode's public key is designed to be
// exposed client-side (used for browser-side card tokenization, API 1B). Also serves
// the vault tokenization URL so no environment-specific URL is hardcoded in the frontend.
// Never expose PAYMENTNODE_MERCHANT_SECRET this way.
router.get("/checkout/paymentnode-public-key", (_req, res) => {
  const key = process.env.PAYMENTNODE_PUBLIC_KEY;
  const vaultHost = process.env.PAYMENTNODE_VAULT_HOST ?? "https://vault.paymentnode.io";
  if (!key) { res.status(500).json({ error: "PaymentNode not configured" }); return; }
  const vaultUrl = `${vaultHost}/payments/integration-api/payment-methods/tokenize`;
  res.json({ publicKey: key, vaultUrl });
});

// POST /checkout/request-otp — send 6-digit verification code to email
router.post("/checkout/request-otp", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Valid email required" }); return; }

  const email = parsed.data.email.toLowerCase();

  const allowed = await checkPersistentRateLimit(`otp-request:${email}`, OTP_REQUEST_MAX, OTP_REQUEST_WINDOW_MS);
  if (!allowed) {
    res.status(429).json({ error: "Too many verification requests. Please wait 10 minutes." });
    return;
  }

  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const otpSalt = generateOtpSalt();
  const otpHash = hashOtp(otp, otpSalt);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.insert(emailVerificationsTable).values({ email, otpHash, otpSalt, expiresAt });

  sendMail({
    to: parsed.data.email,
    subject: `Your Auryx verification code: ${otp}`,
    text: [
      `Your Auryx email verification code is:`,
      ``,
      `  ${otp}`,
      ``,
      `This code expires in 10 minutes.`,
      `If you did not request this, you can safely ignore this email.`,
      ``,
      `— The Auryx Team`,
    ].join("\n"),
  }).catch(() => {});

  res.json({ ok: true });
});

// POST /checkout/verify-otp — validate code and flag session as verified
router.post("/checkout/verify-otp", async (req, res) => {
  const parsed = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Email and 6-digit code required" }); return; }

  const email = parsed.data.email.toLowerCase();
  const ip = getIp(req as Parameters<typeof getIp>[0]);

  // Rate limit verify attempts themselves (independent of the per-record
  // attempt counter below) so an attacker can't sidestep a single record's
  // lockout by requesting fresh codes for many target emails, or hammer one
  // email from many IPs.
  const [emailAllowed, ipAllowed] = await Promise.all([
    checkPersistentRateLimit(`otp-verify-email:${email}`, OTP_VERIFY_MAX_PER_EMAIL, OTP_VERIFY_WINDOW_MS),
    checkPersistentRateLimit(`otp-verify-ip:${ip}`, OTP_VERIFY_MAX_PER_IP, OTP_VERIFY_WINDOW_MS),
  ]);
  if (!emailAllowed || !ipAllowed) {
    res.status(429).json({ error: "Too many verification attempts. Please wait a while and request a new code." });
    return;
  }

  const [record] = await db.select()
    .from(emailVerificationsTable)
    .where(and(
      eq(emailVerificationsTable.email, email),
      isNull(emailVerificationsTable.verifiedAt),
    ))
    .orderBy(sql`created_at DESC`)
    .limit(1);

  if (!record) {
    res.status(400).json({ error: "No pending verification found. Please request a new code." });
    return;
  }
  if (record.lockedAt || record.attemptCount >= MAX_OTP_ATTEMPTS) {
    res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    return;
  }
  if (new Date() > record.expiresAt) {
    res.status(400).json({ error: "Code has expired. Please request a new one." });
    return;
  }

  const otpHash = hashOtp(parsed.data.otp, record.otpSalt);
  if (record.otpHash !== otpHash) {
    // Atomically bump the attempt counter; lock the record once it hits the limit.
    const newAttemptCount = record.attemptCount + 1;
    const nowLocked = newAttemptCount >= MAX_OTP_ATTEMPTS;
    await db.update(emailVerificationsTable)
      .set({ attemptCount: newAttemptCount, ...(nowLocked ? { lockedAt: new Date() } : {}) })
      .where(eq(emailVerificationsTable.id, record.id));

    if (nowLocked) {
      res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    } else {
      res.status(400).json({ error: "Invalid code. Please try again." });
    }
    return;
  }

  await db.update(emailVerificationsTable)
    .set({ verifiedAt: new Date() })
    .where(eq(emailVerificationsTable.id, record.id));

  req.session.verifiedEmail = email;
  res.json({ ok: true });
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

  const { paymentIntentId, customerName, email, phone, shippingAddress, items, researchField, termsAccepted } = parsed.data;

  // Require verified email from session
  if (req.session.verifiedEmail !== email.toLowerCase()) {
    res.status(403).json({ error: "Email address has not been verified. Please complete email verification before placing an order." });
    return;
  }

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
    researchField,
    termsAccepted,
  }).returning();

  req.log.info({ id: order.id, email }, "Order created");

  // Deduct inventory stock for each ordered product (atomic, non-blocking)
  const stockBySlug = new Map<string, number>();
  for (const item of lineItems) {
    stockBySlug.set(item.slug, (stockBySlug.get(item.slug) ?? 0) + item.quantity);
  }
  for (const [slug, qty] of stockBySlug) {
    await db
      .update(inventoryItemsTable)
      .set({ stock: sql`GREATEST(0, ${inventoryItemsTable.stock} - ${qty})` })
      .where(eq(inventoryItemsTable.slug, slug));
  }

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
      `Customer:       ${customerName}`,
      `Email:          ${email}`,
      `Phone:          ${phone ?? "—"}`,
      `Research Field: ${researchField}`,
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

  // Clear verified email — one-time use
  req.session.verifiedEmail = undefined;

  res.status(201).json(order);
});

// ── Admin: orders ──────────────────────────────────────────────────────────

router.get("/orders", sessionAuth, async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  // Don’t leak payment_method_id in the general list
  const safeOrders = orders.map(o => {
    const { paymentMethodId, ...rest } = o;
    return rest;
  });
  res.json(safeOrders);
});

router.get("/orders/:id", sessionAuth, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
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
