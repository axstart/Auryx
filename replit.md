# Auryx — Precision Longevity

A luxury AI-powered longevity and personalized peptide therapy website with an AI chat concierge (Aria), consultation system, admin dashboard, and inventory management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied via `/api`)
- `pnpm --filter @workspace/auryx run dev` — run the frontend (Vite, proxied via `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `ADMIN_KEY` — admin dashboard access key (current: `auryx-admin-olawmgskdy`)
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit-managed OpenAI proxy

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Three.js (molecule dock scene)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- AI: OpenAI via Replit AI Integrations proxy (`@workspace/integrations-openai-ai-server`)

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

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval → typed React Query hooks. Never hand-write fetchers for API routes.
- Admin auth is header-based (`x-admin-key`) — simple for internal use, no session management needed.
- Chat streaming uses SSE (server-sent events) from the `/api/chat/message` endpoint. The frontend reads the stream incrementally.
- Chat escalations are stored in `chat_escalations` table and visible in the admin "Chat Escalations" tab with full conversation transcript.
- Aria system prompt lives in `artifacts/api-server/src/routes/chat/index.ts`.

## Product

- **Homepage**: Hero with molecule dock 3D scene, protocol cards, science/methodology section, philosophy, quality/credentials section (US-sourced, pharma-grade, 3rd-party tested, 99%+ purity), FAQ, CTA.
- **Aria chat widget**: Floating bottom-right AI concierge powered by OpenAI. Streams responses, shows suggested questions, supports team escalation with name/email capture.
- **Consultation modal**: Full-page form for requesting a private consultation (wired to Postgres).
- **Admin dashboard** (`/admin`): Three tabs — Consultations (with status management), Inventory (CRUD), Chat Escalations (expandable transcripts + mailto reply link).

## User preferences

- Color palette: deep dark charcoal background, champagne gold `#C9A844` (primary), teal `#0D9488`
- Fonts: Cormorant Garamond (serif headings) + DM Sans (body)
- Luxury/premium aesthetic — no generic UI, everything bespoke and refined

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes.
- Run `pnpm --filter @workspace/db run push` after any schema changes (dev only).
- ESM imports in the API server require `.js` extensions (e.g. `./routes/chat/index.js`).
- The `lib/integrations-openai-ai-react` lib requires `"skipLibCheck": true` in its tsconfig (React peer dep resolution quirk).
- Do NOT call `pnpm dev` at the workspace root. Use `restart_workflow` or the workflow runner.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
