import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, inventoryItemsTable, consultationRequestsTable } from "@workspace/db/schema";
import { sql, gte, lt, and, eq } from "drizzle-orm";
import { sessionAuth } from "../../middlewares/sessionAuth.js";

const router = Router();

router.get("/admin/dashboard", sessionAuth, async (_req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    monthlyRevenue,
    activeOrders,
    pendingOrders,
    totalConsultations,
    recentOrders,
    lowStockItems,
  ] = await Promise.all([
    // Monthly revenue
    db.select({ total: sql<number>`coalesce(sum(total_cents), 0)` })
      .from(ordersTable)
      .where(and(
        gte(ordersTable.createdAt, startOfMonth),
        lt(ordersTable.createdAt, startOfNextMonth),
      )),
    // Active orders (pending + approved + sent_to_pharmacy + shipped)
    db.select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(sql`status NOT IN ('delivered')`),
    // Pending orders
    db.select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "pending")),
    // Total consultations (use as proxy for "patients")
    db.select({ count: sql<number>`count(*)` })
      .from(consultationRequestsTable),
    // Recent 10 orders
    db.select().from(ordersTable)
      .orderBy(sql`created_at DESC`)
      .limit(10),
    // Low stock items
    db.select().from(inventoryItemsTable)
      .where(sql`stock <= low_stock_threshold`)
      .orderBy(inventoryItemsTable.name),
  ]);

  res.json({
    monthlyRevenueCents: Number(monthlyRevenue[0]?.total ?? 0),
    activeOrdersCount: Number(activeOrders[0]?.count ?? 0),
    pendingOrdersCount: Number(pendingOrders[0]?.count ?? 0),
    totalPatientsCount: Number(totalConsultations[0]?.count ?? 0),
    recentOrders,
    lowStockItems,
  });
});

// Financials route (admin only)
router.get("/admin/financials", sessionAuth, async (_req, res) => {
  const now = new Date();

  // All-time revenue
  const [allTime] = await db.select({ total: sql<number>`coalesce(sum(total_cents), 0)` }).from(ordersTable);

  // Monthly revenue for last 12 months
  const months: { month: string; revenueCents: number; orderCount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    const [row] = await db.select({
      total: sql<number>`coalesce(sum(total_cents), 0)`,
      cnt: sql<number>`count(*)`,
    }).from(ordersTable).where(and(gte(ordersTable.createdAt, d), lt(ordersTable.createdAt, next)));
    months.push({ month: label, revenueCents: Number(row?.total ?? 0), orderCount: Number(row?.cnt ?? 0) });
  }

  // Orders by status
  const byStatus = await db.select({
    status: ordersTable.status,
    count: sql<number>`count(*)`,
    total: sql<number>`coalesce(sum(total_cents), 0)`,
  }).from(ordersTable).groupBy(ordersTable.status);

  res.json({
    allTimeRevenueCents: Number(allTime?.total ?? 0),
    monthlyRevenue: months,
    ordersByStatus: byStatus.map(r => ({
      status: r.status,
      count: Number(r.count),
      totalCents: Number(r.total),
    })),
  });
});

export default router;
