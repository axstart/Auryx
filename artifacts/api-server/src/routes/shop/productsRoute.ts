import { Router } from "express";
import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { inventoryItemsTable, coaBatchesTable } from "@workspace/db/schema";
import { PRODUCTS, getProductBySlug } from "./products.js";
import { seedCoaBatchesFromCatalog } from "../coa/index.js";
import { logger } from "../../lib/logger.js";
import {
  DEFAULT_INVENTORY_REGULATORY_STATUS,
  summarizePublicProducts,
} from "./productsInventory.js";
import {
  loadInventoryRegulatoryStatusBySlug,
  loadInventoryRegulatoryStatusForSlug,
} from "./productsInventoryDb.js";

const router = Router();

router.get("/products", async (_req, res) => {
  try {
    const regulatoryStatusBySlug = await loadInventoryRegulatoryStatusBySlug();
    res.json(summarizePublicProducts(PRODUCTS, regulatoryStatusBySlug));
  } catch (err) {
    logger.warn({ err }, "GET /products failed; serving catalog defaults");
    res.json(summarizePublicProducts(PRODUCTS, new Map()));
  }
});

router.get("/products/:slug", async (req, res) => {
  const product = getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  let regulatoryStatus = DEFAULT_INVENTORY_REGULATORY_STATUS;
  try {
    regulatoryStatus = await loadInventoryRegulatoryStatusForSlug(req.params.slug);
  } catch (err) {
    logger.warn({ err, slug: req.params.slug }, "GET /products/:slug inventory overlay failed");
  }

  let dbCoas: (typeof coaBatchesTable.$inferSelect)[] = [];
  try {
    await seedCoaBatchesFromCatalog();
    dbCoas = await db
      .select()
      .from(coaBatchesTable)
      .where(
        and(
          eq(coaBatchesTable.productSlug, req.params.slug),
          eq(coaBatchesTable.published, true),
        ),
      );
  } catch {
    dbCoas = [];
  }

  const coas =
    dbCoas.length > 0
      ? dbCoas.map((c) => ({
          label: c.label,
          accession: c.accession,
          lab: c.lab,
          purity: c.purity ?? undefined,
          url: c.pdfUrl,
        }))
      : product.coas;

  res.json({
    ...product,
    coas,
    regulatory_status: regulatoryStatus,
  });
});

// Public endpoint — returns slug→stock mapping for all tracked inventory items.
// For variant items (variantLabel set), key is "slug:variantLabel".
router.get("/stock", async (_req, res): Promise<void> => {
  try {
    const items = await db
      .select({
        slug: inventoryItemsTable.slug,
        variantLabel: inventoryItemsTable.variantLabel,
        stock: inventoryItemsTable.stock,
      })
      .from(inventoryItemsTable)
      .where(isNotNull(inventoryItemsTable.slug));

    const stockMap: Record<string, number> = {};
    for (const item of items) {
      if (item.slug !== null) {
        const key = item.variantLabel ? `${item.slug}:${item.variantLabel}` : item.slug;
        stockMap[key] = item.stock;
      }
    }
    res.json(stockMap);
  } catch (err) {
    logger.warn({ err }, "GET /stock failed; returning empty stock map");
    res.json({});
  }
});

export default router;
