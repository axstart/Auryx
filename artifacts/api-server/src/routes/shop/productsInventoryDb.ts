import { inArray, isNotNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { logger } from "../../lib/logger.js";
import {
  DEFAULT_INVENTORY_REGULATORY_STATUS,
  isMissingRegulatoryStatusQueryError,
  regulatoryStatusBySlugFromRows,
} from "./productsInventory.js";

/** After the first undefined-column failure, skip `regulatory_status` for this process. */
let skipRegulatoryStatusColumn = false;

export function resetInventoryRegulatoryColumnCache(): void {
  skipRegulatoryStatusColumn = false;
}

async function loadSlugOnlyFallback(): Promise<Map<string, string>> {
  try {
    const inventory = await db
      .select({ slug: inventoryItemsTable.slug })
      .from(inventoryItemsTable)
      .where(isNotNull(inventoryItemsTable.slug));
    return regulatoryStatusBySlugFromRows(inventory);
  } catch (err) {
    logger.warn({ err }, "inventory slug fallback failed; catalog-only products");
    return new Map();
  }
}

export async function loadInventoryRegulatoryStatusBySlug(): Promise<Map<string, string>> {
  if (skipRegulatoryStatusColumn) {
    return loadSlugOnlyFallback();
  }

  try {
    const inventory = await db
      .select({
        slug: inventoryItemsTable.slug,
        regulatoryStatus: inventoryItemsTable.regulatoryStatus,
      })
      .from(inventoryItemsTable)
      .where(isNotNull(inventoryItemsTable.slug));
    return regulatoryStatusBySlugFromRows(inventory);
  } catch (err) {
    if (isMissingRegulatoryStatusQueryError(err)) {
      skipRegulatoryStatusColumn = true;
      logger.warn(
        { err },
        "inventory_items.regulatory_status missing; using catalog defaults",
      );
      return loadSlugOnlyFallback();
    }
    logger.warn({ err }, "inventory regulatory lookup failed; using catalog defaults");
    return new Map();
  }
}

export async function loadInventoryRegulatoryStatusForSlug(slug: string): Promise<string> {
  if (skipRegulatoryStatusColumn) {
    return DEFAULT_INVENTORY_REGULATORY_STATUS;
  }

  try {
    const [inventory] = await db
      .select({ regulatoryStatus: inventoryItemsTable.regulatoryStatus })
      .from(inventoryItemsTable)
      .where(inArray(inventoryItemsTable.slug, [slug]))
      .limit(1);
    return inventory?.regulatoryStatus ?? DEFAULT_INVENTORY_REGULATORY_STATUS;
  } catch (err) {
    if (isMissingRegulatoryStatusQueryError(err)) {
      skipRegulatoryStatusColumn = true;
    }
    logger.warn({ err, slug }, "inventory regulatory lookup failed for product; defaulting");
    return DEFAULT_INVENTORY_REGULATORY_STATUS;
  }
}
