import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { applyPageSeo } from "@/lib/seo";
import { useI18n, langHref } from "@/i18n";

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

export default function OurMethodPage() {
  const { lang, dict } = useI18n();
  const copy = dict.ourMethod;

  useEffect(() => {
    return applyPageSeo({
      title: copy.seoTitle,
      description: copy.seoDescription,
      path: "/our-method",
    });
  }, [lang, copy.seoTitle, copy.seoDescription]);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/Lifestyle.webp"
            alt={copy.heroAlt}
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: "center top", top: "-7%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 22%)" }} />
        </div>
        <div className="absolute inset-0 z-0 md:hidden" style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)" }} />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-[calc(var(--site-header-height)+1rem)] pb-24 md:pt-[calc(var(--site-header-height)+1.5rem)] md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[520px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">{copy.heroEyebrow}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              {copy.heroTitleBefore}{" "}
              <em className="not-italic text-[#C9A844]">{copy.heroTitleEm}</em>{" "}
              {copy.heroTitleAfter}
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">{copy.heroBody}</p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href={langHref(lang, "/protocol-finder")}
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {copy.ctaProtocol} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={langHref(lang, "/learn")}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {copy.ctaScience}
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">{copy.trustLine}</p>
          </motion.div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4" }} className="py-14 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {copy.philosophy.map((p, i) => (
              <FadeIn key={p.label} delay={i * 0.1}>
                <div>
                  <div className="w-6 h-px bg-[#C9A844] mb-5" />
                  <h3 className="font-serif text-xl text-[#111] mb-3">{p.label}</h3>
                  <p className="text-sm text-[#111]/55 leading-relaxed">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16 md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">{copy.processEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              {copy.processTitleBefore}{" "}
              {copy.processTitleMid}{" "}
              <em className="not-italic text-[#C9A844]">{copy.processTitleEm}</em>
            </h2>
          </FadeIn>
          <div className="space-y-0">
            {copy.steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.08}>
                <div className={`grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-10 py-10 md:py-12 ${i < copy.steps.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  <div className="flex items-start">
                    <span className="font-serif text-4xl text-[#C9A844]/40 leading-none tabular-nums select-none">{step.n}</span>
                  </div>
                  <div className="flex flex-col justify-start gap-1.5 md:pt-1">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A844]/65 font-semibold">{step.subtitle}</p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white leading-snug">{step.title}</h3>
                  </div>
                  <div className="space-y-3 md:pt-1">
                    <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
                    <p className="text-[12px] text-white/30 leading-relaxed border-l border-[#C9A844]/20 pl-4">{step.detail}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F5EEE4", color: "#111" }}>
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">{copy.scienceEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-lg text-[#111]">
              {copy.scienceTitleBefore}{" "}
              <em className="not-italic text-[#B8962E]">{copy.scienceTitleEm}</em>{" "}
              {copy.scienceTitleAfter}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {copy.sciencePoints.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.1}>
                <div className="bg-white/50 rounded-2xl border border-[#1a1a1a]/08 p-7 h-full">
                  <h3 className="font-serif text-lg text-[#111] mb-4 leading-snug">{s.title}</h3>
                  <p className="text-[13px] text-[#111]/55 leading-relaxed">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">{copy.standardsEyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              {copy.standardsTitleBefore}{" "}
              {copy.standardsTitleMid}{" "}
              <em className="not-italic text-[#C9A844]">{copy.standardsTitleEm}</em>{" "}
              {copy.standardsTitleAfter}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.principles.map((p, i) => (
              <FadeIn key={p.label} delay={i * 0.07}>
                <div className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/30 hover:bg-white/[0.05] transition-all duration-300 h-full">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A844] shrink-0" />
                  <div>
                    <h3 className="text-white font-medium text-sm tracking-wide mb-2">{p.label}</h3>
                    <p className="text-white/40 text-[12px] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-20 md:py-28 px-8 md:px-14 lg:px-20"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">{copy.ctaEyebrow}</p>
              <h2 className="font-serif text-5xl md:text-6xl leading-[1.08] mb-7 font-light text-[#111]">
                {copy.ctaTitleBefore}{" "}
                <em className="not-italic text-[#B8962E]">{copy.ctaTitleEm}</em>
              </h2>
              <p className="text-[#111]/50 text-base leading-relaxed mb-10 max-w-sm">{copy.ctaBody}</p>
              <div className="flex flex-col gap-3 max-w-xs">
                <Link
                  href={langHref(lang, "/protocol-finder")}
                  className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
                >
                  {copy.ctaFind} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={langHref(lang, "/shop")}
                  className="inline-flex items-center justify-center gap-2 border border-[#111]/25 text-[#111]/60 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#B8962E]/60 hover:text-[#B8962E] transition-colors"
                >
                  {copy.ctaBrowse}
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative min-h-[380px] md:min-h-0 overflow-hidden"
            >
              <img
                src="/peptides-collection.webp"
                alt={copy.collectionAlt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 40%" }}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
