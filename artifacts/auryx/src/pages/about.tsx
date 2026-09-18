import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, FileSearch, BookOpenCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { applyPageSeo, siteUrl } from "@/lib/seo";
import { useI18n } from "@/i18n";

const REVIEW_ICONS = [FileSearch, BookOpenCheck, RefreshCcw] as const;

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

export default function AboutPage() {
  const { lang, dict } = useI18n();
  const copy = dict.about;
  const htmlLang = lang === "pt" ? "pt-BR" : lang === "es" ? "es" : "en-US";

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/about",
      jsonLd: [
        {
          id: "jsonld-about-physician",
          data: {
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": siteUrl("/about#physician"),
            name: "Romy Fontoura, MD",
            jobTitle: copy.physicianRole,
            description: copy.jsonLdPhysicianDescription,
            medicalSpecialty: ["Regenerative medicine", "Integrative medicine", "Telehealth"],
            worksFor: { "@id": "https://www.auryxlife.com/#organization" },
            url: siteUrl("/about"),
          },
        },
        {
          id: "jsonld-about-webpage",
          data: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": siteUrl("/about#webpage"),
            url: siteUrl("/about"),
            name: copy.jsonLdPageName,
            description: copy.jsonLdPageDescription,
            isPartOf: { "@id": "https://www.auryxlife.com/#website" },
            about: { "@id": "https://www.auryxlife.com/#organization" },
            mainEntity: { "@id": siteUrl("/about#physician") },
            inLanguage: htmlLang,
          },
        },
      ],
    });
  }, [lang, copy, htmlLang]);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/about-bg.webp"
            alt={copy.heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 22%)" }} />
        </div>
        <div className="absolute inset-0 z-0 md:hidden" style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)" }} />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, rgba(10,10,10,0.95) 40%, transparent 100%)" }} />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-[calc(var(--site-header-height)+1rem)] pb-20 md:pt-[calc(var(--site-header-height)+1.5rem)] md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[540px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">{copy.heroEyebrow}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              {copy.heroTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.heroTitleEm}</em>{" "}
              {copy.heroTitleAfter}
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              {copy.heroBody}
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/our-method"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaMethod}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
            <FadeIn>
              <div className="aspect-[4/5] rounded-2xl border border-[#1a1a1a]/10 bg-white/60 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-16 h-16 rounded-full border border-[#B8962E]/40 flex items-center justify-center">
                  <span className="font-serif text-2xl text-[#B8962E]">RF</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#111]/40 font-medium">{copy.portraitLabel}</p>
                <p className="text-[11px] text-[#111]/35 leading-relaxed max-w-[220px]">{copy.portraitHint}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">{copy.meetEyebrow}</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-[#111] mb-3">
                {copy.physicianName} <em className="not-italic text-[#B8962E]">{copy.physicianCredential}</em>
              </h2>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#111]/45 font-semibold mb-7">{copy.physicianRole}</p>
              <div className="space-y-4 text-sm text-[#111]/60 leading-relaxed max-w-lg">
                <p>{copy.bio1}</p>
                <p>{copy.bio2}</p>
              </div>

              <div className="mt-8 rounded-xl border border-dashed border-[#B8962E]/40 bg-white/50 p-5 max-w-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8962E] font-semibold mb-2">{copy.educationTitle}</p>
                <p className="text-[13px] text-[#111]/50 leading-relaxed">
                  <span>{copy.educationBody.replace("info@auryxlife.com", "").trim()} </span>
                  <a href="mailto:info@auryxlife.com" className="text-[#B8962E] hover:underline">info@auryxlife.com</a>.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">{copy.reviewEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              {copy.reviewTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.reviewTitleEm}</em> {copy.reviewTitleAfter}
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mt-6 max-w-lg">{copy.reviewIntro}</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {copy.reviewProcess.map((item, i) => {
              const Icon = REVIEW_ICONS[i] ?? FileSearch;
              return (
                <FadeIn key={item.title} delay={i * 0.08}>
                  <div className="flex flex-col gap-4 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/30 hover:bg-white/[0.05] transition-all duration-300 h-full">
                    <Icon className="w-5 h-5 text-[#C9A844] shrink-0" />
                    <div>
                      <h3 className="text-white font-medium text-sm tracking-wide mb-2">{item.title}</h3>
                      <p className="text-white/40 text-[12px] leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F5EEE4", color: "#111" }}>
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">{copy.qualityEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-lg text-[#111]">
              {copy.qualityTitleBefore}{" "}
              <em className="not-italic text-[#B8962E]">{copy.qualityTitleEm}</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {copy.qualityStandards.map((q, i) => (
              <FadeIn key={q.label} delay={i * 0.07}>
                <div className="flex gap-4 bg-white/50 rounded-2xl border border-[#1a1a1a]/08 p-7 h-full">
                  <CheckCircle2 className="w-5 h-5 text-[#B8962E] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg text-[#111] mb-2 leading-snug">{q.label}</h3>
                    <p className="text-[13px] text-[#111]/55 leading-relaxed">{q.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <ShieldCheck className="w-7 h-7 text-[#C9A844] mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light mb-6">
              {copy.ctaTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.ctaTitleEm}</em> {copy.ctaTitleAfter}
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-md mx-auto">{copy.ctaBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaFind} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="mailto:info@auryxlife.com"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaContact}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
