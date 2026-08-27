import { and, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { influencerCouponsTable, influencerCouponUsesTable } from "@workspace/db/schema";

export type AppliedCoupon = {
  coupon: typeof influencerCouponsTable.$inferSelect;
  originalTotalCents: number;
  discountCents: number;
  totalCents: number;
};

export async function applyCoupon(code: string | undefined, originalTotalCents: number): Promise<AppliedCoupon | null> {
  if (!code?.trim()) return null;

  const normalizedCode = code.trim().toUpperCase();
  const [coupon] = await db.select()
    .from(influencerCouponsTable)
    .where(and(
      eq(influencerCouponsTable.code, normalizedCode),
      eq(influencerCouponsTable.isActive, true),
    ))
    .limit(1);
  if (!coupon) return null;

  return calculateCoupon(coupon, originalTotalCents);
}

export async function getCouponById(id: number) {
  const [coupon] = await db.select()
    .from(influencerCouponsTable)
    .where(eq(influencerCouponsTable.id, id))
    .limit(1);
  return coupon ?? null;
}

export function calculateCoupon(
  coupon: typeof influencerCouponsTable.$inferSelect,
  originalTotalCents: number,
  storedDiscountCents?: number,
): AppliedCoupon {
  const discountCents = Math.min(
    originalTotalCents,
    storedDiscountCents ?? Math.round(originalTotalCents * Number(coupon.discountPercent) / 100),
  );
  return {
    coupon,
    originalTotalCents,
    discountCents,
    totalCents: originalTotalCents - discountCents,
  };
}

export async function recordCouponUse(applied: AppliedCoupon, orderId: number): Promise<void> {
  const amountBefore = applied.originalTotalCents / 100;
  const discount = applied.discountCents / 100;
  const amountAfter = applied.totalCents / 100;
  const commission = amountAfter * Number(applied.coupon.commissionPercent) / 100;

  await db.insert(influencerCouponUsesTable).values({
    couponId: applied.coupon.id,
    orderId,
    orderAmountBeforeDiscount: amountBefore.toFixed(2),
    discountApplied: discount.toFixed(2),
    orderAmountAfterDiscount: amountAfter.toFixed(2),
    commissionOwed: commission.toFixed(2),
  }).onConflictDoNothing({ target: influencerCouponUsesTable.orderId });
}