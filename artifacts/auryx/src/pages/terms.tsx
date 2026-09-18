import { useEffect } from "react";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { RichText } from "@/i18n/rich-text";

export default function Terms() {
  const { lang, dict } = useI18n();
  const copy = dict.terms;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/terms",
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
          {copy.effectiveDate}
        </p>

        <div className="space-y-12 text-muted-foreground leading-relaxed">
          {copy.sections.map((section, idx) => (
            <section
              key={section.title}
              className={idx === copy.sections.length - 1 ? "border-t border-border pt-10" : undefined}
            >
              <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{section.title}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className={i < section.paragraphs.length - 1 ? "mb-4" : undefined}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
