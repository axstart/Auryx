import { Router } from "express";
import { PRODUCTS, getProductBySlug } from "./products.js";

const router = Router();

router.get("/products", (_req, res) => {
  const summaries = PRODUCTS.map(({ slug, name, category, shortDescription, priceCents, requiresConsultation }) => ({
    slug, name, category, shortDescription, priceCents, requiresConsultation,
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

export default router;
