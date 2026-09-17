import { useEffect } from "react";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";

const SOURCES = [
  {
    href: "https://pubmed.ncbi.nlm.nih.gov/",
    name: "PubMed / NCBI",
    detail:
      "Primary index of peer-reviewed biomedical literature used to ground educational claims about peptide mechanisms and clinical research.",
  },
  {
    href: "https://www.fda.gov/",
    name: "US Food and Drug Administration",
    detail:
      "Federal guidance on compounding, labeling, and drug quality that informs how Auryx describes fulfillment and regulatory status.",
  },
  {
    href: "https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies",
    name: "FDA compounding laws and policies",
    detail:
      "Public overview of US compounding policy for clinics that source physician-prescribed compounds from regulated pharmacies.",
  },
];

export default function Sources() {
  useEffect(() => {
    return applyPageSeo({
      title: "Sources & Citations | Auryx",
      description:
        "Citations and primary sources behind Auryx educational pages on MD-led peptide therapy and longevity medicine.",
      path: "/sources",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-[calc(var(--site-header-height)+1.5rem)] pb-24 md:pt-[calc(var(--site-header-height)+3rem)] md:pb-32">
        <p className="text-xs tracking-[0.2em] uppercase text-primary/60 mb-4 font-light">Research</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 font-light tracking-tight">
          Sources & Citations
        </h1>
        <p className="text-sm text-muted-foreground mb-16 border-b border-border pb-8">
          Educational pages cite public literature. They do not replace medical advice.
        </p>

        <div className="space-y-12 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">How Auryx cites</h2>
            <p>
              Learn articles and protocol education are reviewed by the medical director. Where
              evidence is early-stage or preclinical, Auryx says so. For the people and process
              behind that review, see{" "}
              <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
                About
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">Primary references</h2>
            <ul className="space-y-6">
              {SOURCES.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {source.name}
                  </a>
                  <p className="mt-2">{source.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">Questions</h2>
            <p>
              To ask about a specific citation or protocol, use the{" "}
              <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
                contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
