import type { Product } from "./products.js";

export const DEFAULT_INVENTORY_REGULATORY_STATUS = "Research Only";

export type InventoryStatusRow = {
  slug: string | null;
  regulatoryStatus?: string | null;
};

export type PublicProductSummary = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  priceCents: number;
  requiresConsultation: boolean;
  requiresColdShipping?: boolean;
  variants: Product["variants"];
  regulatoryStatus: Product["regulatoryStatus"];
  regulatory_status: string;
};

function collectErrorSignals(err: unknown): { codes: string[]; messages: string[] } {
  const codes: string[] = [];
  const messages: string[] = [];
  const seen = new Set<unknown>();
  let current: unknown = err;
  for (let i = 0; i < 5 && current && typeof current === "object" && !seen.has(current); i++) {
    seen.add(current);
    const obj = current as { code?: unknown; message?: unknown; cause?: unknown };
    if (typeof obj.code === "string") codes.push(obj.code);
    if (typeof obj.message === "string") messages.push(obj.message);
    current = obj.cause;
  }
  return { codes, messages };
}

/** Postgres undefined_column (42703) or a wrapped Drizzle "column does not exist". */
export function isUndefinedColumnError(err: unknown): boolean {
  const { codes, messages } = collectErrorSignals(err);
  if (codes.includes("42703")) return true;
  return messages.some((m) => /column .* does not exist/i.test(m) || /undefined_column/i.test(m));
}

/**
 * Prod currently 500s with Drizzle `Failed query: select ... regulatory_status`.
 * Treat that as a missing-column signal so the route can cache the fallback.
 */
export function isMissingRegulatoryStatusQueryError(err: unknown): boolean {
  if (isUndefinedColumnError(err)) return true;
  const { messages } = collectErrorSignals(err);
  return messages.some((m) => /failed query/i.test(m) && /regulatory_status/i.test(m));
}

export function regulatoryStatusBySlugFromRows(
  rows: InventoryStatusRow[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    if (row.slug) {
      map.set(row.slug, row.regulatoryStatus ?? DEFAULT_INVENTORY_REGULATORY_STATUS);
    }
  }
  return map;
}

export function summarizePublicProducts(
  products: Product[],
  regulatoryStatusBySlug: Map<string, string>,
): PublicProductSummary[] {
  return products
    .filter((p) => p.slug !== "test-charge")
    .map(
      ({
        slug,
        name,
        category,
        shortDescription,
        priceCents,
        requiresConsultation,
        requiresColdShipping,
        variants,
        regulatoryStatus,
      }) => ({
        slug,
        name,
        category,
        shortDescription,
        priceCents,
        requiresConsultation,
        requiresColdShipping,
        variants,
        regulatoryStatus,
        regulatory_status:
          regulatoryStatusBySlug.get(slug) ?? DEFAULT_INVENTORY_REGULATORY_STATUS,
      }),
    );
}
