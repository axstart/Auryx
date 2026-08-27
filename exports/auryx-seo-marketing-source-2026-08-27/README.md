# Auryx source handoff

This is a sanitized source-code handoff for SEO and marketing development.

## Included

- Storefront source code, routes, metadata, `robots.txt`, and `sitemap.xml`
- Public visual assets, product imagery, and public certificates of analysis
- API source, shared contracts, database schema, migrations, and generated API types
- Package manifests, lockfile, TypeScript configuration, and Replit project metadata

## Intentionally excluded

- Environment files, credentials, secrets, private keys, and production connection details
- Installed dependencies, build output, caches, logs, and runtime data
- Database contents, local state, Git history, screenshots, and canvas data
- Uploaded working files and the standalone PaymentNode credential test helper
- The internal component-preview sandbox, which is unrelated to the live storefront

## Environment configuration

`.env.example` lists only the variable names that the project references. It has no values.
Use securely managed environment settings for any values required in a development environment.

## Local setup

1. Install Node.js and pnpm.
2. Run `pnpm install` from this directory.
3. Configure the required environment variables securely.
4. Run `pnpm --filter @workspace/auryx run dev` for the storefront.

The API service is available at `@workspace/api-server` when API work is needed.