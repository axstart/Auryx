# Auryx current source handoff

This archive was generated from the current project workspace on 2026-09-03.
It is intended as a complete source handoff, with credentials and runtime-only
content removed.

## Included

- Auryx storefront, API server, and internal component-preview source
- Shared libraries, generated API contracts, database schema, and migrations
- Scripts, package manifests, lockfile, TypeScript configuration, and Replit setup
- Public product/marketing assets, certificates of analysis, `robots.txt`, and `sitemap.xml`

## Excluded

- `node_modules`, `.git`, build output, Vite caches, coverage, and TypeScript caches
- `.env` files, credential values, private keys, runtime data, logs, and database contents
- Uploaded working files, screenshots, canvas state, local agent state, and prior export archives

## Environment configuration

`.env.example` contains variable names only with blank values. Configure real
values securely in the development environment; do not place credentials in
source control or this file.

## Local setup

1. Install Node.js and pnpm.
2. Run `pnpm install` from this directory.
3. Configure the required environment variables securely.
4. Run `pnpm --filter @workspace/auryx run dev` for the storefront.

The API and component-preview services are available through their respective
workspace package scripts when needed.