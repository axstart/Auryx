import { useEffect } from "react";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { RichText } from "@/i18n/rich-text";

export default function Privacy() {
  const { lang, dict } = useI18n();
  const copy = dict.privacy;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/privacy",
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
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.intro.title}</h2>
            <p><RichText text={copy.intro.body} /></p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.collect.title}</h2>
            <p className="mb-4">{copy.collect.lead}</p>
            <ul className="space-y-2 pl-4">
              {copy.collect.items.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>
                    <span className="text-foreground font-medium">{item.label}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.use.title}</h2>
            <p className="mb-4">{copy.use.lead}</p>
            <ul className="space-y-2 pl-4">
              {copy.use.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.hipaa.title}</h2>
            <p>{copy.hipaa.body}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.sharing.title}</h2>
            <p className="mb-4">{copy.sharing.lead}</p>
            <ul className="space-y-2 pl-4">
              {copy.sharing.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.retention.title}</h2>
            <p>{copy.retention.body}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.rights.title}</h2>
            <p className="mb-4">{copy.rights.lead}</p>
            <ul className="space-y-2 pl-4 mb-4">
              {copy.rights.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p><RichText text={copy.rights.contact} /></p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.cookies.title}</h2>
            <p>{copy.cookies.body}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.thirdParty.title}</h2>
            <p>{copy.thirdParty.body}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.children.title}</h2>
            <p>{copy.children.body}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.changes.title}</h2>
            <p>{copy.changes.body}</p>
          </section>

          <section className="border-t border-border pt-10">
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">{copy.contact.title}</h2>
            <p><RichText text={copy.contact.body} /></p>
          </section>
        </div>
      </div>
    </div>
  );
}
