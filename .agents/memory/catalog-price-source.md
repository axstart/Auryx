---
name: Storefront catalog price source
description: Product pages and checkout resolve prices from the hardcoded product catalog, while inventory rows primarily track stock and admin catalog data.
---

For storefront price changes, update the matching product and variant `priceCents` values in the product catalog as well as the inventory table. Updating only inventory rows leaves product detail pages and checkout on stale prices.

**Why:** The storefront product and checkout routes resolve catalog products directly, and inventory synchronization inserts missing rows without overwriting existing catalog prices.

**How to apply:** When an admin price update is requested, verify both `/api/products/:slug` output and the corresponding inventory row after changing the price.