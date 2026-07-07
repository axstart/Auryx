import { Router } from "express";
import { db } from "@workspace/db";
import { paymentEventsTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";

const router = Router();

/**
 * POST /webhooks/paymentnode
 *
 * Receives raw event payloads from PaymentNode and logs them to `payment_events`.
 * Responds 200 immediately — no synchronous processing.
 *
 * TODO: Once real sandbox event examples are available from PaymentNode, add
 * reconciliation logic here to match events against the `orders` table by
 * `paynode_payment_id` (e.g. update order status on payment.succeeded,
 * payment.refunded, payment.failed events).
 */
router.post("/webhooks/paymentnode", async (req, res) => {
  // Respond 200 immediately before any async work
  res.status(200).json({ received: true });

  const body = req.body as Record<string, unknown>;
  const eventType = typeof body?.type === "string" ? body.type
    : typeof body?.event === "string" ? body.event
    : "unknown";

  try {
    await db.insert(paymentEventsTable).values({
      eventType,
      payload: body,
    });
    logger.info({ eventType }, "paymentnode webhook: event logged");
  } catch (err) {
    logger.error({ err, eventType }, "paymentnode webhook: failed to log event to DB");
  }
});

export default router;
