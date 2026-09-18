// LEGAL REVIEW REQUIRED before publishing: NY telehealth licensure (NY is not
// in the IMLC), corporate practice of medicine, product eligibility claims.
// Copy intentionally avoids stating that any specific physician is licensed in
// New York — verify provider licensure and adjust language before launch.
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MapPin, ClipboardList, Stethoscope, PackageCheck, Truck } from "lucide-react";
import { applyPageSeo, siteUrl } from "@/lib/seo";
import { useI18n, langHref } from "@/i18n";

const STEP_ICONS = [ClipboardList, Stethoscope, PackageCheck, Truck];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function NewYorkPage() {
  const { lang, dict } = useI18n();
  const copy = dict.newYork;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/peptide-therapy-new-york",
      jsonLd: [
        {
          id: "jsonld-ny-webpage",
          data: {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "@id": siteUrl("/peptide-therapy-new-york#webpage"),
            url: siteUrl("/peptide-therapy-new-york"),
            name: copy.jsonLdName,
            description: copy.jsonLdDescription,
            isPartOf: { "@id": "https://www.auryxlife.com/#website" },
            about: { "@id": "https://www.auryxlife.com/#medicalbusiness" },
            areaServed: { "@type": "State", name: "New York" },
            inLanguage: lang === "es" ? "es" : lang === "pt" ? "pt-BR" : "en-US",
          },
        },
        {
          id: "jsonld-ny-faq",
          data: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": siteUrl("/peptide-therapy-new-york#faq"),
            mainEntity: copy.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        },
      ],
    });
  }, [lang, copy]);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">
      <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/hero-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 22%)" }}
          />
        </div>
        <div
          className="absolute inset-0 z-0 md:hidden"
          style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)" }}
        />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-[calc(var(--site-header-height)+1rem)] pb-20 md:pt-[calc(var(--site-header-height)+1.5rem)] md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[560px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">
              {copy.heroEyebrow}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.9rem] leading-[1.15] mb-6 font-light text-white">
              {copy.heroTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.heroTitleEm}</em>{" "}
              {copy.heroTitleAfter}
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              {copy.heroBody}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 max-w-md">
              {copy.regions.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/40"
                >
                  <MapPin className="w-3 h-3 text-[#C9A844]/60" /> {r}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href={langHref(lang, "/protocol-finder")}
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={langHref(lang, "/shop")}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaConsult}
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              {copy.serves} {copy.regions.slice(0, 3).join(" · ")}
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">
              {copy.stepsEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl text-[#111]">
              {copy.stepsTitle}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {copy.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? ClipboardList;
              return (
                <FadeIn key={s.n} delay={i * 0.08}>
                  <div className="bg-white/50 rounded-2xl border border-[#1a1a1a]/08 p-7 h-full">
                    <div className="flex items-center justify-between mb-5">
                      <Icon className="w-5 h-5 text-[#B8962E]" />
                      <span className="font-serif text-3xl text-[#B8962E]/30 leading-none tabular-nums select-none">
                        {s.n}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-[#111] mb-3 leading-snug">{s.title}</h3>
                    <p className="text-[13px] text-[#111]/55 leading-relaxed">{s.body}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">
              {copy.popularEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              {copy.popularTitle}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.popular.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 0.06}>
                <Link
                  href={langHref(lang, `/shop/${p.slug}`)}
                  className="group flex flex-col gap-3 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/30 hover:bg-white/[0.05] transition-all duration-300 h-full"
                >
                  <h3 className="font-serif text-xl text-white leading-snug group-hover:text-[#C9A844] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-white/40 text-[12px] leading-relaxed flex-1">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#C9A844]/70 font-semibold group-hover:text-[#C9A844] transition-colors">
                    {copy.ctaProtocol} <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">
              {copy.whyEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl text-[#111]">
              {copy.whyTitle}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {copy.why.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.07}>
                <div>
                  <div className="w-6 h-px bg-[#B8962E] mb-5" />
                  <h3 className="font-serif text-xl text-[#111] mb-3">{w.title}</h3>
                  <p className="text-sm text-[#111]/55 leading-relaxed">{w.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">
              {copy.faqEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              {copy.faqTitle}
            </h2>
          </FadeIn>
          <div className="space-y-0">
            {copy.faqs.map((f, i) => (
              <FadeIn key={f.q} delay={Math.min(i * 0.05, 0.25)}>
                <div className={`py-8 ${i < copy.faqs.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-3 leading-snug">{f.q}</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{f.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 md:py-28 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">
              {copy.ctaEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.08] mb-7 font-light text-[#111]">
              {copy.ctaTitle}
            </h2>
            <p className="text-[#111]/50 text-base leading-relaxed mb-10 max-w-md mx-auto">{copy.ctaBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={langHref(lang, "/protocol-finder")}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={langHref(lang, "/shop")}
                className="inline-flex items-center justify-center gap-2 border border-[#111]/25 text-[#111]/60 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#B8962E]/60 hover:text-[#B8962E] transition-colors"
              >
                {copy.ctaConsult}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
