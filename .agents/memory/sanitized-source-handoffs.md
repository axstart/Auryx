---
name: Sanitized source handoffs
description: Scope and safety rules for sharing this project’s source with outside developers.
---

For external development handoffs, include the storefront/API source, shared contracts, database schema and migrations, setup files, and public storefront assets (including SEO files and public certificates). Exclude environment values, secrets, runtime data, uploads, caches, installed dependencies, build artifacts, screenshots, Git history, and internal component-preview tooling. Provide a blank-value `.env.example` when configuration names are useful.

**Why:** An outside SEO or marketing developer needs the live site’s implementation and public assets, while credential-bearing configuration, patient/order data, and internal working materials are unnecessary and unsafe to distribute.

**How to apply:** Assemble and scan a separate staging directory; treat any credential-test helper as out of scope unless specifically requested; run secret, private-key, credential-URL, and prohibited-path checks before packaging.