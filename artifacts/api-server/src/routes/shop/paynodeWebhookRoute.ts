import { Router } from "express";
import { db } from "@workspace/db";
import { paymentEventsTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";

const router = Router();

// ── Route ──────────────────────────────────────────────────────────────────

/**
 * POST /webhooks/paymentnode
 *
 * TEMPORARY DISCOVERY MODE: PaymentNode's integration docs don't specify a
 * signature header name or algorithm. Signature verification is intentionally
 * NOT implemented yet. Instead, every incoming request's full header set is
 * captured into `payment_events.raw_headers` so we can inspect a real event
 * and confirm the correct header/algorithm before enabling verification.
 *
 * TODO: Once PaymentNode confirms their signature header name and algorithm,
 *   • re-introduce HMAC verification using the confirmed header
 *   • reject unsigned/invalid requests with 401
 * TODO: Once real event shapes are available, add reconciliation logic
 *   to match events against `orders` by `paynode_payment_id` (e.g. update order
 *   status on payment.succeeded / payment.refunded / payment.failed).
 */
router.post("/webhooks/paymentnode", async (req, res) => {
  const rawBody = req.body as Buffer;

  // Respond 200 immediately — before any async DB work
  res.status(200).json({ received: true });

  const rawHeaders: Record<string, string | string[] | undefined> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    // Redact Authorization/Cookie but keep everything else for discovery
    if (k === "authorization" || k === "cookie") {
      rawHeaders[k] = "[redacted]";
    } else {
      rawHeaders[k] = v;
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>;
  } catch {
    logger.warn("paymentnode webhook: received non-JSON body — storing raw string");
    body = { _raw: rawBody.toString("utf8") };
  }

  const eventType =
    typeof body.type === "string" ? body.type
    : typeof body.event === "string" ? body.event
    : "unknown";

  logger.warn({ rawHeaders }, "paymentnode webhook: logging all headers for discovery (signature verification not yet implemented)");

  try {
    await db.insert(paymentEventsTable).values({ eventType, payload: body, rawHeaders });
    logger.info({ eventType }, "paymentnode webhook: event logged");
  } catch (err) {
    logger.error({ err, eventType }, "paymentnode webhook: failed to log event to DB");
  }
});

export default router;
