import { Router } from "express";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  cartAbandonSnapshotsTable,
  emailJourneyStateTable,
  marketingSubscribersTable,
} from "@workspace/db/schema";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import { sendMail } from "../../lib/mailer.js";
import { checkPersistentRateLimit } from "../../lib/otpRateLimiter.js";

const router = Router();
const SITE = "https://www.auryxlife.com";

async function upsertSubscriber(email: string, name?: string, source = "checkout") {
  const normalized = email.trim().toLowerCase();
  await db
    .insert(marketingSubscribersTable)
    .values({ email: normalized, name: name ?? null, source })
    .onConflictDoUpdate({
      target: marketingSubscribersTable.email,
      set: { name: name ?? null },
    });
  return normalized;
}

async function enrollJourney(
  email: string,
  journey: string,
  delayMs: number,
  meta?: string,
) {
  const nextSendAt = new Date(Date.now() + delayMs);
  await db
    .insert(emailJourneyStateTable)
    .values({
      email,
      journey,
      step: 0,
      nextSendAt,
      status: "active",
      meta: meta ?? null,
    })
    .onConflictDoUpdate({
      target: [emailJourneyStateTable.email, emailJourneyStateTable.journey],
      set: {
        status: "active",
        step: 0,
        nextSendAt,
        meta: meta ?? null,
        updatedAt: new Date(),
      },
    });
}

router.post("/marketing/cart-snapshot", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().max(120).optional(),
    cartJson: z.string().min(2).max(20_000),
    totalCents: z.number().int().min(0).max(10_000_000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const allowed = await checkPersistentRateLimit(`cartsnap:${ip}`, 30, 60_000);
  if (!allowed) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const email = await upsertSubscriber(parsed.data.email, parsed.data.name, "checkout");
  await db.insert(cartAbandonSnapshotsTable).values({
    email,
    cartJson: parsed.data.cartJson,
    totalCents: parsed.data.totalCents,
  });

  // Abandon email after 4 hours if not converted
  await enrollJourney(email, "cart_abandon", 4 * 60 * 60 * 1000, parsed.data.cartJson);
  res.status(204).end();
});

router.post("/marketing/subscribe", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().max(120).optional(),
    source: z.string().max(40).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }
  const email = await upsertSubscriber(parsed.data.email, parsed.data.name, parsed.data.source ?? "manual");
  await enrollJourney(email, "welcome", 5 * 60 * 1000);
  res.json({ ok: true });
});

router.get("/marketing/unsubscribe", async (req, res) => {
  const email = String(req.query.email ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    res.status(400).send("Missing email");
    return;
  }
  await db
    .update(marketingSubscribersTable)
    .set({ unsubscribedAt: new Date() })
    .where(eq(marketingSubscribersTable.email, email));
  await db
    .update(emailJourneyStateTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(and(eq(emailJourneyStateTable.email, email), eq(emailJourneyStateTable.status, "active")));
  res.type("html").send(`<!doctype html><html><body style="font-family:sans-serif;padding:2rem">
    <h1>Unsubscribed</h1><p>${email} has been removed from marketing emails.</p>
    <p><a href="${SITE}">Return to Auryx</a></p></body></html>`);
});

/** Mark cart journeys converted after a paid order. */
export async function onOrderPaidForMarketing(email: string, name?: string) {
  const normalized = await upsertSubscriber(email, name, "order");
  await db
    .update(cartAbandonSnapshotsTable)
    .set({ converted: true, updatedAt: new Date() })
    .where(and(eq(cartAbandonSnapshotsTable.email, normalized), eq(cartAbandonSnapshotsTable.converted, false)));
  await db
    .update(emailJourneyStateTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(emailJourneyStateTable.email, normalized),
        eq(emailJourneyStateTable.journey, "cart_abandon"),
        eq(emailJourneyStateTable.status, "active"),
      ),
    );
  await enrollJourney(normalized, "welcome", 10 * 60 * 1000);
  await enrollJourney(normalized, "post_purchase", 3 * 24 * 60 * 60 * 1000);
}

function unsubUrl(email: string) {
  return `${SITE}/api/marketing/unsubscribe?email=${encodeURIComponent(email)}`;
}

async function isUnsubscribed(email: string) {
  const [row] = await db
    .select()
    .from(marketingSubscribersTable)
    .where(eq(marketingSubscribersTable.email, email))
    .limit(1);
  return Boolean(row?.unsubscribedAt);
}

async function sendJourneyEmail(journey: string, email: string, step: number) {
  const unsub = unsubUrl(email);
  const footer = `\n\n—\nAuryx\nUnsubscribe: ${unsub}`;

  if (journey === "welcome" && step === 0) {
    await sendMail({
      to: email,
      subject: "Welcome to Auryx",
      text: `Welcome to Auryx. Explore physician-guided peptide protocols at ${SITE}/protocol-finder and ${SITE}/shop.${footer}`,
    });
    return true;
  }
  if (journey === "cart_abandon" && step === 0) {
    await sendMail({
      to: email,
      subject: "Your Auryx cart is waiting",
      text: `You left items in your cart. Complete checkout anytime: ${SITE}/checkout\n\nIf you have questions, reply to this email or visit ${SITE}/contact.${footer}`,
    });
    return true;
  }
  if (journey === "post_purchase" && step === 0) {
    await sendMail({
      to: email,
      subject: "How is your Auryx protocol going?",
      text: `Thank you for your order. If you need guidance on reconstitution or next steps, start a consult at ${SITE} or chat with Aria on the site.${footer}`,
    });
    return true;
  }
  if (journey === "win_back" && step === 0) {
    await sendMail({
      to: email,
      subject: "We'd love to see you back at Auryx",
      text: `It's been a while. When you're ready to continue, revisit ${SITE}/shop or run Protocol Finder again: ${SITE}/protocol-finder.${footer}`,
    });
    return true;
  }
  return false;
}

export async function processEmailJourneys(): Promise<number> {
  const dueFixed = await db
    .select()
    .from(emailJourneyStateTable)
    .where(
      and(
        eq(emailJourneyStateTable.status, "active"),
        sql`${emailJourneyStateTable.nextSendAt} is not null and ${emailJourneyStateTable.nextSendAt} <= now()`,
      ),
    )
    .limit(50);

  let sent = 0;
  for (const row of dueFixed) {
    if (await isUnsubscribed(row.email)) {
      await db
        .update(emailJourneyStateTable)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(emailJourneyStateTable.id, row.id));
      continue;
    }

    if (row.journey === "cart_abandon") {
      const [snap] = await db
        .select()
        .from(cartAbandonSnapshotsTable)
        .where(and(eq(cartAbandonSnapshotsTable.email, row.email), eq(cartAbandonSnapshotsTable.converted, false)))
        .orderBy(sql`${cartAbandonSnapshotsTable.createdAt} desc`)
        .limit(1);
      if (!snap) {
        await db
          .update(emailJourneyStateTable)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(emailJourneyStateTable.id, row.id));
        continue;
      }
    }

    const ok = await sendJourneyEmail(row.journey, row.email, row.step);
    if (!ok) {
      await db
        .update(emailJourneyStateTable)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(emailJourneyStateTable.id, row.id));
      continue;
    }

    sent += 1;
    await db
      .update(emailJourneyStateTable)
      .set({
        status: "completed",
        step: row.step + 1,
        lastSentAt: new Date(),
        nextSendAt: null,
        updatedAt: new Date(),
      })
      .where(eq(emailJourneyStateTable.id, row.id));
  }
  return sent;
}

/** Enroll win-back for customers with no order in 60+ days. */
export async function enrollWinBackCandidates(): Promise<number> {
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const rows = await db.execute(sql`
    SELECT lower(email) AS email, max(created_at) AS last_order
    FROM orders
    WHERE status IN ('paid', 'approved', 'shipped', 'delivered', 'completed')
    GROUP BY lower(email)
    HAVING max(created_at) < ${cutoff}
    LIMIT 100
  `);

  let n = 0;
  for (const r of rows.rows as Array<{ email: string }>) {
    const email = r.email;
    if (await isUnsubscribed(email)) continue;
    const [existing] = await db
      .select()
      .from(emailJourneyStateTable)
      .where(
        and(
          eq(emailJourneyStateTable.email, email),
          eq(emailJourneyStateTable.journey, "win_back"),
          eq(emailJourneyStateTable.status, "active"),
        ),
      )
      .limit(1);
    if (existing) continue;
    // Don't re-send win-back within 90 days of last completion
    const [recent] = await db
      .select()
      .from(emailJourneyStateTable)
      .where(
        and(
          eq(emailJourneyStateTable.email, email),
          eq(emailJourneyStateTable.journey, "win_back"),
          eq(emailJourneyStateTable.status, "completed"),
          sql`${emailJourneyStateTable.lastSentAt} > now() - interval '90 days'`,
        ),
      )
      .limit(1);
    if (recent) continue;
    await enrollJourney(email, "win_back", 60 * 60 * 1000);
    n += 1;
  }
  return n;
}

router.post("/admin/marketing/process-journeys", sessionAuth, requireAdmin, async (_req, res) => {
  const winBack = await enrollWinBackCandidates();
  const sent = await processEmailJourneys();
  res.json({ sent, winBackEnrolled: winBack });
});

router.get("/admin/marketing/journeys", sessionAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(emailJourneyStateTable)
    .orderBy(sql`${emailJourneyStateTable.updatedAt} desc`)
    .limit(200);
  res.json(rows);
});

export default router;
