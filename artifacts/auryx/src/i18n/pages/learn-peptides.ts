import { initialLang } from "@/i18n";

export type PeptideBody = {
  definition: string;
  mechanism: string;
  benefits: string[];
  typicalUse: string;
  researchNote?: string;
};

const bodies: Record<string, PeptideBody> =
  initialLang === "es"
    ? ((await import("./learn-peptides.es")).learnPeptidesEs as Record<string, PeptideBody>)
    : initialLang === "pt"
      ? ((await import("./learn-peptides.pt")).learnPeptidesPt as Record<string, PeptideBody>)
      : ((await import("./learn-peptides.en")).learnPeptidesEn as Record<string, PeptideBody>);

export function getPeptideBody(slug: string, _lang?: "en" | "es" | "pt"): PeptideBody | undefined {
  return bodies[slug];
}
