import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, FileSearch, BookOpenCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { applyPageSeo, siteUrl } from "@/lib/seo";

const REVIEW_PROCESS = [
  {
    icon: FileSearch,
    title: "Medical Director Review",
    body: "Every Learn article, protocol page, and educational resource published on this site is reviewed by our medical director before it goes live. Content that describes compounds, mechanisms, or protocols does not publish without physician sign-off.",
  },
  {
    icon: BookOpenCheck,
    title: "Citations to Peer-Reviewed Research",
    body: "Educational claims are grounded in published, peer-reviewed literature. Where the evidence is early-stage or limited to preclinical research, we say so plainly rather than overstating what the science supports.",
  },
  {
    icon: RefreshCcw,
    title: "Ongoing Update Cadence",
    body: "Peptide research evolves quickly. We periodically re-review published content against current literature and regulatory guidance, and update or retire material that no longer reflects the best available evidence.",
  },
];

const QUALITY_STANDARDS = [
  {
    label: "≥99% Purity Standard",
    desc: "Every batch must meet a minimum 99% purity threshold, verified by independent third-party analysis, before it enters our inventory.",
  },
  {
    label: "Third-Party COAs",
    desc: "Certificates of analysis from independent laboratories are available for our compounds — documentation you can verify, not just claims.",
  },
  {
    label: "US-Based Fulfillment",
    desc: "Compounds are sourced and fulfilled within the United States. No offshore manufacturing, no opaque supply chains.",
  },
  {
    label: "Physician Oversight",
    desc: "Protocols are overseen by licensed physicians via telehealth, with clinical consultation available before, during, and after your order.",
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

export default function AboutPage() {
  useEffect(() => {
    return applyPageSeo({
      title: "About Auryx | Meet the Physician — Romy Fontoura, MD",
      description:
        "Auryx is an MD-led telehealth peptide therapy clinic founded by Romy Fontoura, MD. Learn about our medical review process, quality standards, and physician oversight.",
      path: "/about",
      jsonLd: [
        {
          id: "jsonld-about-physician",
          data: {
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": siteUrl("/about#physician"),
            name: "Romy Fontoura, MD",
            jobTitle: "Founder & Medical Director",
            description:
              "Founder and medical director of Auryx, an MD-led telehealth clinic offering physician-guided peptide therapy protocols across the United States.",
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
            name: "About Auryx | Meet the Physician",
            description:
              "About Auryx: physician leadership, medical review process, and quality standards behind our telehealth peptide therapy protocols.",
            isPartOf: { "@id": "https://www.auryxlife.com/#website" },
            about: { "@id": "https://www.auryxlife.com/#organization" },
            mainEntity: { "@id": siteUrl("/about#physician") },
            inLanguage: "en-US",
          },
        },
      ],
    });
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/about-bg.webp"
            alt="Auryx clinical standards"
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
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">About Auryx</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              Medicine-led.{" "}
              <em className="not-italic text-[#C9A844]">Physician</em>{" "}
              accountable.
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              Auryx is an MD-led telehealth clinic offering physician-guided peptide therapy protocols across the United States — built on clinical oversight, verified quality, and honest education.
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/our-method"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Explore Our Method
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Physician bio ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
            {/* Placeholder headshot block */}
            {/* CLIENT INPUT NEEDED: professional headshot of Dr. Fontoura — supply before publishing */}
            <FadeIn>
              <div className="aspect-[4/5] rounded-2xl border border-[#1a1a1a]/10 bg-white/60 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-16 h-16 rounded-full border border-[#B8962E]/40 flex items-center justify-center">
                  <span className="font-serif text-2xl text-[#B8962E]">RF</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#111]/40 font-medium">Physician portrait</p>
                <p className="text-[11px] text-[#111]/35 leading-relaxed max-w-[220px]">Official headshot coming soon.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">Meet the Physician</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-[#111] mb-3">
                Romy Fontoura, <em className="not-italic text-[#B8962E]">MD</em>
              </h2>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#111]/45 font-semibold mb-7">Founder & Medical Director</p>
              <div className="space-y-4 text-sm text-[#111]/60 leading-relaxed max-w-lg">
                <p>
                  Dr. Fontoura founded Auryx to bring physician accountability to a category too often defined by unregulated sourcing and anonymous storefronts. As medical director, she oversees the peptide therapy protocols Auryx offers via telehealth across the United States — from compound selection and quality standards to the clinical review behind every published resource.
                </p>
                <p>
                  Under her direction, Auryx pairs curated, third-party-tested compounds with medical oversight: protocols are designed around individual goals and reviewed by licensed clinicians, not dispensed as one-size-fits-all stacks.
                </p>
              </div>

              {/* CLIENT INPUT NEEDED: medical school, residency, board certifications, NY license — supply before publishing */}
              <div className="mt-8 rounded-xl border border-dashed border-[#B8962E]/40 bg-white/50 p-5 max-w-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8962E] font-semibold mb-2">Education & Licensure</p>
                <p className="text-[13px] text-[#111]/50 leading-relaxed">
                  Full details of Dr. Fontoura's medical education, training, and state licensure are being prepared for publication. For verification questions in the meantime, contact{" "}
                  <a href="mailto:info@auryxlife.com" className="text-[#B8962E] hover:underline">info@auryxlife.com</a>.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Medical review process ─────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">Editorial Integrity</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              Our medical{" "}
              <em className="not-italic text-[#C9A844]">review</em> process.
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mt-6 max-w-lg">
              Health content carries responsibility. Everything we publish — from Learn guides to protocol pages — follows the same review standard.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEW_PROCESS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex flex-col gap-4 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/30 hover:bg-white/[0.05] transition-all duration-300 h-full">
                  <item.icon className="w-5 h-5 text-[#C9A844] shrink-0" />
                  <div>
                    <h3 className="text-white font-medium text-sm tracking-wide mb-2">{item.title}</h3>
                    <p className="text-white/40 text-[12px] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality standards ──────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F5EEE4", color: "#111" }}>
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">Quality Standards</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-lg text-[#111]">
              Standards you can{" "}
              <em className="not-italic text-[#B8962E]">verify.</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUALITY_STANDARDS.map((q, i) => (
              <FadeIn key={i} delay={i * 0.07}>
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

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-28 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <ShieldCheck className="w-7 h-7 text-[#C9A844] mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light mb-6">
              Questions about our{" "}
              <em className="not-italic text-[#C9A844]">clinical</em> standards?
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Our team is happy to walk you through our quality documentation, review process, or how physician oversight works at Auryx.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="mailto:info@auryxlife.com"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
