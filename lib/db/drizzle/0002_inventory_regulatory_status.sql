-- inventory_items.regulatory_status
-- Genesis (0000) created inventory_items without this column. Drizzle schema already
-- declares it. If 0001 was already applied before the ALTER was added there, this
-- migration still adds the column. Safe to re-run.
--
-- Apply (with DATABASE_URL pointing at the Auryx Supabase DB):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0001_contract_gap_modules.sql
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0002_inventory_regulatory_status.sql
-- or: pnpm --filter @workspace/db push

ALTER TABLE IF EXISTS inventory_items
  ADD COLUMN IF NOT EXISTS regulatory_status text NOT NULL DEFAULT 'Research Only';
