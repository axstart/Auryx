import { createHmac, timingSafeEqual } from "crypto";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { paymentEventsTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";

const router = Router();

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

// ── Signature verification ──────────────────────────────────────────────────

/**
 * HMAC-SHA256 over the RAW request body, base64url-encoded, compared to the
 * x-signature header via a constant-time comparison. Per PaymentNode's
 * published webhook spec.
 */
function verifySignature(rawBody: Buffer, secret: string, signatureHeader: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("base64url");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");

  // timingSafeEqual throws on length mismatch — a length mismatch just means
  // "not equal", so short-circuit before calling it.
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}

function isWithinReplayWindow(timestampHeader: string): boolean {
  const ts = Date.parse(timestampHeader);
  if (Number.isNaN(ts)) return false;

  const delta = Date.now() - ts;
  return delta >= -REPLAY_WINDOW_MS && delta <= REPLAY_WINDOW_MS;
}

function headerValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Best-effort event type extraction for logging — never trust this before verification passes. */
function tryExtractEventType(rawBody: Buffer): string | undefined {
  try {
    const parsed = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>;
    return typeof parsed.type === "string" ? parsed.type
      : typeof parsed.event === "string" ? parsed.event
      : undefined;
  } catch {
    return undefined;
  }
}

// ── Route ──────────────────────────────────────────────────────────────────

/**
 * POST /webhooks/paymentnode
 *
 * Body is captured raw (see app.ts — express.raw() runs before express.json()
 * for this path) so the HMAC signature can be computed over the exact bytes
 * PaymentNode signed. JSON parsing only happens after verification passes.
 */
router.post("/webhooks/paymentnode", async (req, res) => {
  const rawBody = req.body as Buffer;

  const webhookId = headerValue(req.headers["x-webhook-id"]);
  const idempotencyKey = headerValue(req.headers["x-idempotency-key"]);
  const timestampHeader = headerValue(req.headers["x-timestamp"]);
  const signatureHeader = headerValue(req.headers["x-signature"]);

  // Trim defensively — secret values pasted into env/secrets managers can pick
  // up a trailing newline/space, which would otherwise silently break every
  // signature comparison.
  const secret = process.env.PAYMENTNODE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    logger.error("PAYMENTNODE_WEBHOOK_SECRET not set — rejecting webhook (cannot verify signature)");
    res.status(401).json({ error: "Webhook verification not configured" });
    return;
  }

  if (!signatureHeader) {
    logger.warn(
      { webhookId, idempotencyKey, timestamp: timestampHeader, verified: false },
      "paymentnode webhook: missing x-signature header — rejected"
    );
    res.status(401).json({ error: "Missing signature" });
    return;
  }

  const verified = verifySignature(rawBody, secret, signatureHeader);
  if (!verified) {
    logger.warn(
      {
        webhookId,
        idempotencyKey,
        timestamp: timestampHeader,
        eventType: tryExtractEventType(rawBody),
        verified: false,
      },
      "paymentnode webhook: signature verification failed — rejected"
    );
    res.status(401).json({ error: "Signature verification failed" });
    return;
  }

  if (!timestampHeader || !isWithinReplayWindow(timestampHeader)) {
    logger.warn(
      {
        webhookId,
        idempotencyKey,
        timestamp: timestampHeader,
        eventType: tryExtractEventType(rawBody),
        verified: true,
      },
      "paymentnode webhook: timestamp outside replay window — rejected"
    );
    res.status(401).json({ error: "Timestamp outside acceptable window" });
    return;
  }

  // Signature + timestamp are valid past this point — safe to parse and trust the payload.
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>;
  } catch {
    logger.warn(
      { webhookId, idempotencyKey, timestamp: timestampHeader, verified: true },
      "paymentnode webhook: verified but body is not valid JSON — rejected"
    );
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const eventType =
    typeof body.type === "string" ? body.type
    : typeof body.event === "string" ? body.event
    : "unknown";

  // Idempotency check — if we've already processed this key, ack without reprocessing.
  if (idempotencyKey) {
    const [existing] = await db
      .select({ id: paymentEventsTable.id })
      .from(paymentEventsTable)
      .where(eq(paymentEventsTable.idempotencyKey, idempotencyKey));

    if (existing) {
      logger.info(
        { webhookId, idempotencyKey, timestamp: timestampHeader, eventType, verified: true },
        "paymentnode webhook: duplicate delivery — already processed, skipping"
      );
      res.status(200).json({ received: true, duplicate: true });
      return;
    }
  }

  // Acknowledge immediately; any slower reconciliation work happens after the response.
  res.status(200).json({ received: true });

  logger.info(
    { webhookId, idempotencyKey, timestamp: timestampHeader, eventType, verified: true },
    "paymentnode webhook: verified event received"
  );

  try {
    await db.insert(paymentEventsTable).values({
      eventType,
      payload: body,
      webhookId,
      idempotencyKey,
      verified: true,
    });
    logger.info({ webhookId, idempotencyKey, eventType }, "paymentnode webhook: event logged");
  } catch (err) {
    // Unique violation on idempotencyKey means a concurrent duplicate delivery raced us — not an error.
    const isUniqueViolation = (err as { code?: string })?.code === "23505";
    if (isUniqueViolation) {
      logger.info({ webhookId, idempotencyKey, eventType }, "paymentnode webhook: concurrent duplicate delivery — ignored");
    } else {
      logger.error({ err, webhookId, idempotencyKey, eventType }, "paymentnode webhook: failed to log event to DB");
    }
    return;
  }

  // TODO: once real event shapes are confirmed, add reconciliation logic to
  // match events against `orders` by `paynode_payment_id` (e.g. update order
  // status on payment.succeeded / payment.refunded / payment.failed).
});

export default router;
