import { Router } from "express";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  influencerCouponsTable,
  influencerCouponUsesTable,
  ordersTable,
} from "@workspace/db/schema";
import { requireAdmin } from "../middlewares/sessionAuth.js";

const router = Router();

const CouponCodeSchema = z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/);

const CouponInputSchema = z.object({
  code: CouponCodeSchema,
  influencer_name: z.string().trim().min(1).max(120),
  influencer_email: z.string().trim().email(),
  discount_percent: z.coerce.number().min(0).max(100),
  commission_percent: z.coerce.number().min(0).max(100),
  is_active: z.boolean().default(true),
});

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function couponResponse(coupon: typeof influencerCouponsTable.$inferSelect) {
  return {
    id: coupon.id,
    code: coupon.code,
    influencer_name: coupon.influencerName,
    influencer_email: coupon.influencerEmail,
    discount_percent: Number(coupon.discountPercent),
    commission_percent: Number(coupon.commissionPercent),
    is_active: coupon.isActive,
    created_at: coupon.createdAt,
  };
}

router.post("/coupons/validate", async (req, res) => {
  const parsed = z.object({ code: CouponCodeSchema }).safeParse(req.body);
  if (!parsed.success) {
    res.json({ valid: false, message: "Invalid or expired code." });
    return;
  }

  const [coupon] = await db.select()
    .from(influencerCouponsTable)
    .where(and(
      eq(influencerCouponsTable.code, normalizeCode(parsed.data.code)),
      eq(influencerCouponsTable.isActive, true),
    ))
    .limit(1);

  if (!coupon) {
    res.json({ valid: false, message: "Invalid or expired code." });
    return;
  }

  const discountPercent = Number(coupon.discountPercent);
  res.json({
    valid: true,
    discount_percent: discountPercent,
    message: `${discountPercent}% discount applied!`,
  });
});

router.get("/admin/coupons", requireAdmin, async (_req, res) => {
  const rows = await db.execute(sql`
    SELECT
      c.id,
      c.code,
      c.influencer_name,
      c.influencer_email,
      c.discount_percent,
      c.commission_percent,
      c.is_active,
      c.created_at,
      COUNT(u.id)::int AS total_sales,
      COALESCE(SUM(u.commission_owed), 0)::numeric AS total_commission_owed
    FROM influencer_coupons c
    LEFT JOIN influencer_coupon_uses u ON u.coupon_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `);

  res.json((rows.rows as Record<string, unknown>[]).map(row => ({
    id: Number(row.id),
    code: String(row.code),
    influencer_name: String(row.influencer_name),
    influencer_email: String(row.influencer_email),
    discount_percent: Number(row.discount_percent),
    commission_percent: Number(row.commission_percent),
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    total_sales: Number(row.total_sales),
    total_commission_owed: Number(row.total_commission_owed),
  })));
});

router.post("/admin/coupons", requireAdmin, async (req, res) => {
  const parsed = CouponInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const [coupon] = await db.insert(influencerCouponsTable).values({
      code: normalizeCode(parsed.data.code),
      influencerName: parsed.data.influencer_name,
      influencerEmail: parsed.data.influencer_email,
      discountPercent: String(parsed.data.discount_percent),
      commissionPercent: String(parsed.data.commission_percent),
      isActive: parsed.data.is_active,
    }).returning();
    res.status(201).json(couponResponse(coupon));
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "That coupon code already exists." });
      return;
    }
    req.log.error({ err }, "coupon create failed");
    res.status(500).json({ error: "Could not create coupon." });
  }
});

router.patch("/admin/coupons/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid coupon id." });
    return;
  }

  const parsed = CouponInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data;
  const update: Partial<typeof influencerCouponsTable.$inferInsert> = {};
  if (data.code !== undefined) update.code = normalizeCode(data.code);
  if (data.influencer_name !== undefined) update.influencerName = data.influencer_name;
  if (data.influencer_email !== undefined) update.influencerEmail = data.influencer_email;
  if (data.discount_percent !== undefined) update.discountPercent = String(data.discount_percent);
  if (data.commission_percent !== undefined) update.commissionPercent = String(data.commission_percent);
  if (data.is_active !== undefined) update.isActive = data.is_active;

  try {
    const [coupon] = await db.update(influencerCouponsTable)
      .set(update)
      .where(eq(influencerCouponsTable.id, id))
      .returning();
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found." });
      return;
    }
    res.json(couponResponse(coupon));
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "That coupon code already exists." });
      return;
    }
    req.log.error({ err, coupon_id: id }, "coupon update failed");
    res.status(500).json({ error: "Could not update coupon." });
  }
});

router.get("/admin/commissions", requireAdmin, async (req, res) => {
  const filter = typeof req.query.filter === "string" ? req.query.filter.trim().toUpperCase() : "";
  const rows = await db.execute(sql`
    SELECT
      u.id,
      u.order_id,
      u.order_amount_before_discount,
      u.discount_applied,
      u.order_amount_after_discount,
      u.commission_owed,
      u.commission_paid,
      u.commission_paid_at,
      u.created_at,
      c.code,
      c.influencer_name,
      o.customer_name,
      o.email
    FROM influencer_coupon_uses u
    INNER JOIN influencer_coupons c ON c.id = u.coupon_id
    INNER JOIN orders o ON o.id = u.order_id
    ${filter ? sql`WHERE UPPER(c.code) LIKE ${`%${filter}%`} OR UPPER(c.influencer_name) LIKE ${`%${filter}%`}` : sql``}
    ORDER BY u.created_at DESC
  `);

  const commissionRows = rows.rows as Record<string, unknown>[];
  const summary = await db.execute(sql`
    SELECT
      COALESCE(SUM(CASE WHEN commission_paid = false THEN commission_owed ELSE 0 END), 0)::numeric AS unpaid,
      COALESCE(SUM(CASE WHEN commission_paid = true THEN commission_owed ELSE 0 END), 0)::numeric AS paid
    FROM influencer_coupon_uses
  `);
  const totals = (summary.rows[0] ?? {}) as Record<string, unknown>;

  res.json({
    total_commission_owed: Number(totals.unpaid ?? 0),
    total_commission_paid: Number(totals.paid ?? 0),
    uses: commissionRows.map(row => ({
      id: Number(row.id),
      order_id: Number(row.order_id),
      influencer_name: String(row.influencer_name),
      coupon_code: String(row.code),
      customer_name: String(row.customer_name),
      customer_email: String(row.email),
      order_amount_before_discount: Number(row.order_amount_before_discount),
      discount_applied: Number(row.discount_applied),
      order_amount_after_discount: Number(row.order_amount_after_discount),
      commission_owed: Number(row.commission_owed),
      commission_paid: Boolean(row.commission_paid),
      commission_paid_at: row.commission_paid_at,
      created_at: row.created_at,
    })),
  });
});

router.patch("/admin/commissions/:id/mark-paid", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid commission id." });
    return;
  }

  const [use] = await db.update(influencerCouponUsesTable)
    .set({ commissionPaid: true, commissionPaidAt: new Date() })
    .where(and(
      eq(influencerCouponUsesTable.id, id),
      eq(influencerCouponUsesTable.commissionPaid, false),
    ))
    .returning();

  if (!use) {
    res.status(404).json({ error: "Unpaid commission not found." });
    return;
  }
  res.json({ success: true, id: use.id, commission_paid: true, commission_paid_at: use.commissionPaidAt });
});

export default router;