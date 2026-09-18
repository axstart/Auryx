import { initialLang } from "@/i18n";

export type ProductLocaleOverlay = {
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  dosingInfo: string;
  physicianNote?: string;
};

const overlays: Record<string, ProductLocaleOverlay> | null =
  initialLang === "es"
    ? ((await import("./products-locale.es")).productsLocaleEs as Record<string, ProductLocaleOverlay>)
    : initialLang === "pt"
      ? ((await import("./products-locale.pt")).productsLocalePt as Record<string, ProductLocaleOverlay>)
      : null;

export function applyProductLocale<
  T extends {
    slug: string;
    shortDescription: string;
    fullDescription?: string;
    benefits?: string[];
    dosingInfo?: string;
    physicianNote?: string;
    name?: string;
  },
>(product: T, lang: "en" | "es" | "pt"): T {
  if (lang === "en" || !overlays) return product;
  const overlay = overlays[product.slug];
  if (!overlay) return product;
  return {
    ...product,
    shortDescription: overlay.shortDescription,
    ...(product.fullDescription !== undefined
      ? { fullDescription: overlay.fullDescription }
      : {}),
    ...(product.benefits !== undefined ? { benefits: overlay.benefits } : {}),
    ...(product.dosingInfo !== undefined ? { dosingInfo: overlay.dosingInfo } : {}),
    ...(overlay.physicianNote !== undefined || product.physicianNote !== undefined
      ? { physicianNote: overlay.physicianNote ?? product.physicianNote }
      : {}),
  };
}
