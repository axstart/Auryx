import { Router } from "express";
import { z } from "zod";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { coaBatchesTable } from "@workspace/db/schema";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import { PRODUCTS } from "../shop/products.js";

const router = Router();

/** Seed coa_batches from the static product catalog if the table is empty. */
export async function seedCoaBatchesFromCatalog(): Promise<number> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(coaBatchesTable);
  if ((count ?? 0) > 0) return 0;

  const rows = [];
  for (const product of PRODUCTS) {
    for (const coa of product.coas ?? []) {
      rows.push({
        accession: coa.accession,
        productSlug: product.slug,
        productName: product.name,
        label: coa.label,
        lab: coa.lab,
        purity: coa.purity ?? null,
        pdfUrl: coa.url,
        lotNumber: coa.accession,
        published: true,
      });
    }
  }
  if (rows.length === 0) return 0;
  await db.insert(coaBatchesTable).values(rows).onConflictDoNothing();
  return rows.length;
}

router.get("/coa/verify", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q || q.length < 3) {
    res.status(400).json({ error: "Enter at least 3 characters (accession or lot number)." });
    return;
  }

  await seedCoaBatchesFromCatalog();

  const exact = await db
    .select()
    .from(coaBatchesTable)
    .where(
      and(
        eq(coaBatchesTable.published, true),
        or(
          sql`lower(${coaBatchesTable.accession}) = ${q.toLowerCase()}`,
          sql`lower(coalesce(${coaBatchesTable.lotNumber}, '')) = ${q.toLowerCase()}`,
        ),
      ),
    )
    .limit(5);

  if (exact.length > 0) {
    res.json({ query: q, results: exact });
    return;
  }

  const fuzzy = await db
    .select()
    .from(coaBatchesTable)
    .where(
      and(
        eq(coaBatchesTable.published, true),
        or(
          ilike(coaBatchesTable.accession, `%${q}%`),
          ilike(coaBatchesTable.lotNumber, `%${q}%`),
        ),
      ),
    )
    .limit(10);

  res.json({ query: q, results: fuzzy });
});

router.get("/coa/batches/:slug", async (req, res) => {
  await seedCoaBatchesFromCatalog();
  const rows = await db
    .select()
    .from(coaBatchesTable)
    .where(
      and(
        eq(coaBatchesTable.productSlug, req.params.slug),
        eq(coaBatchesTable.published, true),
      ),
    )
    .orderBy(desc(coaBatchesTable.createdAt));
  res.json(rows);
});

router.get("/admin/coa-batches", sessionAuth, requireAdmin, async (_req, res) => {
  await seedCoaBatchesFromCatalog();
  const rows = await db
    .select()
    .from(coaBatchesTable)
    .orderBy(desc(coaBatchesTable.updatedAt))
    .limit(500);
  res.json(rows);
});

const upsertSchema = z.object({
  accession: z.string().min(2).max(80),
  productSlug: z.string().min(1).max(120),
  productName: z.string().max(200).optional(),
  label: z.string().min(1).max(80),
  lab: z.string().min(1).max(200),
  purity: z.string().max(40).optional().nullable(),
  pdfUrl: z.string().min(1).max(500),
  lotNumber: z.string().max(80).optional().nullable(),
  published: z.boolean().optional(),
});

router.post("/admin/coa-batches", sessionAuth, requireAdmin, async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid COA payload" });
    return;
  }
  const data = parsed.data;
  const product = PRODUCTS.find((p) => p.slug === data.productSlug);
  const [row] = await db
    .insert(coaBatchesTable)
    .values({
      accession: data.accession,
      productSlug: data.productSlug,
      productName: data.productName ?? product?.name ?? data.productSlug,
      label: data.label,
      lab: data.lab,
      purity: data.purity ?? null,
      pdfUrl: data.pdfUrl,
      lotNumber: data.lotNumber ?? data.accession,
      published: data.published ?? true,
    })
    .onConflictDoUpdate({
      target: coaBatchesTable.accession,
      set: {
        productSlug: data.productSlug,
        productName: data.productName ?? product?.name ?? data.productSlug,
        label: data.label,
        lab: data.lab,
        purity: data.purity ?? null,
        pdfUrl: data.pdfUrl,
        lotNumber: data.lotNumber ?? data.accession,
        published: data.published ?? true,
        updatedAt: new Date(),
      },
    })
    .returning();
  res.json(row);
});

router.patch("/admin/coa-batches/:id", sessionAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = upsertSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid COA payload" });
    return;
  }
  const [row] = await db
    .update(coaBatchesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(coaBatchesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.post("/admin/coa-batches/seed", sessionAuth, requireAdmin, async (_req, res) => {
  const inserted = await seedCoaBatchesFromCatalog();
  res.json({ inserted });
});

export default router;
