import { useEffect } from "react";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { RichText } from "@/i18n/rich-text";

export default function Contact() {
  const { lang, dict } = useI18n();
  const copy = dict.contact;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/contact",
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
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.emailTitle}</h2>
            <p><RichText text={copy.emailBody} /></p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.protocolTitle}</h2>
            <p className="mb-4">{copy.protocolBody}</p>
            <p>
              <Link href="/protocol-finder" className="text-primary hover:text-primary/80 transition-colors">
                {copy.protocolFinder}
              </Link>
              {" · "}
              <Link href="/shop" className="text-primary hover:text-primary/80 transition-colors">
                {copy.shop}
              </Link>
              {" · "}
              <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
                {copy.aboutPhysician}
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.legalTitle}</h2>
            <p>
              <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                {copy.privacy}
              </Link>
              {" · "}
              <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                {copy.terms}
              </Link>
              {" · "}
              <Link href="/sources" className="text-primary hover:text-primary/80 transition-colors">
                {copy.sources}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
