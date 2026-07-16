import { Router } from "express";
import { isNotNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { PRODUCTS, getProductBySlug } from "./products.js";

const router = Router();

router.get("/products", (_req, res) => {
  const summaries = PRODUCTS
    .filter(p => p.slug !== "test-charge")
    .map(({ slug, name, category, shortDescription, priceCents, requiresConsultation, requiresColdShipping, variants }) => ({
      slug, name, category, shortDescription, priceCents, requiresConsultation, requiresColdShipping, variants,
    }));
  res.json(summaries);
});

router.get("/products/:slug", (req, res) => {
  const product = getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

// Public endpoint — returns slug→stock mapping for all tracked inventory items
router.get("/stock", async (_req, res): Promise<void> => {
  const items = await db
    .select({ slug: inventoryItemsTable.slug, stock: inventoryItemsTable.stock })
    .from(inventoryItemsTable)
    .where(isNotNull(inventoryItemsTable.slug));

  const stockMap: Record<string, number> = {};
  for (const item of items) {
    if (item.slug !== null) stockMap[item.slug] = item.stock;
  }
  res.json(stockMap);
});

export default router;
