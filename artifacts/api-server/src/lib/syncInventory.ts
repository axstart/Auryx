import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { inArray } from "drizzle-orm";
import { PRODUCTS } from "../routes/shop/products.js";
import { logger } from "./logger.js";

export async function syncInventoryFromCatalog(): Promise<void> {
  try {
    const catalogItems = PRODUCTS.map(p => ({
      name: p.name,
      category: p.category,
      sellPriceCents: p.priceCents,
    }));

    const catalogNames = catalogItems.map(p => p.name);

    const existing = await db
      .select({ name: inventoryItemsTable.name })
      .from(inventoryItemsTable)
      .where(inArray(inventoryItemsTable.name, catalogNames));

    const existingNames = new Set(existing.map(r => r.name));
    const missing = catalogItems.filter(p => !existingNames.has(p.name));

    if (missing.length === 0) {
      logger.info("Inventory sync: all catalog products already present");
      return;
    }

    await db.insert(inventoryItemsTable).values(
      missing.map(p => ({
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

    logger.info({ count: missing.length, names: missing.map(p => p.name) }, "Inventory sync: inserted missing catalog products");
  } catch (err) {
    logger.error({ err }, "Inventory sync failed — continuing startup");
  }
}
