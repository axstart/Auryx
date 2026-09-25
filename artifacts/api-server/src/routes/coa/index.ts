import { Router } from "express";
import { z } from "zod";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, pool } from "@workspace/db";
import { coaBatchesTable } from "@workspace/db/schema";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import { logger } from "../../lib/logger.js";
import { PRODUCTS } from "../shop/products.js";
import { escapeIlike, searchCoaRows, type CoaSearchRow } from "./coaSearch.js";

function catalogCoaRows(): CoaSearchRow[] {
  const rows: CoaSearchRow[] = [];
  let i = 0;
  for (const product of PRODUCTS) {
    for (const coa of product.coas ?? []) {
      i += 1;
      rows.push({
        id: -i,
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
  return rows;
}

const router = Router();

const ENSURE_COA_BATCHES_SQL = `
CREATE TABLE IF NOT EXISTS coa_batches (
  id serial PRIMARY KEY,
  accession text NOT NULL UNIQUE,
  product_slug text NOT NULL,
  product_name text NOT NULL DEFAULT '',
  label text NOT NULL,
  lab text NOT NULL,
  purity text,
  pdf_url text NOT NULL,
  lot_number text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coa_batches_product_slug_idx ON coa_batches (product_slug);
CREATE INDEX IF NOT EXISTS coa_batches_lot_number_idx ON coa_batches (lot_number);
`;

async function ensureCoaBatchesTable(): Promise<void> {
  await pool.query(ENSURE_COA_BATCHES_SQL);
}

/** Seed coa_batches from the static product catalog if the table is empty. Never throws. */
export async function seedCoaBatchesFromCatalog(): Promise<number> {
  try {
    await ensureCoaBatchesTable();
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
  } catch (err) {
    logger.warn({ err }, "COA seed failed");
    return 0;
  }
}

async function searchCoaInDb(q: string): Promise<CoaSearchRow[]> {
  const exactNeedle = escapeIlike(q);
  const fuzzyNeedle = `%${exactNeedle}%`;

  const exact = await db
    .select()
    .from(coaBatchesTable)
    .where(
      and(
        eq(coaBatchesTable.published, true),
        or(
          ilike(coaBatchesTable.accession, exactNeedle),
          ilike(coaBatchesTable.lotNumber, exactNeedle),
        ),
      ),
    )
    .limit(5);

  if (exact.length > 0) return exact;

  return db
    .select()
    .from(coaBatchesTable)
    .where(
      and(
        eq(coaBatchesTable.published, true),
        or(
          ilike(coaBatchesTable.accession, fuzzyNeedle),
          ilike(coaBatchesTable.lotNumber, fuzzyNeedle),
          ilike(coaBatchesTable.productName, fuzzyNeedle),
          ilike(coaBatchesTable.productSlug, fuzzyNeedle),
          ilike(coaBatchesTable.label, fuzzyNeedle),
        ),
      ),
    )
    .limit(10);
}

router.get("/coa/verify", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q || q.length < 3) {
    res.status(400).json({ error: "Enter at least 3 characters (accession or lot number)." });
    return;
  }

  let results: CoaSearchRow[] = [];
  try {
    await seedCoaBatchesFromCatalog();
    results = await searchCoaInDb(q);
  } catch (err) {
    logger.warn({ err, q }, "COA verify DB lookup failed; using catalog");
  }

  if (results.length === 0) {
    results = searchCoaRows(q, catalogCoaRows());
  }

  res.json({ query: q, results });
});

router.get("/coa/batches/:slug", async (req, res) => {
  try {
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
    if (rows.length > 0) {
      res.json(rows);
      return;
    }
  } catch (err) {
    logger.warn({ err }, "COA batches DB lookup failed; using catalog");
  }

  res.json(catalogCoaRows().filter((r) => r.productSlug === req.params.slug && r.published));
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
