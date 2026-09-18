import { useEffect } from "react";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { RichText } from "@/i18n/rich-text";

const SOURCE_HREFS = [
  "https://pubmed.ncbi.nlm.nih.gov/",
  "https://www.fda.gov/",
  "https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies",
];

export default function Sources() {
  const { lang, dict } = useI18n();
  const copy = dict.sources;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/sources",
    });
  }, [lang, copy.seoTitle, copy.seoDescription]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-[calc(var(--site-header-height)+1.5rem)] pb-24 md:pt-[calc(var(--site-header-height)+3rem)] md:pb-32">
        <p className="text-xs tracking-[0.2em] uppercase text-primary/60 mb-4 font-light">{copy.eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 font-light tracking-tight">
          {copy.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-16 border-b border-border pb-8">
          {copy.subtitle}
        </p>

        <div className="space-y-12 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.howTitle}</h2>
            <p>
              {copy.howBody}{" "}
              <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
                {copy.aboutLink}
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.primaryTitle}</h2>
            <ul className="space-y-6">
              {copy.items.map((source, i) => (
                <li key={source.name}>
                  <a
                    href={SOURCE_HREFS[i] ?? "#"}
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
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.questionsTitle}</h2>
            <p><RichText text={copy.questionsBody} /></p>
          </section>
        </div>
      </div>
    </div>
  );
}
