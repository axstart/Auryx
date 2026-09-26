import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable } from "@workspace/db/schema";
import { sql, gte, lt, and, eq } from "drizzle-orm";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import { requireAdmin } from "../../middlewares/sessionAuth.js";
import { selectOrders } from "../shop/ordersSelect.js";
import { logger } from "../../lib/logger.js";

const router = Router();

router.get("/admin/dashboard", sessionAuth, async (_req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const settled = await Promise.allSettled([
    db.select({ total: sql<number>`coalesce(sum(total_cents), 0)` })
      .from(ordersTable)
      .where(and(
        gte(ordersTable.createdAt, startOfMonth),
        lt(ordersTable.createdAt, startOfNextMonth),
        sql`status NOT IN ('cancelled', 'refunded')`,
      )),
    db.select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(sql`status NOT IN ('delivered', 'cancelled', 'refunded')`),
    db.select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "pending")),
    db.execute(sql`
      SELECT COUNT(*) AS count FROM (
        SELECT email FROM orders
        UNION
        SELECT email FROM consultation_requests
      ) AS combined
    `),
    selectOrders({ newestFirst: true, limit: 10 }),
    db.select().from(inventoryItemsTable)
      .where(sql`stock <= low_stock_threshold`)
      .orderBy(inventoryItemsTable.name),
  ]);

  const rejected = settled
    .map((s, i) => (s.status === "rejected" ? { i, reason: s.reason } : null))
    .filter(Boolean);
  if (rejected.length > 0) {
    logger.warn({ rejected }, "admin dashboard partial query failure");
  }

  const monthlyRevenue = settled[0].status === "fulfilled" ? settled[0].value : [{ total: 0 }];
  const activeOrders = settled[1].status === "fulfilled" ? settled[1].value : [{ count: 0 }];
  const pendingOrders = settled[2].status === "fulfilled" ? settled[2].value : [{ count: 0 }];
  const distinctPatients = settled[3].status === "fulfilled" ? settled[3].value : { rows: [{ count: "0" }] };
  const recentOrders = settled[4].status === "fulfilled" ? settled[4].value : [];
  const lowStockItems = settled[5].status === "fulfilled" ? settled[5].value : [];

  const patientCount = Number((distinctPatients.rows[0] as { count: string })?.count ?? 0);

  res.json({
    monthlyRevenueCents: Number(monthlyRevenue[0]?.total ?? 0),
    activeOrdersCount: Number(activeOrders[0]?.count ?? 0),
    pendingOrdersCount: Number(pendingOrders[0]?.count ?? 0),
    totalPatientsCount: patientCount,
    recentOrders,
    lowStockItems,
  });
});

// Financials — ADMIN only
router.get("/admin/financials", requireAdmin, async (_req, res) => {
  const now = new Date();

  // All-time revenue (excluding cancelled/refunded)
  const [allTime] = await db.select({ total: sql<number>`coalesce(sum(total_cents), 0)` })
    .from(ordersTable)
    .where(sql`status NOT IN ('cancelled', 'refunded')`);

  // Monthly revenue for last 12 months — single query
  const monthlyRows = await db.execute(sql`
    SELECT
      to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
      date_trunc('month', created_at) AS month_start,
      coalesce(sum(total_cents), 0) AS revenue_cents,
      count(*) AS order_count
    FROM orders
    WHERE created_at >= date_trunc('month', now()) - interval '11 months'
      AND status NOT IN ('cancelled', 'refunded')
    GROUP BY date_trunc('month', created_at)
    ORDER BY month_start
  `);

  // Build full 12-month array (fill gaps with 0)
  const rowMap = new Map<string, { revenueCents: number; orderCount: number }>();
  for (const r of monthlyRows.rows as { month: string; revenue_cents: string; order_count: string }[]) {
    rowMap.set(r.month.trim(), {
      revenueCents: Number(r.revenue_cents),
      orderCount: Number(r.order_count),
    });
  }
  const months: { month: string; revenueCents: number; orderCount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    const found = rowMap.get(label) ?? { revenueCents: 0, orderCount: 0 };
    months.push({ month: label, ...found });
  }

  // Orders by status (excluding cancelled/refunded from totals)
  const byStatus = await db.select({
    status: ordersTable.status,
    count: sql<number>`count(*)`,
    total: sql<number>`coalesce(sum(total_cents), 0)`,
  }).from(ordersTable).groupBy(ordersTable.status);

  // Top-selling items by revenue
  const topItemsRows = await db.execute(sql`
    SELECT
      item->>'name' AS name,
      sum((item->>'priceCents')::int * (item->>'quantity')::int) AS revenue_cents,
      sum((item->>'quantity')::int) AS units_sold
    FROM orders, jsonb_array_elements(items) AS item
    WHERE status NOT IN ('cancelled', 'refunded')
    GROUP BY item->>'name'
    ORDER BY revenue_cents DESC
    LIMIT 10
  `);

  res.json({
    allTimeRevenueCents: Number(allTime?.total ?? 0),
    monthlyRevenue: months,
    ordersByStatus: byStatus.map(r => ({
      status: r.status,
      count: Number(r.count),
      totalCents: Number(r.total),
    })),
    topSellingItems: (topItemsRows.rows as { name: string; revenue_cents: string; units_sold: string }[]).map(r => ({
      name: r.name,
      revenueCents: Number(r.revenue_cents),
      unitsSold: Number(r.units_sold),
    })),
  });
});

export default router;
