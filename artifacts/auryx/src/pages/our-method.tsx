import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Goal Mapping",
    subtitle: "Where you want to go",
    desc: "Every protocol starts with intent. We begin by understanding what you're optimizing for — whether that's faster recovery, sharper cognition, restored vitality, metabolic support, or healthy aging. No guesswork. No generic stacks.",
    detail: "Your goals drive everything that follows. We don't recommend protocols speculatively — we align them with what you've told us matters most.",
  },
  {
    n: "02",
    title: "Lifestyle Review",
    subtitle: "How you actually live",
    desc: "Sleep quality, training volume, stress load, nutrition habits, and existing routines all shape which protocols will genuinely move the needle for you. We ask because context is everything.",
    detail: "The same peptide can serve different purposes for different people. Understanding your baseline lets us recommend with precision rather than generality.",
  },
  {
    n: "03",
    title: "Protocol Matching",
    subtitle: "The right fit, not the popular one",
    desc: "We align your profile with AURYX's curated collection of evidence-informed peptide protocols. You'll receive recommendations rooted in your stated priorities — not bestseller rankings.",
    detail: "Our collection spans GLP-1 & metabolic support, growth hormone optimization, recovery & regeneration, cognitive performance, immune function, and longevity. The match is specific.",
  },
  {
    n: "04",
    title: "Ongoing Rhythm",
    subtitle: "Support that compounds over time",
    desc: "Longevity is a practice. Your goals and biology evolve — so should your protocol. We provide concierge guidance as your needs shift, and our clinical team is available for consultation at any point in your journey.",
    detail: "Our physician-supervised model means every protocol comes with the option to speak directly with a medical professional before, during, or after your order.",
  },
];

const PRINCIPLES = [
  {
    label: "Evidence-Informed",
    desc: "Every peptide in our collection is backed by peer-reviewed research. We don't stock trend peptides — we carry what the science supports.",
  },
  {
    label: "Physician-Supervised",
    desc: "All protocols are reviewed and supervised by licensed physicians. For complex orders, a brief clinical consultation is required before fulfillment.",
  },
  {
    label: "US-Sourced",
    desc: "All peptides are sourced from US-based, FDA-registered compounding pharmacies. No offshore manufacturing. No opaque supply chains.",
  },
  {
    label: "Pharma-Grade Purity",
    desc: "Every batch is third-party tested and must meet ≥99% purity standards before it enters our inventory. Certificates of analysis are available on request.",
  },
  {
    label: "Discreet & Fast",
    desc: "Orders are packaged discreetly and shipped with temperature-controlled methods to preserve peptide integrity from our facility to your door.",
  },
  {
    label: "Concierge Access",
    desc: "You're not on your own. Our team is accessible by chat or consultation to answer questions, adjust protocols, and support your evolving practice.",
  },
];

const SCIENCE_POINTS = [
  {
    title: "What are peptides?",
    body: "Peptides are short chains of amino acids — the same building blocks as proteins, but smaller and more targeted. The body produces peptides naturally; therapeutic peptides mimic or amplify these signals to support specific biological functions.",
  },
  {
    title: "How do they work?",
    body: "Peptides act as molecular messengers. Depending on their sequence, they can stimulate growth hormone release, accelerate tissue repair, modulate inflammation, support cognitive function, or influence metabolic processes — without the blunt-force side-effect profiles of larger pharmaceutical compounds.",
  },
  {
    title: "Why precision dosing matters",
    body: "Peptide therapy is not one-size-fits-all. Dosing, timing, and stacking depend on individual physiology, goals, and existing protocols. That's why the AURYX model pairs curated products with clinical oversight — effectiveness is in the detail.",
  },
];

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
  useEffect(() => {
    document.title = "Our Method | AURYX — Precision Longevity Protocols";
    const el = document.querySelector('meta[name="description"]');
    if (el) el.setAttribute("content", "Discover AURYX's evidence-based methodology: biomarker assessment, MD-led protocol design, US compounding pharmacy fulfillment, and ongoing clinical monitoring.");
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        {/* Right-side image */}
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/Lifestyle.webp"
            alt="AURYX longevity methodology"
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: "center top", top: "-7%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 22%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 55% 38%, rgba(201,168,68,0.07) 0%, transparent 60%)" }} />
        </div>
        {/* Mobile bg */}
        <div className="absolute inset-0 z-0 md:hidden" style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)" }} />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, rgba(10,10,10,0.95) 40%, transparent 100%)" }} />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-24 md:pt-36 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[520px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">Our Method</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              Precision by design.{" "}
              <em className="not-italic text-[#C9A844]">Trust</em>{" "}
              by standard.
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              AURYX combines evidence-based peptide science with clinical oversight and concierge-level guidance — because longevity is a practice, not a product.
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/learn"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Explore the Science
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              Evidence-based · Physician-supervised · Concierge guidance
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Philosophy bar ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4" }} className="py-14 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { label: "Evidence First", body: "Every protocol we recommend is grounded in peer-reviewed peptide research — not trends, not testimonials alone." },
              { label: "Individual Context", body: "Effective protocols are specific. We ask about your lifestyle because generic recommendations rarely produce exceptional results." },
              { label: "Long-Term Practice", body: "We're not a one-order brand. Longevity compounds. We're built to support you through seasons, not just a single shipment." },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
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

      {/* ── 4-Step Methodology ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16 md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">The Process</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              Four steps from goal<br className="hidden md:block" /> to{" "}
              <em className="not-italic text-[#C9A844]">protocol.</em>
            </h2>
          </FadeIn>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-10 py-10 md:py-12 ${i < STEPS.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  {/* Number */}
                  <div className="flex items-start">
                    <span className="font-serif text-4xl text-[#C9A844]/40 leading-none tabular-nums select-none">{step.n}</span>
                  </div>
                  {/* Title + subtitle */}
                  <div className="flex flex-col justify-start gap-1.5 md:pt-1">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A844]/65 font-semibold">{step.subtitle}</p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white leading-snug">{step.title}</h3>
                  </div>
                  {/* Body copy */}
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

      {/* ── The Science ────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F5EEE4", color: "#111" }}>
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">The Science</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-lg text-[#111]">
              Understanding the<br className="hidden md:block" />{" "}
              <em className="not-italic text-[#B8962E]">molecules</em> we use.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCIENCE_POINTS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/50 rounded-2xl border border-[#1a1a1a]/08 p-7 h-full">
                  <h3 className="font-serif text-lg text-[#111] mb-4 leading-snug">{s.title}</h3>
                  <p className="text-[13px] text-[#111]/55 leading-relaxed">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 Quality Principles ───────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">Our Standards</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              Six commitments we<br className="hidden md:block" /> make to{" "}
              <em className="not-italic text-[#C9A844]">every</em> client.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRINCIPLES.map((p, i) => (
              <FadeIn key={i} delay={i * 0.07}>
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

      {/* ── Image + CTA ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-20 md:py-28 px-8 md:px-14 lg:px-20"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">Begin Your Protocol</p>
              <h2 className="font-serif text-5xl md:text-6xl leading-[1.08] mb-7 font-light text-[#111]">
                Your method<br />
                <em className="not-italic text-[#B8962E]">starts here.</em>
              </h2>
              <p className="text-[#111]/50 text-base leading-relaxed mb-10 max-w-sm">
                Answer a few questions about your goals and lifestyle. We'll guide you toward the protocols that best match your rhythm.
              </p>
              <div className="flex flex-col gap-3 max-w-xs">
                <Link
                  href="/protocol-finder"
                  className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
                >
                  Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 border border-[#111]/25 text-[#111]/60 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#B8962E]/60 hover:text-[#B8962E] transition-colors"
                >
                  Browse the Collection
                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative min-h-[380px] md:min-h-0 overflow-hidden"
            >
              <img
                src="/peptides-collection.webp"
                alt="AURYX Peptide Protocols"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 40%" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #F5EEE4 0%, rgba(245,238,228,0.1) 20%, transparent 45%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,16,8,0.25) 0%, transparent 40%)" }} />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
