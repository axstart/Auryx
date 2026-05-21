import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, lazy } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
const MoleculeDockScene = lazy(() => import("@/components/MoleculeDockScene"));
import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";

/* ─── Collections ─────────────────────────────────────────────────── */
const COLLECTIONS = [
  {
    title: "Metabolic Support",
    tag: "Body Composition",
    desc: "Protocols designed to support healthy metabolic function, appetite regulation, and body composition as part of a broader lifestyle strategy.",
    accent: "#C9A844",
  },
  {
    title: "Recovery & Resilience",
    tag: "Tissue & Repair",
    desc: "Support your body's natural repair processes, reduce downtime, and build the resilience that lets you train, work, and live harder.",
    accent: "#0D9488",
  },
  {
    title: "Skin & Healthy Aging",
    tag: "Longevity & Aesthetics",
    desc: "Support collagen synthesis, skin elasticity, and the cellular renewal that shows up in how you look and feel over time.",
    accent: "#C9A844",
  },
  {
    title: "Energy & Vitality",
    tag: "Cellular Performance",
    desc: "Support the mitochondrial and hormonal systems that drive how you feel every day — energy, drive, and sustained output.",
    accent: "#0D9488",
  },
  {
    title: "Cognitive Performance",
    tag: "Focus & Clarity",
    desc: "Support focus, memory, and mental resilience with protocols built for high-demand lifestyles that require sustained cognitive output.",
    accent: "#C9A844",
  },
  {
    title: "Sleep & Restoration",
    tag: "Recovery & Rhythm",
    desc: "Support the deep, restorative sleep and circadian rhythms that are central to every dimension of long-term health.",
    accent: "#0D9488",
  },
];

/* ─── Collections (product cards) ─────────────────────────────────── */
const PROTOCOL_CARDS = [
  {
    name: "CJC-1295 + Ipamorelin",
    collection: "Sleep & Restoration",
    desc: "Support growth hormone optimization and deep sleep architecture as part of an intentional recovery and longevity rhythm.",
    slug: "cjc-ipamorelin",
  },
  {
    name: "BPC-157",
    collection: "Recovery & Resilience",
    desc: "Support tissue repair and gut health with one of the most studied recovery-focused peptide protocols available.",
    slug: "bpc-157",
  },
  {
    name: "Semax",
    collection: "Cognitive Performance",
    desc: "Support focus, memory, and neuroprotection as part of a performance lifestyle that demands mental clarity.",
    slug: "semax",
  },
  {
    name: "GLOW Complex",
    collection: "Skin & Healthy Aging",
    desc: "An AURYX-curated formulation designed to support skin elasticity, collagen synthesis, and connective tissue over time.",
    slug: "glow-complex",
  },
];

/* ─── Standard pillars ──────────────────────────────────────────────── */
const PILLARS = [
  { num: "01", title: "Quality-vetted sourcing", desc: "US-licensed compounding pharmacies only. Third-party tested, pharmaceutical-grade — nothing less, always." },
  { num: "02", title: "Education before action", desc: "We believe clarity is the foundation of trust. Understand what you're considering before you begin." },
  { num: "03", title: "Lifestyle-first thinking", desc: "Peptides are one layer. We connect them to sleep, training, nutrition, and recovery — the full picture." },
  { num: "04", title: "Discreet, elevated experience", desc: "From consultation to doorstep, the AURYX experience is seamless, private, and intentionally premium." },
];

/* ─── Education ─────────────────────────────────────────────────────── */
const ARTICLES = [
  { num: "01", title: "What are peptide protocols?", desc: "An accessible introduction to what peptides are, how they work, and what makes them different from conventional supplements." },
  { num: "02", title: "How recovery shapes long-term performance", desc: "Why the recovery phase matters more than most people realise — and how supporting it changes your baseline over time." },
  { num: "03", title: "Why healthy aging starts with rhythm", desc: "The science connecting circadian biology, sleep quality, and daily lifestyle patterns to how we age at a cellular level." },
  { num: "04", title: "The difference between support and shortcuts", desc: "Why the AURYX approach is built around sustainable optimization, not quick fixes — and how that shapes every protocol we offer." },
];

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">

      {/* ━━ 1. HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-background/55 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <MoleculeDockScene />
            </Suspense>
          </div>
        </motion.div>

        <div className="container relative z-20 px-6 md:px-16 lg:px-24 mx-auto pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-10 bg-primary/70" />
              <span className="text-primary/80 tracking-[0.35em] text-[11px] font-medium uppercase">Precision Wellness</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.06] mb-9 font-light tracking-tight">
              Precision wellness,<br />
              <span className="text-foreground/45">delivered with</span><br />
              intention.
            </h1>

            <p className="text-base md:text-lg text-foreground/55 max-w-lg mb-5 font-light leading-[1.75]">
              AURYX offers education-first peptide protocols designed to support performance, recovery, vitality, skin health, and healthy aging.
            </p>

            <p className="text-xs text-primary/50 tracking-[0.05em] mb-12 max-w-md leading-relaxed">
              No hype. No shortcuts. Just modern wellness, clear guidance, and a more intentional way to optimize.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center gap-2.5 bg-primary text-[#0A0A0A] font-semibold tracking-wide px-9 py-4 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Find Your Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 border border-white/15 text-foreground/55 hover:text-foreground hover:border-white/30 px-9 py-4 rounded-xl transition-colors text-sm tracking-wide"
              >
                Explore Collections
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll nudge */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/20"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-10 bg-white/15" />
        </motion.div>
      </section>

      {/* ━━ 2. PROTOCOL COLLECTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Warm ivory section */}
      <section id="collections" className="py-28 md:py-40 px-6 md:px-16 lg:px-24" style={{ backgroundColor: "#F7F4EF", color: "#1a1a1a" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8962E] mb-5">Protocol Collections</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#111] max-w-xl">
              Choose your<br />area of focus.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {COLLECTIONS.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href="/shop"
                  className="group block p-8 md:p-10 border rounded-2xl transition-all duration-500 h-full"
                  style={{
                    borderColor: "rgba(26,26,26,0.1)",
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: c.accent }}>
                      {c.tag}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.accent }} />
                  </div>
                  <h3 className="font-serif text-xl text-[#111] mb-3">{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.5)" }}>{c.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 3. PROTOCOL FINDER (TEASER) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="finder" className="py-28 md:py-40 px-6 md:px-16 lg:px-24 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: editorial visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1"
              style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #141414 50%, #0A1A19 100%)" }}
            >
              {/* Radial glow layers */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 55% at 65% 35%, rgba(201,168,68,0.16) 0%, transparent 60%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 45% at 25% 70%, rgba(13,148,136,0.1) 0%, transparent 55%)" }} />
              {/* Decorative gold line */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 h-px w-16 bg-primary/30" />
              <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col justify-center gap-2 pl-20">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/50">Protocol Finder</p>
                <p className="font-serif text-2xl text-white/25 max-w-[200px] leading-snug">
                  Your rhythm.<br />Your protocol.
                </p>
              </div>
              {/* Gold particles */}
              {[
                { t: "18%", l: "75%", s: 5 }, { t: "55%", l: "80%", s: 3 },
                { t: "75%", l: "60%", s: 4 }, { t: "30%", l: "50%", s: 2 },
              ].map((d, i) => (
                <div key={i} className="absolute rounded-full bg-primary/30"
                  style={{ top: d.t, left: d.l, width: d.s, height: d.s }} />
              ))}
            </motion.div>

            {/* Right: text */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="order-1 lg:order-2"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-primary mb-6">Concierge Intake</p>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
                Your protocol starts<br />
                <span className="text-foreground/35">with your rhythm.</span>
              </h2>
              <p className="text-foreground/50 leading-relaxed text-base mb-10 max-w-md">
                Answer a few questions about your goals, lifestyle, and current routine. We'll guide you toward the AURYX protocol category that best matches your priorities — no pressure, no obligation.
              </p>
              <div className="space-y-3.5 mb-12">
                {[
                  "Goals-aligned, not generic",
                  "Education included at every step",
                  "No obligation to purchase",
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                    <span className="text-sm text-foreground/55">{pt}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/protocol-finder"
                className="inline-flex items-center gap-2.5 bg-primary text-[#0A0A0A] font-semibold tracking-wide px-9 py-4 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Start the Protocol Finder <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━ 4. THE AURYX STANDARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="standard" style={{ backgroundColor: "#F7F4EF", color: "#1a1a1a" }}
        className="py-28 md:py-40 px-6 md:px-16 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 md:mb-24"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8962E] mb-5">Our Commitment</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#111]">The AURYX Standard</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {PILLARS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-end gap-3 mb-7">
                  <span className="font-serif text-5xl leading-none" style={{ color: "rgba(184,150,46,0.18)" }}>{p.num}</span>
                  <div className="h-px flex-1 mb-2" style={{ backgroundColor: "rgba(26,26,26,0.12)" }} />
                </div>
                <h3 className="font-serif text-xl text-[#111] mb-4">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.5)" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 5. LIFESTYLE PHILOSOPHY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="philosophy" className="py-28 md:py-40 px-6 md:px-16 lg:px-24 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-primary mb-6">Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-10">
                Optimization is not a shortcut.{" "}
                <span className="text-foreground/30">It is a standard.</span>
              </h2>
              <div className="space-y-6 text-foreground/50 leading-[1.85] text-base mb-12 max-w-lg">
                <p>
                  Peptides are only one part of the equation. The AURYX philosophy connects modern wellness with daily rhythm: training, sleep, nutrition, recovery, and consistency.
                </p>
                <p>
                  We believe in understanding your biology before acting on it — education first, protocols second. Everything we offer is designed for long-term benefit, not short-term transformation.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-primary/70 hover:text-primary font-medium transition-colors group"
              >
                Book a private consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative h-[480px] md:h-[580px] rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(145deg, #0C0C0C 0%, #131313 45%, #081815 100%)" }}
            >
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 65% at 55% 40%, rgba(201,168,68,0.14) 0%, transparent 55%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 15% 75%, rgba(13,148,136,0.09) 0%, transparent 50%)" }} />

              {/* Quote */}
              <div className="absolute inset-0 flex items-end p-10">
                <div>
                  <div className="w-10 h-px bg-primary/30 mb-6" />
                  <p className="font-serif text-xl md:text-2xl text-white/25 leading-[1.5] max-w-sm italic">
                    "The ultimate luxury is the mastery over one's own physical and cognitive capacity."
                  </p>
                </div>
              </div>

              {/* Ambient particles */}
              {[
                { top: "12%", right: "18%", s: 6 },
                { top: "35%", right: "8%", s: 3 },
                { top: "60%", right: "22%", s: 4 },
                { top: "20%", right: "40%", s: 2 },
              ].map((d, i) => (
                <div key={i} className="absolute rounded-full bg-primary/25"
                  style={{ top: d.top, right: d.right, width: d.s, height: d.s }} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━ 6. PROTOCOL CARDS (editorial) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="protocols" className="py-28 md:py-40 px-6 md:px-16 lg:px-24" style={{ backgroundColor: "#F7F4EF", color: "#1a1a1a" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8962E] mb-5">Selected Protocols</p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#111] max-w-sm leading-tight">
                Explore the AURYX Collections
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[#B8962E] hover:text-[#C9A844] transition-colors shrink-0">
              View all protocols <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROTOCOL_CARDS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/shop/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                  style={{ borderColor: "rgba(26,26,26,0.1)", backgroundColor: "rgba(255,255,255,0.65)" }}
                >
                  {/* Vial visual */}
                  <div className="h-40 flex items-center justify-center relative overflow-hidden"
                    style={{ background: "linear-gradient(150deg, #EDE8E0 0%, #E6DFD2 100%)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,68,0.18) 0%, transparent 65%)" }} />
                    <svg width="44" height="66" viewBox="0 0 44 66" fill="none"
                      className="group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-500 drop-shadow-sm">
                      <rect x="15" y="1" width="14" height="7" rx="3" fill="#C9A844" opacity="0.7" />
                      <rect x="13" y="7" width="18" height="4" rx="1" fill="#C9A844" opacity="0.4" />
                      <rect x="9" y="10" width="26" height="52" rx="6" fill="white" opacity="0.88" stroke="#C9A844" strokeWidth="0.75" strokeOpacity="0.25" />
                      <rect x="11" y="14" width="6" height="44" rx="3" fill="white" opacity="0.45" />
                      <text x="22" y="43" textAnchor="middle" fontSize="4" fill="#C9A844" opacity="0.6"
                        fontFamily="Georgia,serif" letterSpacing="1.2">AURYX</text>
                    </svg>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#B8962E] mb-1.5">
                      {p.collection}
                    </span>
                    <h3 className="font-serif text-[#111] text-base mb-2.5">{p.name}</h3>
                    <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: "rgba(26,26,26,0.48)" }}>
                      {p.desc}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-[#B8962E] group-hover:text-[#C9A844] transition-colors font-medium tracking-widest uppercase">
                      Learn more <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 7. EDUCATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="education" className="py-28 md:py-40 px-6 md:px-16 lg:px-24 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-primary mb-5">Resources</p>
            <h2 className="text-4xl md:text-5xl font-serif max-w-md leading-tight">
              Learn before<br />you optimize.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ARTICLES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group border border-border/50 hover:border-primary/25 rounded-2xl p-8 bg-card/30 hover:bg-card/60 transition-all duration-300 cursor-pointer"
              >
                <span className="font-serif text-5xl text-primary/12 leading-none block mb-7">{a.num}</span>
                <h3 className="font-serif text-foreground text-base mb-3 leading-snug">{a.title}</h3>
                <p className="text-xs text-foreground/40 leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 8. FINAL CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-36 md:py-48 px-6 md:px-16 bg-background text-center">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-12 bg-primary/30 mx-auto mb-12" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-primary mb-6">Start Here</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.06] mb-8 font-light">
              Build your protocol<br />
              <span className="text-foreground/30">with intention.</span>
            </h2>
            <p className="text-foreground/40 text-base leading-relaxed max-w-md mx-auto mb-14">
              Start with your goals. Understand your options. Choose a more elevated path to modern wellness.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center gap-2.5 bg-primary text-[#0A0A0A] font-semibold tracking-wide px-10 py-4 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Find Your Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2.5 border border-border/50 text-foreground/50 hover:text-foreground hover:border-border transition-colors px-10 py-4 rounded-xl text-sm tracking-wide"
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
