# Auryx Operations Runbook (Module 2.1)

Production hosting (post-Replit):

| Layer | Platform | Notes |
|-------|----------|--------|
| Frontend SPA + static COAs | **Vercel** (`www.auryxlife.com`) | Build: `pnpm --filter @workspace/auryx build` → `artifacts/auryx/dist/public` |
| API (Express) | **Render** (`auryx-api`) | URL: `https://auryx-api-ajuv.onrender.com` — health: `GET /api/healthz` |
| Database | **Supabase** Postgres | `DATABASE_URL` (connection string from Supabase) |
| Email | **Resend** (preferred) / Zoho SMTP fallback | Set on Render, not Vercel |
| Admin / API secrets | **Render** environment variables | `ADMIN_LEO_*`, `ADMIN_ROMY_*`, `SESSION_SECRET`, `RESEND_*`, payment keys, etc. |

Legacy Replit config (`.replit`, optional Vite plugins gated on `REPL_ID`) may remain in the repo for history; it is **not** the production stack.

## Email (Resend)

Preferred provider is **Resend** via `RESEND_API_KEY`.

1. Add secrets on the **Render** API service (Environment):
   - `RESEND_API_KEY=re_...`
   - `RESEND_FROM=Auryx <noreply@auryxlife.com>` (after domain verification)
   - Optional: `RESEND_REPLY_TO=info@auryxlife.com`
2. Verify `auryxlife.com` in the [Resend Domains](https://resend.com/domains) dashboard (DNS records).
3. Until the domain is verified, Resend only delivers reliably with `onboarding@resend.dev` to your own Resend account email / test addresses.
4. Zoho SMTP (`ZOHO_EMAIL` / `ZOHO_PASSWORD`) remains a fallback when `RESEND_API_KEY` is unset.

## Frontend ↔ API wiring

The SPA calls relative `/api/*` (same origin). On Vercel (`vercel.json`):

1. **Applied:** `/api/:path*` is rewritten to `https://auryx-api-ajuv.onrender.com/api/:path*` (before the SPA catch-all).
2. SPA fallback remains `/((?!api/).*)` → `/index.html` so API paths are not swallowed by the client router.
3. Optional build-time `VITE_API_BASE` is for tooling that needs an absolute API origin; storefront `fetch("/api/...")` stays same-origin via the rewrite.

CORS on the API allows credentialed cross-origin if you ever call Render directly; prefer same-origin `/api` rewrite for session cookies (`sameSite: "lax"`, `secure` in production).

**Verify after deploy:** `GET https://www.auryxlife.com/api/healthz` → 200 (proxied to Render).

## Staging

1. **Frontend:** Vercel **Preview** deployments for PRs / branches.
2. **API:** Separate Render **staging** web service (`NODE_ENV=production`, distinct `SESSION_SECRET`, staging Stripe/PaymentNode/Resend keys).
3. **DB:** Separate Supabase **staging** project (or Supabase branch) with its own `DATABASE_URL`.
4. Aim Preview `VITE_API_BASE` / `/api` proxy at the staging Render URL — never point Preview at production DB or payment keys.
5. Never share production `SESSION_SECRET` or payment keys with staging.

Admin MFA is on by default. Set `ADMIN_MFA_DISABLED=true` only when you explicitly need to skip the email OTP (including production). Leave it unset to keep MFA on.

## Uptime & health

- Public probe on the **Render** service: `GET /api/healthz` (expect 200).
- Point Better Stack / UptimeRobot at that URL every 60s; alert on Slack/email.
- Configure Render health checks to the same path.
- API logs via Pino; optional Sentry when `SENTRY_DSN` is set on Render.

## Database backups & DR (Supabase)

1. In the Supabase project: enable **automated backups** and **PITR** where the plan allows (retain ≥ 14 days).
2. Monthly restore drill:
   - Restore backup / PITR into a scratch database or staging project.
   - Run `pnpm --filter @workspace/db push` only if schema drift is expected; prefer restore-only validation.
   - Spot-check `orders`, `admin_users`, `coa_batches` row counts.
3. Document RPO/RTO with the client (target: RPO ≤ 24h, RTO ≤ 4h for storefront).

## WAF / anti-bot

- Enable **Vercel Attack Challenge / Bot Protection** for `www.auryxlife.com`.
- Keep existing API rate limits (login, OTP, funnel events) on Render.
- Security headers are set in `vercel.json` (HSTS, Permissions-Policy, CSP report-only).

## Admin access

- Password login + **email MFA OTP** (Resend preferred; Zoho SMTP fallback).
- Roles: `staff` vs `admin`.
- `staff` is **read-only** on inventory, patients, orders, Aria settings, and CRM (consultations / protocol continuations).
- `requireAdmin` is required for writes that change money, inventory, patients, orders, Aria settings, CRM, plus financials, COA CRUD, coupons, and users.
- Env super-admins (`ADMIN_LEO_*`, `ADMIN_ROMY_*`) are set on **Render** environment variables and also require MFA in production.

## Secrets placement (quick map)

| Secret / config | Where |
|-----------------|--------|
| `DATABASE_URL` | Render (from Supabase connection string) |
| `SESSION_SECRET`, `ADMIN_LEO_*`, `ADMIN_ROMY_*` | Render |
| `RESEND_*`, `ZOHO_*` | Render |
| Stripe / PaymentNode / Twilio / OpenAI (`AI_INTEGRATIONS_*`) | Render |
| Frontend-only public vars (e.g. `VITE_GSC_VERIFICATION`) | Vercel |
| Never commit | `.env`, real keys — use `.env.example` as the name checklist only |

## Marketing journeys worker

API process on Render runs an interval (every 15 minutes) that:

1. Enrolls win-back candidates (60+ days since last paid order).
2. Sends due journey emails (welcome, cart abandon, post-purchase, win-back).
3. Optionally sends the same journeys as SMS **only when** `MARKETING_SMS_ENABLED=true` **and** existing Twilio env is set (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`). Default is off so production does not text without an explicit flag. SMS reuses email opt-out (`unsubscribed_at`) and Twilio `STOP`. Phone numbers are resolved from the latest order or consultation for that email — subscribers without a phone are skipped. Messaging cost is billed to the client's Twilio account.

Manual trigger: `POST /api/admin/marketing/process-journeys` (admin session).

## COA verify (`/api/coa/verify`)

Public lookup. If `coa_batches` is missing or the query fails, the API falls back to the static product catalog and returns `{ results: [] }` on a miss (never 500). Apply `lib/db/drizzle/0001_contract_gap_modules.sql` (or `pnpm --filter @workspace/db push`) so the table exists in Supabase; seed also attempts `CREATE TABLE IF NOT EXISTS`.

## Public products (`GET /api/products`)

The shop catalog is static. Inventory only overlays `regulatory_status`. Prod genesis `inventory_items` never had that column, so `select slug, regulatory_status from inventory_items` 500s the storefront.

After deploy, the API serves the catalog (default `"Research Only"`) if the column is missing. To add the column and `coa_batches` on the **Auryx** Supabase DB (set `DATABASE_URL` from Render / Supabase — do not guess credentials):

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0001_contract_gap_modules.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0002_inventory_regulatory_status.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f lib/db/drizzle/0003_orders_coupon_columns.sql
# or: pnpm --filter @workspace/db push
```

## Admin dashboard (`GET /api/admin/dashboard`)

Recent-order and order-list queries use the full Drizzle `orders` row. Prod genesis never had coupon columns (`original_total_cents`, `discount_cents`, `coupon_code`, `coupon_id`), so those selects 500. After deploy the API adds the columns on boot and falls back to genesis columns if they are still missing.

Both SQL files use `IF NOT EXISTS`. Do not set `MARKETING_SMS_ENABLED=true` in production.
