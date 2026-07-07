import { Router } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/sessionAuth.js";
import { refundPayment } from "../../lib/paymentnode.js";

const router = Router();

const RefundSchema = z.object({
  payment_id: z.string().min(1),
  amount: z.number().int().positive(),
});

/**
 * POST /admin/refund
 * Admin-only. Refunds a PaymentNode charge and updates the order status to "refunded".
 */
router.post("/admin/refund", requireAdmin, async (req, res) => {
  const parsed = RefundSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { payment_id, amount } = parsed.data;

  // Issue the refund via PaymentNode
  let refundResult;
  try {
    refundResult = await refundPayment(payment_id, amount);
  } catch (err: unknown) {
    const e = err as Error & { status?: number; responseBody?: unknown };
    req.log.error({ err: e.message, payment_id }, "paymentnode: refund failed");
    const msg = typeof (e.responseBody as Record<string, unknown>)?.message === "string"
      ? (e.responseBody as { message: string }).message
      : "Refund failed. Please try again or contact PaymentNode support.";
    res.status(e.status ?? 502).json({ success: false, error: msg });
    return;
  }

  // Update matching order status to "refunded"
  const [updatedOrder] = await db
    .update(ordersTable)
    .set({ status: "refunded" })
    .where(eq(ordersTable.paynodePaymentId, payment_id))
    .returning();

  if (updatedOrder) {
    req.log.info({ orderId: updatedOrder.id, payment_id }, "Order marked refunded");
  } else {
    req.log.warn({ payment_id }, "Refund issued but no matching order found in DB");
  }

  res.json({
    success: true,
    payment_id: refundResult._id,
    refunded: refundResult.refunded,
    orderId: updatedOrder?.id ?? null,
  });
});

export default router;
