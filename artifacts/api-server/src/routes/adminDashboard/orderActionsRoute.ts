import { Router } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/sessionAuth.js";
import { chargePayment, refundPayment } from "../../lib/paymentnode.js";
import { sendOrderApprovedEmail, sendOrderCancelledEmail } from "../../lib/orderEmail.js";
import { sendMail } from "../../lib/mailer.js";

const router = Router();

/**
 * POST /admin/orders/:id/approve
 * Admin-only.
 * - Deferred-charge orders (have paymentMethodId, no paynodePaymentId):
 *   Charges the stored card via PaymentNode, then updates status to "approved".
 * - Already-charged orders (have paynodePaymentId):
 *   Skips re-charging; just updates status to "approved".
 */
router.post("/admin/orders/:id/approve", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (order.status !== "pending") {
    res.status(409).json({ error: `Order is already ${order.status}` });
    return;
  }

  const alreadyCharged = !!order.paynodePaymentId;
  let chargeResultId: string | undefined;

  if (!alreadyCharged) {
    if (!order.paymentMethodId) {
      res.status(409).json({ error: "Order has no stored payment method. Cannot charge." });
      return;
    }

    // Charge via PaymentNode
    try {
      const chargeResult = await chargePayment({
        amount: order.totalCents / 100,
        order_id: `order-${order.id}`,
        payment_method_id: order.paymentMethodId,
        currency_code: "USD",
        metadata: { source: "auryx-checkout", order_id: order.id },
      });
      chargeResultId = chargeResult.id;
    } catch (err: unknown) {
      const e = err as Error & { status?: number; responseBody?: unknown };
      req.log.error({ err: e.message, order_id: order.id }, "paymentnode: admin approval charge failed");
      const msg = typeof (e.responseBody as Record<string, unknown>)?.message === "string"
        ? (e.responseBody as { message: string }).message
        : "Charge failed. Please try again.";
      res.status(402).json({ success: false, error: msg });
      return;
    }
  }

  // Update order status
  const updateSet: { status: "approved"; paynodePaymentId?: string } = { status: "approved" };
  if (chargeResultId) updateSet.paynodePaymentId = chargeResultId;

  const [updated] = await db.update(ordersTable)
    .set(updateSet)
    .where(eq(ordersTable.id, id))
    .returning();

  // Send customer approval email
  sendOrderApprovedEmail({
    id: updated.id,
    email: updated.email,
    customerName: updated.customerName,
    status: updated.status,
    items: updated.items as { name: string; quantity: number; variantLabel?: string }[],
  });

  res.json({
    success: true,
    order: updated,
    payment_id: chargeResultId ?? order.paynodePaymentId,
    charged: !alreadyCharged,
  });
});

const CancelSchema = z.object({
  reason: z.string().max(500).optional(),
});

/**
 * POST /admin/orders/:id/cancel
 * Admin-only. Cancels an order.
 * - If order was never charged (no paynodePaymentId): marks as "cancelled" and restores inventory.
 * - If order was charged: refunds full amount via PaymentNode, marks as "refunded".
 *   Inventory is NOT automatically restored for refunded orders (may be shipped / returned separately).
 * Accepts optional { reason } body for customer email.
 */
router.post("/admin/orders/:id/cancel", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = CancelSchema.safeParse(req.body);
  const reason = parsed.success ? parsed.data.reason : undefined;

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (order.status === "cancelled" || order.status === "refunded") {
    res.status(409).json({ error: `Order is already ${order.status}` });
    return;
  }

  let updated: typeof order;
  let refunded = false;

  // If order was already charged, refund it first
  if (order.paynodePaymentId) {
    try {
      await refundPayment(order.paynodePaymentId, order.totalCents / 100);
    } catch (err: unknown) {
      const e = err as Error & { status?: number; responseBody?: unknown };
      req.log.error({ err: e.message, order_id: id, payment_id: order.paynodePaymentId }, "paymentnode: admin cancel refund failed");
      const msg = typeof (e.responseBody as Record<string, unknown>)?.message === "string"
        ? (e.responseBody as { message: string }).message
        : "Refund failed. Please try again.";
      res.status(502).json({ success: false, error: msg });
      return;
    }

    [updated] = await db.update(ordersTable)
      .set({ status: "refunded" })
      .where(eq(ordersTable.id, id))
      .returning();

    refunded = true;
  } else {
    // Order was never charged — simple cancel
    [updated] = await db.update(ordersTable)
      .set({ status: "cancelled" })
      .where(eq(ordersTable.id, id))
      .returning();

    // Restore inventory
    const items = updated.items as { slug: string; quantity: number }[];
    const stockBySlug = new Map<string, number>();
    for (const item of items) {
      stockBySlug.set(item.slug, (stockBySlug.get(item.slug) ?? 0) + item.quantity);
    }
    for (const [slug, qty] of stockBySlug) {
      await db
        .update(inventoryItemsTable)
        .set({ stock: sql`${inventoryItemsTable.stock} + ${qty}` })
        .where(eq(inventoryItemsTable.slug, slug));
    }
  }

  // Send customer cancellation email
  sendOrderCancelledEmail({
    id: updated.id,
    email: updated.email,
    customerName: updated.customerName,
    items: updated.items as { name: string; quantity: number; variantLabel?: string }[],
    reason,
    refunded,
  });

  res.json({ success: true, order: updated, refunded });
});

/**
 * POST /admin/orders/:id/email
 * Admin-only. Sends a custom email to the customer from admin@auryxlife.com.
 */
router.post("/admin/orders/:id/email", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { subject, message } = req.body as { subject: string; message: string };
  if (!subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: "Subject and message are required" });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  const firstName = order.customerName.split(" ")[0] ?? order.customerName;

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;"><tr><td align="center" style="padding:48px 20px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">
<tr><td style="padding:28px 40px 24px;border-bottom:1px solid #1c1c1c;"><p style="margin:0;font-size:16px;letter-spacing:0.25em;color:#C9A844;font-weight:400;">AURYX</p></td></tr>
<tr><td style="padding:36px 40px 32px;">
<p style="margin:0 0 24px;font-size:22px;color:#EEEEEE;font-weight:400;line-height:1.3;">${subject.replace(/"/g, "&quot;")}</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#AAAAAA;">Hi ${firstName.replace(/"/g, "&quot;")},</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#AAAAAA;">${message.replace(/\n/g, "<br>").replace(/"/g, "&quot;")}</p>
</td></tr>
<tr><td style="padding:20px 40px 24px;border-top:1px solid #1c1c1c;"><p style="margin:0;font-size:12px;color:#404040;line-height:1.6;">\u00a9 Auryx \u00b7 <a href="https://auryxlife.com" style="color:#C9A844;text-decoration:none;">auryxlife.com</a> \u00b7 <a href="mailto:admin@auryxlife.com" style="color:#666666;text-decoration:none;">admin@auryxlife.com</a></p></td></tr>
</table>
</td></tr></table>
</body></html>`;

  try {
    await sendMail({
      to: order.email,
      subject: `Auryx \u2014 ${subject}`,
      text: `Hi ${firstName},\n\n${message}\n\n\u2014 The Auryx Team | auryxlife.com`,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err, order_id: id }, "admin email failed");
    res.status(502).json({ error: "Email failed to send. Please try again." });
  }
});

export default router;
