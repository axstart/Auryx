export type CoaSearchRow = {
  id: number;
  accession: string;
  productSlug: string;
  productName: string;
  label: string;
  lab: string;
  purity: string | null;
  pdfUrl: string;
  lotNumber: string | null;
  published: boolean;
};

export function escapeIlike(raw: string): string {
  return raw.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function haystack(row: CoaSearchRow): string {
  return [row.accession, row.lotNumber ?? "", row.productName, row.productSlug, row.label]
    .join("\n")
    .toLowerCase();
}

/** Exact accession/lot first, then fuzzy name/slug/label. Empty on miss — never throws. */
export function searchCoaRows(query: string, rows: CoaSearchRow[]): CoaSearchRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const published = rows.filter((r) => r.published);
  const exact = published.filter(
    (r) => r.accession.toLowerCase() === q || (r.lotNumber ?? "").toLowerCase() === q,
  );
  if (exact.length > 0) return exact.slice(0, 5);

  return published.filter((r) => haystack(r).includes(q)).slice(0, 10);
}
