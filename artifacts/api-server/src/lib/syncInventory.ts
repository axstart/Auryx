import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { inArray, isNull, eq } from "drizzle-orm";
import { PRODUCTS } from "../routes/shop/products.js";
import { logger } from "./logger.js";

export async function syncInventoryFromCatalog(): Promise<void> {
  try {
    const catalogItems = PRODUCTS.map(p => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      sellPriceCents: p.priceCents,
    }));

    const catalogSlugs = catalogItems.map(p => p.slug);
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

    // Insert catalog products not yet in inventory (match by slug)
    const existing = await db
      .select({ slug: inventoryItemsTable.slug })
      .from(inventoryItemsTable)
      .where(inArray(inventoryItemsTable.slug, catalogSlugs));

    const existingSlugs = new Set(existing.map(r => r.slug!));
    const missing = catalogItems.filter(p => !existingSlugs.has(p.slug));

    if (missing.length === 0) {
      logger.info("Inventory sync: all catalog products already present");
      return;
    }

    await db.insert(inventoryItemsTable).values(
      missing.map(p => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        stock: 0,
        unit: "vials",
        lowStockThreshold: 10,
        costPerUnit: 0,
        sellPriceCents: p.sellPriceCents,
        notes: "",
      })),
    );

    logger.info({ count: missing.length }, "Inventory sync: inserted missing catalog products");
  } catch (err) {
    logger.error({ err }, "Inventory sync failed — continuing startup");
  }
}
