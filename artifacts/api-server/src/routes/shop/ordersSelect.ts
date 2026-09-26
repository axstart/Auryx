import { desc, eq, type SQL } from "drizzle-orm";
import { db, pool } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";
import { isMissingOrdersCouponColumnError, withCouponColumnDefaults } from "./ordersSelectCompat.js";

export { isMissingOrdersCouponColumnError, withCouponColumnDefaults } from "./ordersSelectCompat.js";

export const ENSURE_ORDERS_COUPON_COLUMNS_SQL = `
ALTER TABLE IF EXISTS orders
  ADD COLUMN IF NOT EXISTS original_total_cents integer,
  ADD COLUMN IF NOT EXISTS discount_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS coupon_id integer
`;

/** Add coupon columns that genesis never created. Safe to re-run. */
export async function ensureOrdersCouponColumns(): Promise<void> {
  await pool.query(ENSURE_ORDERS_COUPON_COLUMNS_SQL);
}

/** Columns present on genesis `orders` — coupon fields were added only in Drizzle. */
export const ORDER_GENESIS_COLUMNS = {
  id: ordersTable.id,
  customerName: ordersTable.customerName,
  email: ordersTable.email,
  phone: ordersTable.phone,
  shippingAddress: ordersTable.shippingAddress,
  items: ordersTable.items,
  totalCents: ordersTable.totalCents,
  status: ordersTable.status,
  trackingNumber: ordersTable.trackingNumber,
  stripePaymentIntentId: ordersTable.stripePaymentIntentId,
  paymentMethodId: ordersTable.paymentMethodId,
  paynodePaymentId: ordersTable.paynodePaymentId,
  requiresConsultation: ordersTable.requiresConsultation,
  consultationRequested: ordersTable.consultationRequested,
  consultationFormSubmitted: ordersTable.consultationFormSubmitted,
  researchField: ordersTable.researchField,
  termsAccepted: ordersTable.termsAccepted,
  createdAt: ordersTable.createdAt,
  updatedAt: ordersTable.updatedAt,
} as const;

export type OrderRow = typeof ordersTable.$inferSelect;
type GenesisOrderRow = {
  [K in keyof typeof ORDER_GENESIS_COLUMNS]: OrderRow[K];
};

/** After the first missing-coupon-column failure, skip those columns for this process. */
let skipCouponColumns = false;

export function resetOrdersCouponColumnCache(): void {
  skipCouponColumns = false;
}

function finalize(rows: OrderRow[] | GenesisOrderRow[], genesisOnly: boolean): OrderRow[] {
  if (!genesisOnly) return rows as OrderRow[];
  return (rows as GenesisOrderRow[]).map(withCouponColumnDefaults);
}

async function runSelect(opts: {
  genesisOnly: boolean;
  where?: SQL;
  newestFirst?: boolean;
  limit?: number;
}): Promise<OrderRow[]> {
  const orderBy = opts.newestFirst ? desc(ordersTable.createdAt) : ordersTable.createdAt;
  if (opts.genesisOnly) {
    const q = db.select(ORDER_GENESIS_COLUMNS).from(ordersTable);
    const filtered = opts.where ? q.where(opts.where) : q;
    const ordered = filtered.orderBy(orderBy);
    const rows = await (opts.limit ? ordered.limit(opts.limit) : ordered);
    return finalize(rows, true);
  }
  const q = db.select().from(ordersTable);
  const filtered = opts.where ? q.where(opts.where) : q;
  const ordered = filtered.orderBy(orderBy);
  const rows = await (opts.limit ? ordered.limit(opts.limit) : ordered);
  return finalize(rows, false);
}

export async function selectOrders(opts: {
  where?: SQL;
  newestFirst?: boolean;
  limit?: number;
} = {}): Promise<OrderRow[]> {
  if (skipCouponColumns) {
    return runSelect({ ...opts, genesisOnly: true });
  }
  try {
    return await runSelect({ ...opts, genesisOnly: false });
  } catch (err) {
    if (!isMissingOrdersCouponColumnError(err)) throw err;
    skipCouponColumns = true;
    logger.warn({ err }, "orders coupon columns missing; using genesis order columns");
    return runSelect({ ...opts, genesisOnly: true });
  }
}

export async function selectOrderById(id: number): Promise<OrderRow | undefined> {
  const [order] = await selectOrders({ where: eq(ordersTable.id, id), limit: 1 });
  return order;
}
