import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/sessionAuth.js";
import { chargePayment, refundPayment } from "../../lib/paymentnode.js";
import { sendOrderStatusEmail } from "../../lib/orderEmail.js";

const router = Router();

/**
 * POST /admin/orders/:id/approve
 * Admin-only. Charges a pending order using its stored payment_method_id,
 * then updates status to "approved" and records the PaymentNode payment id.
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
  if (!order.paymentMethodId) {
    res.status(409).json({ error: "Order has no stored payment method. Cannot charge." });
    return;
  }

  // Charge via PaymentNode
  let chargeResult;
  try {
    chargeResult = await chargePayment({
      amount: order.totalCents / 100,
      order_id: `order-${order.id}`,
      payment_method_id: order.paymentMethodId,
      currency_code: "USD",
      metadata: { source: "auryx-checkout", order_id: order.id },
    });
  } catch (err: unknown) {
    const e = err as Error & { status?: number; responseBody?: unknown };
    req.log.error({ err: e.message, order_id: order.id }, "paymentnode: admin approval charge failed");
    const msg = typeof (e.responseBody as Record<string, unknown>)?.message === "string"
      ? (e.responseBody as { message: string }).message
      : "Charge failed. Please try again.";
    res.status(402).json({ success: false, error: msg });
    return;
  }

  // Update order status
  const [updated] = await db.update(ordersTable)
    .set({ status: "approved", paynodePaymentId: chargeResult.id })
    .where(eq(ordersTable.id, id))
    .returning();

  // Send customer approval email
  sendOrderStatusEmail({
    id: updated.id,
    email: updated.email,
    customerName: updated.customerName,
    status: updated.status,
    items: updated.items as { name: string; quantity: number; variantLabel?: string }[],
  });

  res.json({ success: true, order: updated, payment_id: chargeResult.id });
});

/**
 * POST /admin/orders/:id/cancel
 * Admin-only. Cancels an order.
 * - If order was never charged (no paynodePaymentId): marks as "cancelled" and restores inventory.
 * - If order was charged: refunds full amount via PaymentNode, marks as "refunded".
 *   Inventory is NOT automatically restored for refunded orders (may be shipped / returned separately).
 */
router.post("/admin/orders/:id/cancel", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (order.status === "cancelled" || order.status === "refunded") {
    res.status(409).json({ error: `Order is already ${order.status}` });
    return;
  }

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

    const [updated] = await db.update(ordersTable)
      .set({ status: "refunded" })
      .where(eq(ordersTable.id, id))
      .returning();

    res.json({ success: true, order: updated, refunded: true });
    return;
  }

  // Order was never charged — simple cancel
  const [updated] = await db.update(ordersTable)
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

  res.json({ success: true, order: updated, refunded: false });
});

export default router;
