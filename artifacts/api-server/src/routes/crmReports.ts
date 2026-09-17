import { Router } from "express";
import { sql, gte, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = Router();

router.get("/admin/crm/reports", sessionAuth, async (req, res) => {
  const { from } = req.query as Record<string, string | undefined>;
  const since = from ? new Date(from) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  const paidStatuses = sql`${ordersTable.status} in ('paid', 'approved', 'shipped', 'delivered', 'completed')`;

  const [ltvRows, frequencyRows, cohortRows, totals] = await Promise.all([
    db.execute(sql`
      SELECT lower(email) AS email,
             count(*)::int AS order_count,
             coalesce(sum(total_cents), 0)::int AS ltv_cents,
             min(created_at) AS first_order_at,
             max(created_at) AS last_order_at
      FROM orders
      WHERE created_at >= ${since}
        AND status IN ('paid', 'approved', 'shipped', 'delivered', 'completed')
      GROUP BY lower(email)
      ORDER BY ltv_cents DESC
      LIMIT 100
    `),
    db.execute(sql`
      SELECT
        CASE
          WHEN order_count = 1 THEN 'one_time'
          WHEN order_count = 2 THEN 'repeat_2'
          ELSE 'loyal_3plus'
        END AS segment,
        count(*)::int AS customers
      FROM (
        SELECT lower(email) AS email, count(*)::int AS order_count
        FROM orders
        WHERE created_at >= ${since}
          AND status IN ('paid', 'approved', 'shipped', 'delivered', 'completed')
        GROUP BY lower(email)
      ) t
      GROUP BY 1
    `),
    db.execute(sql`
      SELECT to_char(date_trunc('month', first_order), 'YYYY-MM') AS cohort_month,
             count(*)::int AS customers,
             coalesce(sum(ltv_cents), 0)::int AS cohort_ltv_cents
      FROM (
        SELECT lower(email) AS email,
               min(created_at) AS first_order,
               sum(total_cents)::int AS ltv_cents
        FROM orders
        WHERE status IN ('paid', 'approved', 'shipped', 'delivered', 'completed')
        GROUP BY lower(email)
      ) c
      WHERE first_order >= ${since}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 24
    `),
    db
      .select({
        orders: sql<number>`count(*)::int`,
        revenueCents: sql<number>`coalesce(sum(${ordersTable.totalCents}), 0)::int`,
        customers: sql<number>`count(distinct lower(${ordersTable.email}))::int`,
      })
      .from(ordersTable)
      .where(and(gte(ordersTable.createdAt, since), paidStatuses)),
  ]);

  const ltvList = (ltvRows.rows as Array<{
    email: string;
    order_count: number;
    ltv_cents: number;
    first_order_at: string;
    last_order_at: string;
  }>).map((r) => ({
    email: r.email,
    orderCount: r.order_count,
    ltvCents: r.ltv_cents,
    firstOrderAt: r.first_order_at,
    lastOrderAt: r.last_order_at,
  }));

  const avgLtv =
    ltvList.length > 0
      ? Math.round(ltvList.reduce((s, r) => s + r.ltvCents, 0) / ltvList.length)
      : 0;

  const repeatCustomers = ltvList.filter((r) => r.orderCount >= 2).length;
  const repeatRate =
    ltvList.length > 0 ? Math.round((repeatCustomers / ltvList.length) * 1000) / 10 : 0;

  res.json({
    since: since.toISOString(),
    totals: {
      orders: totals[0]?.orders ?? 0,
      revenueCents: totals[0]?.revenueCents ?? 0,
      customers: totals[0]?.customers ?? 0,
      avgLtvCents: avgLtv,
      repeatRatePercent: repeatRate,
    },
    topCustomers: ltvList.slice(0, 25),
    segments: frequencyRows.rows,
    cohorts: cohortRows.rows,
  });
});

export default router;
