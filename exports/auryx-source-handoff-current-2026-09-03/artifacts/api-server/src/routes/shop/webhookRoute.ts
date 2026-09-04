import { Router } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

const router = Router();

router.post("/stripe/webhook", async (req, res) => {
  const sigHeader = req.headers["stripe-signature"];
  const sig = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification (set this in production)");
    res.status(200).json({ received: true });
    return;
  }

  if (!sig) {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    logger.error({ err }, "Webhook signature verification failed");
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const [existing] = await db
          .select({ id: ordersTable.id, status: ordersTable.status })
          .from(ordersTable)
          .where(eq(ordersTable.stripePaymentIntentId, pi.id));

        if (!existing) {
          // The /checkout/complete endpoint may have failed — log for manual review
          logger.warn(
            { piId: pi.id, amount: pi.amount, email: pi.receipt_email },
            "payment_intent.succeeded — no matching order found; /checkout/complete may have failed"
          );
        } else {
          logger.info({ piId: pi.id, orderId: existing.id }, "payment_intent.succeeded — order confirmed in DB");
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        logger.warn(
          {
            piId: pi.id,
            amount: pi.amount,
            email: pi.receipt_email,
            lastError: pi.last_payment_error?.message,
            errorCode: pi.last_payment_error?.code,
          },
          "payment_intent.payment_failed"
        );
        break;
      }

      default:
        logger.info({ eventType: event.type }, "Stripe webhook received (unhandled type)");
    }
  } catch (err) {
    logger.error({ err, eventType: event.type }, "Webhook handler error");
  }

  res.status(200).json({ received: true });
});

export default router;
