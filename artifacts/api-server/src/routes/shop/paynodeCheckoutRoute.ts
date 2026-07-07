import { Router } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { tokenizePaymentMethod, chargePayment } from "../../lib/paymentnode.js";
import { getProductBySlug } from "./products.js";
import { sendMail } from "../../lib/mailer.js";

// ── Schemas ────────────────────────────────────────────────────────────────

const BillingAddressSchema = z.object({
  city: z.string().min(1),
  country: z.string().default("US"),
  line1: z.string().min(1),
  line2: z.string().optional().default(""),
  postal_code: z.string().min(1),
  province: z.string().min(1),
});

const ShippingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
});

const CartItemSchema = z.object({
  slug: z.string(),
  quantity: z.number().int().min(1).max(10),
  variantLabel: z.string().optional(),
});

// Card tokenize — raw card details come from the client form (server-side tokenize flow)
const TokenizeSchema = z.object({
  cardholderName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  billingAddress: BillingAddressSchema,
  // These are sensitive — never log them
  number: z.string().regex(/^\d{13,19}$/, "Invalid card number"),
  expiry_date: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry must be MM/YY"),
  cvd: z.string().regex(/^\d{3,4}$/, "CVD must be 3–4 digits"),
  type: z.string().min(1),
  last4digits: z.string().length(4),
});

const ChargeSchema = z.object({
  payment_method_id: z.string().min(1),
  order_id: z.string().min(1),
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CartItemSchema).min(1),
  researchField: z.string().optional(),
  termsAccepted: z.literal(true, { message: "You must accept the Terms of Service" }),
  metadata: z.record(z.unknown()).optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────

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
    if (!variant) return { priceCents: 0, name: product.name, slug: item.slug, error: `Unknown variant "${item.variantLabel}" for ${item.slug}` };
    priceCents = variant.priceCents;
  }
  return { priceCents, name: product.name, slug: product.slug, variantLabel: item.variantLabel };
}

// ── Router ─────────────────────────────────────────────────────────────────

const router = Router();

/**
 * POST /checkout/tokenize
 * Accepts raw card + billing details, calls PaymentNode vault, returns only { payment_method_id }.
 * Card number and CVD are never echoed back or logged.
 */
router.post("/checkout/tokenize", async (req, res) => {
  const parsed = TokenizeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { cardholderName, email, phone, billingAddress, number, expiry_date, cvd, type, last4digits } = parsed.data;

  try {
    const result = await tokenizePaymentMethod({
      name: cardholderName,
      email,
      phone,
      address: billingAddress,
      number,
      expiry_date,
      cvd,
      type,
      last4digits,
    });

    res.json({ payment_method_id: result.payment_method_id });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    req.log.error({ err: e.message, status: e.status }, "paymentnode: tokenize failed");
    res.status(e.status ?? 502).json({ error: "Card tokenization failed. Please check your card details." });
  }
});

/**
 * POST /checkout/charge
 * Accepts { payment_method_id, order_id, customerName, email, phone,
 *           shippingAddress, items, researchField, termsAccepted, metadata? }.
 * Computes amount server-side from items. Charges via PaymentNode, creates order on success.
 */
router.post("/checkout/charge", async (req, res) => {
  const parsed = ChargeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const {
    payment_method_id,
    order_id,
    customerName,
    email,
    phone,
    shippingAddress,
    items,
    researchField,
    termsAccepted,
    metadata,
  } = parsed.data;

  // Resolve and compute total server-side — never trust client-supplied amount
  const lineItems: { slug: string; name: string; quantity: number; priceCents: number; variantLabel?: string }[] = [];
  let totalCents = 0;
  let requiresConsultation = false;

  for (const item of items) {
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
    const product = getProductBySlug(item.slug);
    if (product?.requiresConsultation) requiresConsultation = true;
  }

  // Charge via PaymentNode
  let chargeResult;
  try {
    chargeResult = await chargePayment({
      amount: totalCents,
      order_id,
      payment_method_id,
      currency_code: "USD",
      metadata: { ...metadata, source: "auryx-checkout" },
    });
  } catch (err: unknown) {
    const e = err as Error & { status?: number; responseBody?: unknown };
    req.log.error({ err: e.message, order_id }, "paymentnode: charge failed");
    const msg = typeof (e.responseBody as Record<string, unknown>)?.message === "string"
      ? (e.responseBody as { message: string }).message
      : "Payment charge failed. Please try again.";
    res.status(402).json({ success: false, error: msg });
    return;
  }

  // Create order record only after confirmed charge success
  let order;
  try {
    [order] = await db.insert(ordersTable).values({
      customerName,
      email,
      phone: phone ?? null,
      shippingAddress,
      items: lineItems,
      totalCents,
      status: "pending",
      paynodePaymentId: chargeResult.id,
      requiresConsultation,
      researchField,
      termsAccepted,
    }).returning();
  } catch (err) {
    req.log.error({ err, payment_id: chargeResult.id }, "Order DB insert failed after successful charge");
    // Charge succeeded but DB write failed — still return success with payment_id so it can be reconciled
    res.status(201).json({ success: true, payment_id: chargeResult.id, orderId: null, warning: "Order record could not be saved — please contact support with your payment ID." });
    return;
  }

  req.log.info({ orderId: order.id, payment_id: chargeResult.id, email }, "Order created via PaymentNode");

  // Deduct inventory stock
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

  sendMail({
    subject: `New Order #${order.id} — ${customerName} (PaymentNode)`,
    text: [
      `New order received on Auryx via PaymentNode.`,
      ``,
      `Order #${order.id}`,
      `Customer: ${customerName}`,
      `Email:    ${email}`,
      `Phone:    ${phone ?? "—"}`,
      ``,
      `Items:`,
      itemsList,
      `Total: ${totalDisplay}`,
      ``,
      requiresConsultation ? `⚠️  CONSULTATION REQUIRED before fulfillment.` : `No consultation required.`,
      ``,
      `PaymentNode Payment ID: ${chargeResult.id}`,
    ].join("\n"),
  }).catch(() => {});

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
      `Total: ${totalDisplay}`,
      ``,
      requiresConsultation
        ? `One or more items in your order require a physician consultation before fulfillment. A member of our clinical team will reach out to you.`
        : `Your order is being reviewed and will be fulfilled as soon as our clinical team processes it.`,
      ``,
      `Questions? Email us at admin@auryxlife.com`,
      ``,
      `— The Auryx Team`,
    ].join("\n"),
  }).catch(() => {});

  res.status(201).json({ success: true, payment_id: chargeResult.id, orderId: order.id });
});

export default router;
