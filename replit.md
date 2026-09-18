# Auryx — Precision Longevity

A luxury AI-powered longevity and personalized peptide therapy website with an AI chat concierge (Aria), consultation system, admin dashboard, and inventory management.

> **Hosting (current):** Frontend on **Vercel**, API on **Render**, Postgres on **Supabase**.  
> Ops, staging, backups, and secrets: see [`docs/OPS-RUNBOOK.md`](docs/OPS-RUNBOOK.md).  
> This file retains local-dev / product notes. Root `.replit` is **legacy** (historical Replit project config) and is not used for production.

## Run & Operate (local)

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied via `/api`)
- `pnpm --filter @workspace/auryx run dev` — run the frontend (Vite, proxied via `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Supabase (or local) Postgres connection string
- Required env (API): `SESSION_SECRET` in production; admin credentials `ADMIN_LEO_*` / `ADMIN_ROMY_*` on the API host
- Optional AI: `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` (OpenAI-compatible client used by Aria / protocol routes)
- Optional: `ADMIN_KEY` — legacy header-based admin access key if still enabled in routes

Copy variable names from `.env.example`. Set production secrets on **Render** (API) and public frontend vars on **Vercel**.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Three.js (molecule dock scene) — deployed on **Vercel**
- API: Express 5 — deployed on **Render**
- DB: **Supabase** PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle) for API; Vite for SPA
- AI: OpenAI-compatible client via `@workspace/integrations-openai-ai-server`
- Email: Resend (preferred) / Zoho SMTP fallback

## Where things live

- `lib/db/src/schema/` — Drizzle schema (source of truth for DB)
  - `consultations.ts` — consultation requests
  - `inventory.ts` — peptide inventory
  - `chatEscalations.ts` — Aria chat escalations
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/` — generated React Query hooks + Zod schemas (do not edit)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/auryx/src/pages/` — page components (home, admin, not-found)
- `artifacts/auryx/src/components/` — shared components (Navbar, Footer, ChatWidget, ConsultationModal, etc.)
- `docs/OPS-RUNBOOK.md` — production hosting, staging, backups, health checks

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval → typed React Query hooks. Never hand-write fetchers for API routes.
- Admin auth uses session cookies + email MFA in production (env super-admins on Render).
- Chat streaming uses SSE (server-sent events) from the `/api/chat/message` endpoint. The frontend reads the stream incrementally.
- Chat escalations are stored in `chat_escalations` table and visible in the admin "Chat Escalations" tab with full conversation transcript.
- Aria system prompt lives in `artifacts/api-server/src/routes/chat/index.ts`.
- Production SPA expects `/api/*` to reach Render (Vercel rewrite/proxy); see the runbook.

## Product

- **Homepage**: Hero with molecule dock 3D scene, protocol cards, science/methodology section, philosophy, quality/credentials section (US-sourced, pharma-grade, 3rd-party tested, 99%+ purity), FAQ, CTA.
- **Aria chat widget**: Floating bottom-right AI concierge powered by OpenAI. Streams responses, shows suggested questions, supports team escalation with name/email capture.
- **Consultation modal**: Full-page form for requesting a private consultation (wired to Postgres).
- **Admin dashboard** (`/admin`): Consultations, inventory, chat escalations, financials/COA/coupons (role-gated).

## User preferences

- Color palette: deep dark charcoal background, champagne gold `#C9A844` (primary), teal `#0D9488`
- Fonts: Cormorant Garamond (serif headings) + DM Sans (body)
- Luxury/premium aesthetic — no generic UI, everything bespoke and refined

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes.
- Run `pnpm --filter @workspace/db run push` after any schema changes (dev only).
- ESM imports in the API server require `.js` extensions (e.g. `./routes/chat/index.js`).
- The `lib/integrations-openai-ai-react` lib requires `"skipLibCheck": true` in its tsconfig (React peer dep resolution quirk).
- Do NOT call `pnpm dev` at the workspace root; start API and frontend filters separately (see Run & Operate).
- Optional `@replit/vite-plugin-*` packages load only when `REPL_ID` is set (legacy); local/Vercel builds skip them.

## Pointers

- See `docs/OPS-RUNBOOK.md` for Vercel + Render + Supabase operations
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
