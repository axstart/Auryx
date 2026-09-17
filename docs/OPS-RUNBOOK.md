# Auryx Operations Runbook (Module 2.1)

## Hosting split

| Surface | Platform | Notes |
|---------|----------|--------|
| Frontend (SPA + static COAs) | Vercel (`www.auryxlife.com`) | Build: `pnpm --filter @workspace/auryx build` |
| API + sessions + Postgres | Replit | Express on `PORT`, `DATABASE_URL`, session store table `session` |

Frontend calls `/api/*` which must be proxied to the Replit API (or same-origin reverse proxy).

## Staging

1. Provision a **staging** Postgres on Replit (or a branch DB).
2. Deploy API with `NODE_ENV=production`, distinct `SESSION_SECRET`, and staging Zoho/Stripe/PaymentNode keys.
3. Use a Vercel **Preview** deployment with `VITE_API_BASE` / proxy aimed at the staging API.
4. Never share production `SESSION_SECRET` or payment keys with staging.

Set `ADMIN_MFA_DISABLED=true` only on local/dev — never in production.

## Uptime & health

- Public probe: `GET /api/healthz` (expect 200).
- Point Better Stack / UptimeRobot at that URL every 60s; alert on Slack/email.
- API logs via Pino; optional Sentry when `SENTRY_DSN` is set.

## Database backups & DR

1. In Replit Postgres (or provider console), enable **daily automated backups** (retain ≥ 14 days).
2. Monthly restore drill:
   - Restore backup into a scratch database.
   - Run `pnpm --filter @workspace/db push` only if schema drift is expected; prefer restore-only validation.
   - Spot-check `orders`, `admin_users`, `coa_batches` row counts.
3. Document RPO/RTO with the client (target: RPO ≤ 24h, RTO ≤ 4h for storefront).

## WAF / anti-bot

- Enable **Vercel Attack Challenge / Bot Protection** for `www.auryxlife.com`.
- Keep existing API rate limits (login, OTP, funnel events).
- Security headers are set in `vercel.json` (HSTS, Permissions-Policy, CSP report-only).

## Admin access

- Password login + **email MFA OTP** (Zoho SMTP).
- Roles: `staff` vs `admin` (`requireAdmin` for financials, COA CRUD, coupons).
- Env super-admins (`ADMIN_LEO_*`, `ADMIN_ROMY_*`) also require MFA in production.

## Marketing journeys worker

API process runs an interval (every 15 minutes) that:

1. Enrolls win-back candidates (60+ days since last paid order).
2. Sends due journey emails (welcome, cart abandon, post-purchase, win-back).

Manual trigger: `POST /api/admin/marketing/process-journeys` (admin session).
