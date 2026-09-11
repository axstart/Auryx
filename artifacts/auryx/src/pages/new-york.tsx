// LEGAL REVIEW REQUIRED before publishing: NY telehealth licensure (NY is not
// in the IMLC), corporate practice of medicine, product eligibility claims.
// Copy intentionally avoids stating that any specific physician is licensed in
// New York — verify provider licensure and adjust language before launch.
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MapPin, Truck, Stethoscope, ClipboardList, PackageCheck } from "lucide-react";
import { applyPageSeo, siteUrl } from "@/lib/seo";

const NY_REGIONS = [
  "New York City", "Brooklyn", "Long Island", "Westchester", "Buffalo", "Rochester", "Albany",
];

const STEPS = [
  {
    icon: ClipboardList,
    n: "01",
    title: "Complete Your Intake",
    body: "Share your goals, health history, and current routines through a brief online intake — from anywhere in New York State, on your own schedule.",
  },
  {
    icon: Stethoscope,
    n: "02",
    title: "Physician Review",
    body: "A licensed provider reviews your profile and, where appropriate, conducts a telehealth consultation in accordance with New York telehealth regulations.",
  },
  {
    icon: PackageCheck,
    n: "03",
    title: "Protocol Matched",
    body: "You receive a physician-guided wellness protocol aligned with your goals — with the option to speak with our clinical team before proceeding.",
  },
  {
    icon: Truck,
    n: "04",
    title: "Delivered to Your Door",
    body: "Orders ship from US-based fulfillment in discreet, temperature-conscious packaging — whether you're in a Manhattan high-rise or upstate.",
  },
];

const POPULAR_PROTOCOLS = [
  {
    slug: "semaglutide",
    name: "Semaglutide",
    desc: "GLP-1 support within physician-guided metabolic wellness protocols.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    desc: "Dual-pathway GIP/GLP-1 compound for metabolic support programs.",
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    desc: "A widely researched peptide featured in recovery-focused protocols.",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    desc: "Cellular energy and longevity support in healthy-aging protocols.",
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    desc: "A popular growth-hormone-axis pairing for recovery and vitality goals.",
  },
  {
    slug: "glow-complex",
    name: "GLOW Complex",
    desc: "A skin, hair, and radiance-focused blend within aesthetic wellness protocols.",
  },
];

const WHY_TELEHEALTH = [
  {
    title: "No office visits, no waiting rooms",
    body: "Concierge wellness practices in Manhattan often involve in-person appointments, long waitlists, and premium retainers. Auryx brings physician-guided protocols to you — intake, consultation, and delivery all happen remotely.",
  },
  {
    title: "Transparent, accessible pricing",
    body: "Because we operate via telehealth without physical clinic overhead, protocol pricing stays straightforward. You pay for compounds and clinical guidance — not a Park Avenue lease.",
  },
  {
    title: "Statewide, not neighborhood-bound",
    body: "The same physician-guided experience is available whether you're in Brooklyn, Buffalo, or the North Fork. Your location in New York State doesn't change your access or your standard of care.",
  },
  {
    title: "Verified quality, wherever you are",
    body: "Every compound meets our ≥99% purity standard with third-party certificates of analysis and ships from US-based fulfillment — the same documentation-backed quality across all of New York.",
  },
];

const NY_FAQS = [
  {
    q: "Is peptide therapy available in New York?",
    a: "Yes. Auryx offers physician-guided peptide wellness protocols to New York residents via telehealth, with delivery across New York State — including New York City, Long Island, Westchester, and upstate regions.",
  },
  {
    q: "Do I need to visit an office in NYC?",
    a: "No. There are no in-person office visits. Your intake, provider review, and any consultation are completed remotely, and your protocol is shipped directly to your door anywhere in New York State.",
  },
  {
    q: "Is telehealth legal in New York?",
    a: "Yes. New York permits telehealth care, and consultations through Auryx are conducted by licensed providers in accordance with New York telehealth regulations.",
  },
  {
    q: "How fast is shipping to New York?",
    a: "Orders ship from US-based fulfillment centers. Most New York deliveries arrive within a few business days of protocol approval, in discreet, temperature-conscious packaging.",
  },
  {
    q: "Who oversees my protocol?",
    a: "Auryx is an MD-led clinic. Protocols are reviewed and guided by licensed providers, and our clinical team is available for consultation before, during, and after your order.",
  },
  {
    q: "Which protocols are most popular with New York clients?",
    a: "Metabolic support compounds like semaglutide and tirzepatide, recovery-focused peptides like BPC-157, longevity support like NAD+, and combination protocols such as CJC-1295/Ipamorelin are among the most requested.",
  },
  {
    q: "Is peptide therapy covered by insurance in New York?",
    a: "No. Auryx protocols are elective wellness services and are self-pay only. Pricing is discussed transparently before you commit, with no obligation to proceed.",
  },
  {
    q: "How do I get started as a New York resident?",
    a: "Start with our Protocol Finder or a consultation request. You'll complete a brief intake, a licensed provider will review your profile, and your protocol ships to your New York address once approved.",
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

export default function NewYorkPage() {
  useEffect(() => {
    return applyPageSeo({
      title: "Peptide Therapy in New York | MD-Led Telehealth — Auryx",
      description:
        "Physician-guided peptide therapy for New York residents via telehealth. No office visits — licensed provider oversight and direct delivery across NYC, Long Island, Westchester, and upstate NY.",
      path: "/peptide-therapy-new-york",
      jsonLd: [
        {
          id: "jsonld-ny-webpage",
          data: {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "@id": siteUrl("/peptide-therapy-new-york#webpage"),
            url: siteUrl("/peptide-therapy-new-york"),
            name: "Peptide Therapy in New York — MD-Led, Delivered to Your Door",
            description:
              "Physician-guided peptide wellness protocols available to New York residents via telehealth, with statewide delivery.",
            isPartOf: { "@id": "https://www.auryxlife.com/#website" },
            about: { "@id": "https://www.auryxlife.com/#medicalbusiness" },
            areaServed: { "@type": "State", name: "New York" },
            inLanguage: "en-US",
          },
        },
        {
          id: "jsonld-ny-faq",
          data: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": siteUrl("/peptide-therapy-new-york#faq"),
            mainEntity: NY_FAQS.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        },
      ],
    });
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/hero-bg.webp"
            alt="Physician-guided peptide therapy delivered across New York"
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
            className="max-w-lg md:max-w-[560px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">New York</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.9rem] leading-[1.15] mb-6 font-light text-white">
              Peptide therapy in New York —{" "}
              <em className="not-italic text-[#C9A844]">MD-led</em>, delivered to your door.
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Physician-guided wellness protocols for New Yorkers — no office visits, no waiting rooms. Licensed provider oversight via telehealth, with direct delivery across New York State.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 max-w-md">
              {NY_REGIONS.map(r => (
                <span key={r} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/40">
                  <MapPin className="w-3 h-3 text-[#C9A844]/60" /> {r}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Browse the Collection
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              Physician-guided · Telehealth · Statewide delivery
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How it works for NY residents ──────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">How It Works</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl text-[#111]">
              Telehealth for{" "}
              <em className="not-italic text-[#B8962E]">New York</em> residents.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white/50 rounded-2xl border border-[#1a1a1a]/08 p-7 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <s.icon className="w-5 h-5 text-[#B8962E]" />
                    <span className="font-serif text-3xl text-[#B8962E]/30 leading-none tabular-nums select-none">{s.n}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#111] mb-3 leading-snug">{s.title}</h3>
                  <p className="text-[13px] text-[#111]/55 leading-relaxed">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular protocols ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">The Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              Protocols New Yorkers{" "}
              <em className="not-italic text-[#C9A844]">ask for</em> most.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_PROTOCOLS.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 0.06}>
                <Link
                  href={`/shop/${p.slug}`}
                  className="group flex flex-col gap-3 p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/30 hover:bg-white/[0.05] transition-all duration-300 h-full"
                >
                  <h3 className="font-serif text-xl text-white leading-snug group-hover:text-[#C9A844] transition-colors">{p.name}</h3>
                  <p className="text-white/40 text-[12px] leading-relaxed flex-1">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#C9A844]/70 font-semibold group-hover:text-[#C9A844] transition-colors">
                    View Protocol <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why telehealth vs in-person ────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">Why Telehealth</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl text-[#111]">
              Concierge-level care,{" "}
              <em className="not-italic text-[#B8962E]">without</em> the concierge overhead.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {WHY_TELEHEALTH.map((w, i) => (
              <FadeIn key={i} delay={i * 0.07}>
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

      {/* ── NY FAQ ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="mb-14">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">New York FAQ</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light max-w-xl">
              Common questions from{" "}
              <em className="not-italic text-[#C9A844]">New York</em> clients.
            </h2>
          </FadeIn>

          <div className="space-y-0">
            {NY_FAQS.map((f, i) => (
              <FadeIn key={i} delay={Math.min(i * 0.05, 0.25)}>
                <div className={`py-8 ${i < NY_FAQS.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-3 leading-snug">{f.q}</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{f.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EEE4", color: "#111" }} className="py-24 md:py-28 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">Get Started</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.08] mb-7 font-light text-[#111]">
              Your protocol,{" "}
              <em className="not-italic text-[#B8962E]">shipped to New York.</em>
            </h2>
            <p className="text-[#111]/50 text-base leading-relaxed mb-10 max-w-md mx-auto">
              Answer a few questions about your goals. A licensed provider reviews your profile, and your physician-guided protocol ships to your door — anywhere in New York State.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
            <p className="mt-8 text-[11px] text-[#111]/35 leading-relaxed max-w-lg mx-auto">
              Wellness protocols are not intended to diagnose, treat, cure, or prevent any disease. Individual eligibility is determined through provider review.
            </p>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
