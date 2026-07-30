import { Router } from "express";
import { isNotNull, inArray } from "drizzle-orm";
import { db } from "@workspace/db";
import { inventoryItemsTable } from "@workspace/db/schema";
import { PRODUCTS, getProductBySlug } from "./products.js";

const router = Router();

router.get("/products", async (_req, res) => {
  const inventory = await db
    .select({
      slug: inventoryItemsTable.slug,
      regulatoryStatus: inventoryItemsTable.regulatoryStatus,
    })
    .from(inventoryItemsTable)
    .where(isNotNull(inventoryItemsTable.slug));
  const regulatoryStatusBySlug = new Map(
    inventory
      .filter(item => item.slug !== null)
      .map(item => [item.slug as string, item.regulatoryStatus]),
  );
  const summaries = PRODUCTS
    .filter(p => p.slug !== "test-charge")
    .map(({ slug, name, category, shortDescription, priceCents, requiresConsultation, requiresColdShipping, variants, regulatoryStatus }) => ({
      slug, name, category, shortDescription, priceCents, requiresConsultation, requiresColdShipping, variants, regulatoryStatus,
      regulatory_status: regulatoryStatusBySlug.get(slug) ?? "Research Only",
    }));
  res.json(summaries);
});

router.get("/products/:slug", async (req, res) => {
  const product = getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [inventory] = await db
    .select({ regulatoryStatus: inventoryItemsTable.regulatoryStatus })
    .from(inventoryItemsTable)
    .where(inArray(inventoryItemsTable.slug, [req.params.slug]))
    .limit(1);
  res.json({
    ...product,
    regulatory_status: inventory?.regulatoryStatus ?? "Research Only",
  });
});

// Public endpoint — returns slug→stock mapping for all tracked inventory items.
// For variant items (variantLabel set), key is "slug:variantLabel".
router.get("/stock", async (_req, res): Promise<void> => {
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
});

export default router;
