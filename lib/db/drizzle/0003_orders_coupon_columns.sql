-- Coupon fields on orders
-- Genesis (0000) created orders without original_total_cents, discount_cents,
-- coupon_code, or coupon_id. Drizzle schema already declares them, so
-- GET /api/admin/dashboard and GET /api/orders 500 with
-- `Failed query: select ... original_total_cents ... from "orders"`.
--
-- Apply (with DATABASE_URL pointing at the Auryx Supabase DB):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0003_orders_coupon_columns.sql
-- or: pnpm --filter @workspace/db push
-- The API also applies this on boot via ensureOrdersCouponColumns().

ALTER TABLE IF EXISTS orders
  ADD COLUMN IF NOT EXISTS original_total_cents integer,
  ADD COLUMN IF NOT EXISTS discount_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS coupon_id integer;
