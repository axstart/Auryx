import { Router } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { funnelEventsTable } from "@workspace/db/schema";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { checkPersistentRateLimit } from "../lib/otpRateLimiter.js";
import { desc, gte, sql, and, eq } from "drizzle-orm";

const router = Router();

const postSchema = z.object({
  sessionId: z.string().min(8).max(128),
  eventName: z.string().min(1).max(80),
  stepKey: z.string().max(80).optional().nullable(),
  productSlug: z.string().max(120).optional().nullable(),
  valueCents: z.number().int().min(0).max(10_000_000).optional().nullable(),
  meta: z.record(z.string(), z.unknown()).optional().nullable(),
});

router.post("/funnel-events", async (req, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event payload" });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const allowed = await checkPersistentRateLimit(`funnel:${ip}`, 120, 60_000);
  if (!allowed) {
    res.status(429).json({ error: "Too many events" });
    return;
  }

  const { sessionId, eventName, stepKey, productSlug, valueCents, meta } = parsed.data;

  await db.insert(funnelEventsTable).values({
    sessionId,
    eventName,
    stepKey: stepKey ?? null,
    productSlug: productSlug ?? null,
    valueCents: valueCents ?? null,
    meta: meta ?? null,
  });

  res.status(204).end();
});

router.get("/admin/funnel-events/summary", sessionAuth, async (req, res) => {
  const { from } = req.query as Record<string, string | undefined>;
  const since = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [byEvent, pfSteps, conversion] = await Promise.all([
    db
      .select({
        eventName: funnelEventsTable.eventName,
        count: sql<number>`count(*)::int`,
      })
      .from(funnelEventsTable)
      .where(gte(funnelEventsTable.createdAt, since))
      .groupBy(funnelEventsTable.eventName)
      .orderBy(desc(sql`count(*)`)),

    db
      .select({
        stepKey: funnelEventsTable.stepKey,
        eventName: funnelEventsTable.eventName,
        count: sql<number>`count(*)::int`,
      })
      .from(funnelEventsTable)
      .where(
        and(
          gte(funnelEventsTable.createdAt, since),
          sql`${funnelEventsTable.eventName} in ('pf_step_view', 'pf_step_complete', 'pf_drop_off')`,
        ),
      )
      .groupBy(funnelEventsTable.stepKey, funnelEventsTable.eventName)
      .orderBy(desc(sql`count(*)`)),

    db
      .select({
        eventName: funnelEventsTable.eventName,
        count: sql<number>`count(distinct ${funnelEventsTable.sessionId})::int`,
      })
      .from(funnelEventsTable)
      .where(
        and(
          gte(funnelEventsTable.createdAt, since),
          sql`${funnelEventsTable.eventName} in ('add_to_cart', 'begin_checkout', 'purchase')`,
        ),
      )
      .groupBy(funnelEventsTable.eventName),
  ]);

  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(funnelEventsTable)
    .where(gte(funnelEventsTable.createdAt, since));

  res.json({
    total: totalRow[0]?.count ?? 0,
    byEvent,
    pfSteps,
    conversion,
  });
});

router.get("/admin/funnel-events", sessionAuth, async (req, res) => {
  const { eventName } = req.query as Record<string, string | undefined>;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const conditions = [gte(funnelEventsTable.createdAt, since)];
  if (eventName && eventName !== "all") {
    conditions.push(eq(funnelEventsTable.eventName, eventName));
  }

  const rows = await db
    .select()
    .from(funnelEventsTable)
    .where(and(...conditions))
    .orderBy(desc(funnelEventsTable.createdAt))
    .limit(500);

  res.json(rows);
});

export default router;
