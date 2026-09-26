function collectErrorSignals(err: unknown): { codes: string[]; messages: string[] } {
  const codes: string[] = [];
  const messages: string[] = [];
  const seen = new Set<unknown>();
  let current: unknown = err;
  for (let i = 0; i < 5 && current && typeof current === "object" && !seen.has(current); i++) {
    seen.add(current);
    const obj = current as { code?: unknown; message?: unknown; cause?: unknown };
    if (typeof obj.code === "string") codes.push(obj.code);
    if (typeof obj.message === "string") messages.push(obj.message);
    current = obj.cause;
  }
  return { codes, messages };
}

function isUndefinedColumnError(err: unknown): boolean {
  const { codes, messages } = collectErrorSignals(err);
  if (codes.includes("42703")) return true;
  return messages.some((m) => /column .* does not exist/i.test(m) || /undefined_column/i.test(m));
}

export function isMissingOrdersCouponColumnError(err: unknown): boolean {
  if (isUndefinedColumnError(err)) return true;
  const { messages } = collectErrorSignals(err);
  return messages.some(
    (m) =>
      /failed query/i.test(m) &&
      /from "orders"/i.test(m) &&
      /original_total_cents|discount_cents|"coupon_code"|"coupon_id"/.test(m),
  );
}

export function withCouponColumnDefaults<T extends object>(
  row: T,
): T & {
  originalTotalCents: null;
  discountCents: number;
  couponCode: null;
  couponId: null;
} {
  return {
    ...row,
    originalTotalCents: null,
    discountCents: 0,
    couponCode: null,
    couponId: null,
  };
}
