import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { inArray, isNull, eq } from "drizzle-orm";
import { PRODUCTS } from "../routes/shop/products.js";
import { logger } from "./logger.js";

interface CatalogInventoryKey {
  slug: string;
  variantLabel: string | null;
  name: string;
  category: string;
  sellPriceCents: number;
}

export async function syncInventoryFromCatalog(): Promise<void> {
  try {
    // Build per-variant inventory keys from catalog
    const catalogKeys: CatalogInventoryKey[] = [];
    for (const p of PRODUCTS) {
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          catalogKeys.push({
            slug: p.slug,
            variantLabel: v.label,
            name: `${p.name} (${v.label})`,
            category: p.category,
            sellPriceCents: v.priceCents,
          });
        }
      } else {
        catalogKeys.push({
          slug: p.slug,
          variantLabel: null,
          name: p.name,
          category: p.category,
          sellPriceCents: p.priceCents,
        });
      }
    }

    const nameToSlug = new Map(PRODUCTS.map(p => [p.name, p.slug]));

    // Backfill slug on any existing rows that were inserted before the slug column existed
    const rowsWithoutSlug = await db
      .select({ id: inventoryItemsTable.id, name: inventoryItemsTable.name })
      .from(inventoryItemsTable)
      .where(isNull(inventoryItemsTable.slug));

    for (const row of rowsWithoutSlug) {
      const slug = nameToSlug.get(row.name);
      if (slug) {
        await db
          .update(inventoryItemsTable)
          .set({ slug })
          .where(eq(inventoryItemsTable.id, row.id));
      }
    }

    if (rowsWithoutSlug.length > 0) {
      logger.info({ count: rowsWithoutSlug.length }, "Inventory sync: backfilled slugs on existing rows");
    }

    // Find all existing rows that have a slug
    const existingRows = await db
      .select({ slug: inventoryItemsTable.slug, variantLabel: inventoryItemsTable.variantLabel })
      .from(inventoryItemsTable)
      .where(inArray(inventoryItemsTable.slug, catalogKeys.map(k => k.slug)));

    const existingKeySet = new Set(
      existingRows.map(r => {
        const label = r.variantLabel ?? "";
        return label ? `${r.slug}:${label}` : r.slug!;
      })
    );

    const missing = catalogKeys.filter(k => {
      const key = k.variantLabel ? `${k.slug}:${k.variantLabel}` : k.slug;
      return !existingKeySet.has(key);
    });

    if (missing.length === 0) {
      logger.info("Inventory sync: all catalog products and variants already present");
      return;
    }

    await db.insert(inventoryItemsTable).values(
      missing.map(k => ({
        slug: k.slug,
        variantLabel: k.variantLabel,
        name: k.name,
        category: k.category,
        stock: 0,
        unit: "vials",
        lowStockThreshold: 10,
        costPerUnit: 0,
        sellPriceCents: k.sellPriceCents,
        notes: "",
      })),
    );

    logger.info({ count: missing.length }, "Inventory sync: inserted missing catalog products/variants");
  } catch (err) {
    logger.error({ err }, "Inventory sync failed — continuing startup");
  }
}
