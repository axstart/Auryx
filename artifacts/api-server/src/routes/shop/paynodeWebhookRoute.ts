import { Router } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@workspace/db";
import { paymentEventsTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";

const router = Router();

// ── Signature helpers ──────────────────────────────────────────────────────

/**
 * PaymentNode doesn't publish their webhook signature spec, so we probe
 * common header candidates in order. The first hit is used.
 * Once we see a real event and log all headers, we'll know the exact one.
 */
const CANDIDATE_HEADERS = [
  "x-paymentnode-signature",
  "x-webhook-signature",
  "x-signature",
  "x-hub-signature-256",
];

function findSignatureHeader(
  headers: Record<string, string | string[] | undefined>,
): { header: string; value: string } | null {
  for (const h of CANDIDATE_HEADERS) {
    const val = headers[h];
    if (val) return { header: h, value: Array.isArray(val) ? val[0]! : val };
  }
  return null;
}

/**
 * HMAC-SHA256 verification. Accepts both raw hex and "sha256=<hex>" prefixed formats.
 * Uses constant-time comparison to prevent timing attacks.
 */
function verifyHmacSha256(rawBody: Buffer, secret: string, signature: string): boolean {
  const cleaned = signature.replace(/^(?:sha256=|hmac-sha256=)/i, "");
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  if (cleaned.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(cleaned, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

// ── Route ──────────────────────────────────────────────────────────────────

/**
 * POST /webhooks/paymentnode
 *
 * 1. If PAYMENTNODE_WEBHOOK_SECRET is set: verify HMAC-SHA256 against the raw body
 *    using the first recognised signature header found. Reject 401 on failure.
 * 2. If no known signature header is present: log ALL incoming headers for discovery
 *    (so we can identify the correct header from the first real sandbox event).
 * 3. Respond 200 immediately after verification, then log async.
 *
 * TODO: Once PaymentNode confirms their signature header name and algorithm,
 *   • pin CANDIDATE_HEADERS to the single confirmed header
 *   • remove the header-discovery fallback
 * TODO: Once real sandbox event shapes are available, add reconciliation logic
 *   to match events against `orders` by `paynode_payment_id` (e.g. update order
 *   status on payment.succeeded / payment.refunded / payment.failed).
 */
router.post("/webhooks/paymentnode", async (req, res) => {
  const rawBody = req.body as Buffer;
  const secret = process.env.PAYMENTNODE_WEBHOOK_SECRET;

  if (!secret) {
    logger.warn("PAYMENTNODE_WEBHOOK_SECRET not set — skipping signature verification");
    // Fall through to logging in dev/staging without a secret configured
  } else {
    const sigMatch = findSignatureHeader(req.headers as Record<string, string | string[] | undefined>);

    if (!sigMatch) {
      // No recognised signature header found — log all headers for discovery.
      // Do NOT reject yet: we may have the wrong candidate list.
      // Review these headers from the first real PaymentNode event and confirm
      // the correct header name before enabling hard rejection.
      const allHeaders: Record<string, string | string[] | undefined> = {};
      for (const [k, v] of Object.entries(req.headers)) {
        // Redact Authorization/Cookie but keep everything else for discovery
        if (k === "authorization" || k === "cookie") {
          allHeaders[k] = "[redacted]";
        } else {
          allHeaders[k] = v;
        }
      }
      logger.warn({ allHeaders }, "paymentnode webhook: no recognised signature header found — logging all headers for discovery. Review and confirm correct header name before enabling hard rejection.");
    } else {
      // Signature header found — verify it
      if (!verifyHmacSha256(rawBody, secret, sigMatch.value)) {
        logger.warn({ header: sigMatch.header }, "paymentnode webhook: HMAC signature verification failed");
        res.status(401).json({ error: "Invalid webhook signature" });
        return;
      }
      logger.info({ header: sigMatch.header }, "paymentnode webhook: signature verified");
    }
  }

  // Respond 200 immediately — before any async DB work
  res.status(200).json({ received: true });

  // Parse and log payload asynchronously
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

  try {
    await db.insert(paymentEventsTable).values({ eventType, payload: body });
    logger.info({ eventType }, "paymentnode webhook: event logged");
  } catch (err) {
    logger.error({ err, eventType }, "paymentnode webhook: failed to log event to DB");
  }
});

export default router;
