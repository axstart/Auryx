import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, lazy } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
const MoleculeDockScene = lazy(() => import("@/components/MoleculeDockScene"));
import { PatientAssessment } from "@/components/PatientAssessment";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Flame,
  ShieldPlus,
  Sparkles,
  Zap,
  Brain,
  Moon,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────── */

const FOCUS_AREAS = [
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Metabolic Support",
    desc: "Support healthy body composition, metabolic function, and appetite regulation through evidence-informed wellness protocols.",
    accent: "#B8962E",
    slug: "GLP-1 & Metabolic",
  },
  {
    icon: <ShieldPlus className="w-5 h-5" />,
    title: "Recovery & Resilience",
    desc: "Support tissue repair, reduce recovery time, and help your body respond better to physical training and daily demands.",
    accent: "#0D9488",
    slug: "Recovery & Regeneration",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Skin & Healthy Aging",
    desc: "Support collagen synthesis, skin elasticity, and the cellular processes that contribute to a more youthful appearance over time.",
    accent: "#B8962E",
    slug: "Auryx Signature Complexes",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Energy & Vitality",
    desc: "Support mitochondrial health, hormone optimization, and the cellular energy systems that drive how you feel day to day.",
    accent: "#0D9488",
    slug: "Immune & Longevity",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Cognitive Performance",
    desc: "Support focus, memory, and neuroprotection through protocols designed to maintain clarity and mental sharpness over time.",
    accent: "#B8962E",
    slug: "Cognitive & Neuroprotective",
  },
  {
    icon: <Moon className="w-5 h-5" />,
    title: "Sleep & Restoration",
    desc: "Support deeper sleep, circadian rhythm, and the overnight repair processes central to long-term health and performance.",
    accent: "#0D9488",
    slug: "Growth Hormone",
  },
];

const STANDARD_PILLARS = [
  {
    num: "01",
    title: "Quality-vetted sourcing",
    desc: "Every protocol is compounded at US-licensed pharmacies. Third-party tested, pharmaceutical-grade — nothing less.",
  },
  {
    num: "02",
    title: "Education before action",
    desc: "We believe you should understand what you're putting in your body before you begin. Clarity is the foundation of trust.",
  },
  {
    num: "03",
    title: "Lifestyle-first optimization",
    desc: "Peptides are one layer of a broader strategy. We connect modern wellness science with sleep, training, nutrition, and recovery.",
  },
  {
    num: "04",
    title: "Discreet, elevated experience",
    desc: "From consultation to doorstep, the Auryx experience is seamless, private, and designed to reflect the premium nature of what you're doing.",
  },
];

const EDUCATION_ARTICLES = [
  {
    num: "01",
    title: "What are peptide protocols?",
    desc: "An accessible introduction to what peptides are, how they work in the body, and what makes them different from conventional supplements.",
  },
  {
    num: "02",
    title: "How recovery shapes long-term performance",
    desc: "Why the recovery phase of any routine matters more than most people realise — and how supporting it changes your baseline over time.",
  },
  {
    num: "03",
    title: "Why healthy aging starts with rhythm",
    desc: "The science connecting circadian biology, sleep quality, and daily lifestyle patterns to how we age at the cellular level.",
  },
  {
    num: "04",
    title: "The difference between support and shortcuts",
    desc: "Why the Auryx approach is built around sustainable optimization, not quick fixes — and how that shapes every protocol we offer.",
  },
];

const FEATURED_PROTOCOLS = [
  {
    name: "CJC-1295 + Ipamorelin",
    category: "Growth Hormone",
    desc: "Support deep sleep, lean tissue maintenance, and recovery through natural growth hormone optimization.",
    slug: "cjc-ipamorelin",
  },
  {
    name: "BPC-157",
    category: "Recovery & Regeneration",
    desc: "Support tissue repair and gut health with one of the most studied recovery-focused peptide protocols.",
    slug: "bpc-157",
  },
  {
    name: "Semax",
    category: "Cognitive Performance",
    desc: "Support focus, memory, and mental resilience with a neuroprotective protocol for high-demand lifestyles.",
    slug: "semax",
  },
  {
    name: "GLOW Complex",
    category: "Skin & Healthy Aging",
    desc: "An Auryx-curated formulation designed to support skin elasticity, collagen synthesis, and connective tissue over time.",
    slug: "glow-complex",
  },
];

const FAQS = [
  { q: "Are peptide protocols safe?", a: "Peptide wellness protocols are designed to be used thoughtfully, with proper guidance. All Auryx protocols are physician-reviewed, sourced from US-licensed compounding pharmacies, and third-party tested for purity and potency. We recommend consulting a licensed healthcare provider before starting any protocol." },
  { q: "How quickly might I notice changes?", a: "Individual results vary depending on the protocol, your starting baseline, and lifestyle factors. Some people notice changes in sleep quality and daily energy within the first few weeks. Other outcomes may take longer to observe and are always influenced by nutrition, training, and recovery habits." },
  { q: "Do I need an in-person appointment?", a: "No. Auryx provides full telemedicine consultations and ships directly to your door for eligible individuals across the United States. Our team is available to guide you through the process from start to finish." },
  { q: "How are protocols personalized?", a: "Each protocol recommendation starts with understanding your goals, lifestyle, and health history. A licensed Auryx physician reviews your profile before any protocol is dispensed. We don't believe in one-size-fits-all approaches." },
  { q: "What makes Auryx different from other wellness providers?", a: "Auryx is built on three principles: quality sourcing, education-first guidance, and a lifestyle-centered approach. We're not a supplement store or a research catalog. We're a precision wellness destination designed for people who take their long-term health seriously." },
  { q: "How much do protocols cost?", a: "Protocol pricing varies based on the compounds selected, duration, and individual needs. All pricing is discussed transparently during your consultation — no obligations, no surprises." },
  { q: "Does Auryx accept insurance?", a: "Auryx does not accept insurance. Our services are self-pay, designed to sit outside the limitations of conventional healthcare. We accept all major credit and debit cards." },
  { q: "Can I continue a protocol I started elsewhere?", a: "Yes. If you're already on an established protocol from another provider, our streamlined intake process can often get you set up within 24 hours — subject to physician review." },
];

/* ─── Page component ────────────────────────────────────────────────── */

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-background/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <MoleculeDockScene />
            </Suspense>
          </div>
        </motion.div>

        <div className="container relative z-20 px-6 md:px-16 mx-auto pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-primary" />
              <span className="text-primary tracking-[0.3em] text-xs font-medium uppercase">Precision Wellness</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-[1.08] mb-8 font-light">
              Precision wellness,<br />
              <em className="not-italic text-foreground/75">delivered with intention.</em>
            </h1>

            <p className="text-base md:text-lg text-foreground/60 max-w-xl mb-6 font-light leading-relaxed">
              AURYX offers education-first peptide protocols designed to support performance, recovery, vitality, skin health, and healthy aging. Built for people who want to feel sharper, move better, and age with strategy.
            </p>

            <p className="text-xs text-primary/60 tracking-wide mb-10 max-w-md leading-relaxed">
              No hype. No shortcuts. Just modern wellness, clear guidance, and a more intentional way to optimize.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary text-[#0A0A0A] font-semibold tracking-wide px-8 h-13 py-3.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Find Your Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollTo("focus")}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-foreground/70 hover:text-foreground hover:border-white/40 px-8 h-13 py-3.5 rounded-lg transition-colors text-sm tracking-wide"
              >
                Explore Protocols
              </button>
            </div>
          </motion.div>
        </div>

        <button
          onClick={() => scrollTo("focus")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </button>
      </section>

      {/* ── 2. FOCUS AREAS ── */}
      <section id="focus" className="py-24 md:py-32 px-6 md:px-16 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Protocol Collections</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground max-w-xl leading-tight">
              Choose your area of focus.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FOCUS_AREAS.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(area.slug)}`}
                  className="group block p-8 bg-card border border-border hover:border-primary/40 rounded-2xl transition-all duration-400 relative overflow-hidden h-full"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${area.accent}0d 0%, transparent 60%)` }}
                  />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-background/50 mb-5"
                      style={{ color: area.accent }}>
                      {area.icon}
                    </div>
                    <h3 className="text-lg font-serif text-foreground mb-3">{area.title}</h3>
                    <p className="text-sm text-foreground/55 leading-relaxed mb-5">{area.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary/60 group-hover:text-primary transition-colors font-medium tracking-wide uppercase">
                      View Protocols <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROTOCOL FINDER / CONCIERGE QUIZ ── */}
      <section id="finder" className="py-24 md:py-32 px-6 md:px-16 bg-card/40 border-y border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5">Protocol Finder</p>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
                Your protocol starts<br />with your rhythm.
              </h2>
              <p className="text-foreground/55 leading-relaxed text-base mb-8 max-w-md">
                Answer a few questions about your goals, lifestyle, and current routine. We'll guide you toward the AURYX protocol category that best matches your priorities.
              </p>
              <div className="space-y-3.5">
                {["Goals-aligned, not generic", "Built around your lifestyle", "Education included, always"].map(pt => (
                  <div key={pt} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground/65">{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <PatientAssessment onOpenConsult={() => setModalOpen(true)} onContinueProtocol={() => setContinuationOpen(true)} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. THE AURYX STANDARD ── */}
      <section id="standard" className="py-24 md:py-32 px-6 md:px-16 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our Commitment</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">The AURYX Standard</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STANDARD_PILLARS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-end gap-3">
                  <span className="font-serif text-4xl text-primary/20 leading-none">{p.num}</span>
                  <div className="h-px flex-1 bg-border/60 mb-1.5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-3">{p.title}</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LIFESTYLE SECTION ── */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-16 overflow-hidden bg-card/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[480px] md:h-[560px] rounded-2xl overflow-hidden order-2 lg:order-1"
              style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #141414 40%, #0A1A19 100%)" }}
            >
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(184,150,46,0.18) 0%, transparent 55%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 20% 70%, rgba(13,148,136,0.12) 0%, transparent 50%)" }} />
              {/* Abstract lifestyle composition */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-10">
                  <p className="font-serif text-3xl md:text-4xl text-white/20 leading-snug italic">
                    "The ultimate luxury is<br />the mastery over one's own<br />physical and cognitive capacity."
                  </p>
                </div>
              </div>
              {/* Decorative particles */}
              {[
                { top: "15%", left: "10%", size: 6, opacity: 0.3 },
                { top: "25%", right: "15%", size: 4, opacity: 0.2 },
                { bottom: "20%", left: "20%", size: 3, opacity: 0.15 },
                { bottom: "30%", right: "10%", size: 5, opacity: 0.25 },
                { top: "60%", left: "5%", size: 2, opacity: 0.2 },
              ].map((dot, i) => (
                <div key={i} className="absolute rounded-full bg-[#C9A844]"
                  style={{ width: dot.size, height: dot.size, opacity: dot.opacity, ...dot }} />
              ))}
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5">Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
                Optimization is not<br />a shortcut.{" "}
                <span className="text-foreground/40">It is a standard.</span>
              </h2>
              <div className="space-y-5 text-foreground/55 leading-relaxed text-base mb-10">
                <p>
                  Peptides are only one part of the equation. The AURYX philosophy connects modern wellness with daily rhythm: training, sleep, nutrition, recovery, and consistency.
                </p>
                <p>
                  We believe in understanding your biology before acting on it. That means education, honest guidance, and protocols designed for long-term benefit — not quick transformations.
                </p>
                <p>
                  Most medicine is designed to keep you from declining. AURYX is designed to help you thrive.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all group"
              >
                Book a private consultation <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. PRODUCT PREVIEW ── */}
      <section id="protocols" className="py-24 md:py-32 px-6 md:px-16 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Featured Protocols</p>
              <h2 className="text-4xl md:text-5xl font-serif max-w-md leading-tight">
                Explore the protocol collections.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors font-medium shrink-0"
            >
              View all protocols <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_PROTOCOLS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/shop/${p.slug}`}
                  className="group block bg-card border border-border hover:border-primary/35 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Product visual */}
                  <div className="h-36 relative flex items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #EDE6D3 100%)" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,68,0.2) 0%, transparent 65%)" }} />
                    <svg width="52" height="78" viewBox="0 0 52 78" fill="none" className="drop-shadow-sm group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500">
                      <rect x="19" y="2" width="14" height="8" rx="3" fill="#C9A844" opacity="0.8" />
                      <rect x="16" y="9" width="20" height="4" rx="1" fill="#C9A844" opacity="0.5" />
                      <rect x="12" y="12" width="28" height="56" rx="6" fill="white" opacity="0.92" stroke="#C9A844" strokeWidth="1" strokeOpacity="0.3" />
                      <rect x="16" y="17" width="20" height="28" rx="3" fill="#C9A844" opacity="0.07" />
                      <rect x="14" y="16" width="8" height="50" rx="3" fill="white" opacity="0.5" />
                      <text x="26" y="49" textAnchor="middle" fontSize="4.5" fill="#C9A844" opacity="0.8" fontFamily="Georgia, serif" letterSpacing="1">AURYX</text>
                    </svg>
                  </div>
                  <div className="p-5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-medium">{p.category}</span>
                    <h3 className="font-serif text-foreground text-base mt-1 mb-2">{p.name}</h3>
                    <p className="text-xs text-foreground/45 leading-relaxed mb-4">{p.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary/60 group-hover:text-primary transition-colors font-medium tracking-widest uppercase">
                      Explore protocol <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. EDUCATION ── */}
      <section id="education" className="py-24 md:py-32 px-6 md:px-16 bg-card/30 border-y border-border/40">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Resources</p>
            <h2 className="text-4xl md:text-5xl font-serif max-w-md leading-tight">
              Learn before you optimize.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EDUCATION_ARTICLES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group border border-border hover:border-primary/30 rounded-2xl p-7 bg-card/50 hover:bg-card transition-all duration-300 cursor-pointer"
              >
                <span className="font-serif text-4xl text-primary/15 leading-none block mb-5">{a.num}</span>
                <h3 className="font-serif text-foreground text-base mb-3 leading-snug">{a.title}</h3>
                <p className="text-xs text-foreground/45 leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. METHODOLOGY ── */}
      <section id="process" className="py-24 md:py-32 px-6 md:px-16 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                The Auryx<br />Methodology
              </h2>
              <p className="text-foreground/50 leading-relaxed max-w-sm mb-8">
                We do not guess. We listen, educate, and build a protocol designed around who you are and where you want to go.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
              >
                Begin your consultation <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="space-y-10 relative">
              <div className="absolute left-7 top-8 bottom-8 w-px bg-border/50 hidden md:block" />
              {[
                { step: "01", title: "Find Your Focus", body: "Start by exploring our protocol categories or take the Protocol Finder quiz. New to peptides? We'll explain every step before anything else." },
                { step: "02", title: "Physician Review", body: "A licensed Auryx physician reviews your intake and health history before any protocol is dispensed. Your safety and suitability come first." },
                { step: "03", title: "Precision Dispensing", body: "Your protocol is compounded at a US-licensed pharmacy, third-party tested, and shipped directly to your door in discreet packaging." },
                { step: "04", title: "Ongoing Support", body: "Aria, our AI wellness concierge, is available around the clock. Protocol adjustments, questions, and continuity — we're with you throughout." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-7 relative z-10"
                >
                  <div className="w-14 h-14 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shrink-0 font-serif text-sm text-primary font-semibold">
                    {s.step}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-serif text-xl text-foreground mb-2">{s.title}</h4>
                    <p className="text-sm text-foreground/50 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section id="faq" className="py-24 md:py-32 px-6 md:px-16 bg-card/30 border-t border-border/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Common Questions</p>
            <h2 className="text-4xl md:text-5xl font-serif">Questions & Answers</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-xl px-6 bg-card/40">
                <AccordionTrigger className="text-base font-serif text-foreground/90 py-5 hover:text-primary transition-colors text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/55 leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section className="py-32 md:py-40 px-6 md:px-16 bg-background text-center">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-16 bg-primary/40 mx-auto mb-10" />
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Start Here</p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
              Build your protocol<br />
              <span className="text-foreground/40">with intention.</span>
            </h2>
            <p className="text-foreground/45 text-base leading-relaxed max-w-xl mx-auto mb-12">
              Start with your goals. Understand your options. Choose a more elevated path to modern wellness.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-[#0A0A0A] font-semibold tracking-wide px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Find Your Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 border border-border text-foreground/60 hover:text-foreground hover:border-border/80 px-8 py-3.5 rounded-lg transition-colors text-sm tracking-wide"
              >
                Book a Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
      <ProtocolContinuationModal open={continuationOpen} onOpenChange={setContinuationOpen} />
    </div>
  );
}
