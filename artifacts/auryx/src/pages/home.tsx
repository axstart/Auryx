import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
import { ArrowRight, CheckCircle } from "lucide-react";

/* ─── Gold SVG Icons ───────────────────────────────────────────────── */
const IconMetabolic = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="3.5" stroke="#C9A844" strokeWidth="1.5"/>
    <circle cx="6" cy="10" r="2.5" stroke="#C9A844" strokeWidth="1.5"/>
    <circle cx="26" cy="10" r="2.5" stroke="#C9A844" strokeWidth="1.5"/>
    <circle cx="6" cy="22" r="2.5" stroke="#C9A844" strokeWidth="1.5"/>
    <circle cx="26" cy="22" r="2.5" stroke="#C9A844" strokeWidth="1.5"/>
    <line x1="12.5" y1="14.2" x2="8.3" y2="11.5" stroke="#C9A844" strokeWidth="1.2"/>
    <line x1="19.5" y1="14.2" x2="23.7" y2="11.5" stroke="#C9A844" strokeWidth="1.2"/>
    <line x1="12.5" y1="17.8" x2="8.3" y2="20.5" stroke="#C9A844" strokeWidth="1.2"/>
    <line x1="19.5" y1="17.8" x2="23.7" y2="20.5" stroke="#C9A844" strokeWidth="1.2"/>
  </svg>
);

const IconRecovery = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L26 8.5 V16.5 C26 21.5 21.5 26 16 28 C10.5 26 6 21.5 6 16.5 V8.5 Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <line x1="16" y1="11" x2="16" y2="21" stroke="#C9A844" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11" y1="16" x2="21" y2="16" stroke="#C9A844" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSkin = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 5 C16 5 22 11 22 18 C22 21.3 19.3 24 16 24 C12.7 24 10 21.3 10 18 C10 11 16 5 16 5Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <path d="M16 17 C16 17 14 15 14 13" stroke="#C9A844" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const IconEnergy = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M18 4 L10 18 H16 L14 28 L24 14 H18 Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const IconCognitive = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M11 8 C8 8 6 10.5 6 13 C6 14.8 7 16.3 8.5 17.1 C8.2 17.7 8 18.3 8 19 C8 21.2 9.8 23 12 23 L12 24 C12 25.1 12.9 26 14 26 H18 C19.1 26 20 25.1 20 24 L20 23 C22.2 23 24 21.2 24 19 C24 18.3 23.8 17.7 23.5 17.1 C25 16.3 26 14.8 26 13 C26 10.5 24 8 21 8 C20.1 8 19.2 8.3 18.5 8.8 C17.7 8.3 16.9 8 16 8 C15.1 8 14.3 8.3 13.5 8.8 C12.8 8.3 11.9 8 11 8Z" stroke="#C9A844" strokeWidth="1.4" fill="none"/>
    <line x1="16" y1="13" x2="16" y2="20" stroke="#C9A844" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const IconSleep = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M20 7 C17 7 14.4 8.7 13 11.2 C12.1 10.9 11.1 10.7 10 10.7 C6.7 10.7 4 13.4 4 16.7 C4 20 6.7 22.7 10 22.7 H22 C25.3 22.7 28 20 28 16.7 C28 13.6 25.7 11.1 22.6 10.8 C22.4 8.7 21.4 7 20 7Z" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round" opacity="0.4"/>
    <path d="M20 6 C16.5 6 13.7 8.4 12.8 11.6 C14.1 11.2 15.5 11 17 11 C22 11 26.2 14.4 27.2 19 C28.8 17.9 30 16 30 13.9 C30 10.1 26.4 7 22 7 C21.3 7 20.6 7.1 20 7.2" stroke="#C9A844" strokeWidth="0" fill="none"/>
    <path d="M17 5 C14 8 14 12 17 15 C14 15 10 13 10 9.5 C10 6.5 13 4 17 5Z" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <circle cx="22" cy="8" r="1.5" fill="#C9A844" opacity="0.7"/>
    <circle cx="26" cy="12" r="1" fill="#C9A844" opacity="0.5"/>
    <circle cx="24" cy="5" r="1" fill="#C9A844" opacity="0.4"/>
  </svg>
);

/* Gold icons for standard pillars */
const IconFlask = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M10 4 L10 14 L4 22 C3 23.5 4 26 6 26 H22 C24 26 25 23.5 24 22 L18 14 L18 4" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <line x1="8" y1="4" x2="20" y2="4" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="11" cy="20" r="1.5" fill="#C9A844" opacity="0.6"/>
    <circle cx="16" cy="22" r="1" fill="#C9A844" opacity="0.4"/>
  </svg>
);

const IconShieldCheck = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 3 L24 7 V14 C24 19.5 19.5 24.5 14 26 C8.5 24.5 4 19.5 4 14 V7 Z" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <path d="M9.5 14 L12.5 17 L18.5 11" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="#C9A844" strokeWidth="1.4"/>
    <circle cx="14" cy="14" r="6" stroke="#C9A844" strokeWidth="1.2"/>
    <circle cx="14" cy="14" r="2.5" fill="#C9A844"/>
    <line x1="14" y1="4" x2="14" y2="8" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="14" y1="20" x2="14" y2="24" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="4" y1="14" x2="8" y2="14" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="20" y1="14" x2="24" y2="14" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconPerson = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="4" stroke="#C9A844" strokeWidth="1.4" fill="none"/>
    <path d="M5 24 C5 19.6 9 16 14 16 C19 16 23 19.6 23 24" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── Gold orbital SVG for hero right panel ─────────────────────────── */
const HeroOrbital = () => (
  <svg className="w-full h-full" viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="heroGlow" cx="60%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#C9A844" stopOpacity="0.18"/>
        <stop offset="60%" stopColor="#C9A844" stopOpacity="0.04"/>
        <stop offset="100%" stopColor="#C9A844" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="280" cy="280" rx="210" ry="210" stroke="#C9A844" strokeWidth="0.6" strokeOpacity="0.18"/>
    <ellipse cx="280" cy="280" rx="150" ry="150" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.15"/>
    <ellipse cx="280" cy="280" rx="90" ry="90" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.12"/>
    <ellipse cx="280" cy="270" rx="245" ry="180" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.1" transform="rotate(-20 280 270)"/>
    <circle cx="280" cy="70" r="4" fill="#C9A844" fillOpacity="0.7"/>
    <circle cx="490" cy="220" r="3.5" fill="#C9A844" fillOpacity="0.55"/>
    <circle cx="440" cy="450" r="3" fill="#C9A844" fillOpacity="0.5"/>
    <circle cx="130" cy="390" r="2.5" fill="#C9A844" fillOpacity="0.45"/>
    <circle cx="80" cy="160" r="2" fill="#C9A844" fillOpacity="0.4"/>
    <circle cx="380" cy="140" r="2" fill="#C9A844" fillOpacity="0.35"/>
    <circle cx="350" cy="480" r="1.5" fill="#C9A844" fillOpacity="0.4"/>
    <circle cx="165" cy="70" r="1.5" fill="#C9A844" fillOpacity="0.35"/>
    <circle cx="200" cy="520" r="2" fill="#C9A844" fillOpacity="0.3"/>
    <circle cx="460" cy="330" r="1.5" fill="#C9A844" fillOpacity="0.35"/>
    <circle cx="70" cy="300" r="1" fill="#C9A844" fillOpacity="0.3"/>
    <circle cx="320" cy="30" r="1" fill="#C9A844" fillOpacity="0.3"/>
    <ellipse cx="280" cy="280" rx="245" ry="245" fill="url(#heroGlow)"/>
    {/* Figure silhouette suggestion */}
    <ellipse cx="280" cy="300" rx="60" ry="120" fill="#C9A844" fillOpacity="0.025"/>
  </svg>
);

/* ─── Gold wave background for dark sections ────────────────────────── */
const GoldWave = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute bottom-0 right-0 w-full h-full opacity-30" viewBox="0 0 800 500" preserveAspectRatio="xMaxYMax slice" fill="none">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A844" stopOpacity="0"/>
          <stop offset="50%" stopColor="#C9A844" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#C9A844" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <path d="M600 500 Q550 350 650 250 Q720 170 750 50 Q770 0 800 0 L800 500Z" fill="url(#waveGrad)" opacity="0.4"/>
      <path d="M650 500 Q580 380 700 270 Q760 200 780 80 Q790 30 800 0 L800 500Z" fill="url(#waveGrad)" opacity="0.25"/>
      <path d="M500 500 Q480 400 560 310 Q630 230 700 100 Q740 40 780 10 L800 0 L800 500Z" fill="#C9A844" fillOpacity="0.04"/>
      {[
        [640, 450], [700, 380], [740, 300], [760, 220], [775, 150], [785, 80],
        [660, 420], [710, 350], [745, 270], [765, 190], [778, 110],
        [680, 460], [720, 390], [755, 310], [770, 240], [782, 160],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.5} fill="#C9A844" opacity={0.3 + (i % 4) * 0.1}/>
      ))}
    </svg>
  </div>
);

/* ─── Vial SVG ──────────────────────────────────────────────────────── */
function VialSVG({ name, tag }: { name: string; tag: string }) {
  return (
    <svg viewBox="0 0 110 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto mx-auto">
      <defs>
        <linearGradient id={`cap-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A843"/>
          <stop offset="50%" stopColor="#E8C460"/>
          <stop offset="100%" stopColor="#A8832A"/>
        </linearGradient>
        <linearGradient id={`glass-${name}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="20%" stopColor="rgba(255,255,255,0.85)"/>
          <stop offset="80%" stopColor="rgba(255,255,255,0.82)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)"/>
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="38" y="6" width="34" height="18" rx="4" fill={`url(#cap-${name})`}/>
      <rect x="34" y="21" width="42" height="6" rx="2" fill={`url(#cap-${name})`} opacity="0.8"/>
      {/* Glass body */}
      <rect x="26" y="26" width="58" height="120" rx="12" fill={`url(#glass-${name})`} stroke="rgba(201,168,68,0.2)" strokeWidth="1"/>
      {/* Highlight */}
      <rect x="30" y="30" width="14" height="112" rx="7" fill="white" opacity="0.45"/>
      {/* Label */}
      <rect x="29" y="42" width="52" height="78" rx="5" fill="white" opacity="0.97"/>
      <text x="55" y="63" textAnchor="middle" fontSize="7.5" fill="#C9A844" fontFamily="Georgia,serif" letterSpacing="3" fontWeight="400">AURYX</text>
      <line x1="35" y1="68" x2="75" y2="68" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.4"/>
      <text x="55" y="84" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontFamily="Georgia,serif" letterSpacing="0.5" fontWeight="400">{name.split(" ")[0]}</text>
      {name.split(" ").length > 1 && (
        <text x="55" y="95" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontFamily="Georgia,serif" letterSpacing="0.5" fontWeight="400">{name.split(" ").slice(1).join(" ")}</text>
      )}
      <line x1="35" y1="102" x2="75" y2="102" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.3"/>
      <text x="55" y="114" textAnchor="middle" fontSize="5.5" fill="#C9A844" letterSpacing="2" fontFamily="Arial,sans-serif">PEPTIDE</text>
      {/* Bottom of glass */}
      <rect x="26" y="138" width="58" height="8" rx="0" fill="white" opacity="0.15"/>
    </svg>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const COLLECTIONS = [
  { icon: <IconMetabolic/>, title: "Metabolic Support", desc: "Support healthy metabolism and body composition." },
  { icon: <IconRecovery/>, title: "Recovery & Resilience", desc: "Optimize recovery and build stress resilience." },
  { icon: <IconSkin/>, title: "Skin & Healthy Aging", desc: "Support skin health and healthy aging at the cellular level." },
  { icon: <IconEnergy/>, title: "Energy & Vitality", desc: "Sustain energy and daily mind-body vitality." },
  { icon: <IconCognitive/>, title: "Cognitive Performance", desc: "Support focus, memory, and mental performance." },
  { icon: <IconSleep/>, title: "Sleep & Restoration", desc: "Deeper sleep and daily restorative support." },
];

const PEPTIDES = [
  { name: "CJC-1295 NO DAC", desc: "Growth hormone support peptide.", tag: "RECOVERY", slug: "cjc-ipamorelin" },
  { name: "BPC-157", desc: "Supports recovery and tissue health.", tag: "RECOVERY", slug: "bpc-157" },
  { name: "TB-500", desc: "Supports mobility and tissue recovery.", tag: "MOBILITY", slug: "tb-500" },
  { name: "NAD+", desc: "Supports cellular energy and longevity.", tag: "ENERGY", slug: "nad-plus" },
];

const STANDARD = [
  { icon: <IconFlask/>, title: "Science-Backed", desc: "Formulations rooted in research and data." },
  { icon: <IconShieldCheck/>, title: "Purity & Quality", desc: "Third-party tested. Made in the USA." },
  { icon: <IconTarget/>, title: "Purpose-Driven", desc: "Every protocol is built with intention." },
  { icon: <IconPerson/>, title: "Concierge Guidance", desc: "Personal support at every step." },
];

const TESTIMONIALS = [
  { quote: "I feel more focused, sleep better, and recover faster.", name: "Jason R.", label: "Verified Customer" },
  { quote: "My energy and clarity have never been better.", name: "Sophia L.", label: "Verified Customer" },
  { quote: "Clean, effective, and tailored. AURYX fits seamlessly into my life.", name: "Michael B.", label: "Verified Customer" },
];

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ═══ 1. HERO ════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        {/* Right atmospheric visual */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 hidden md:block">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 60% 45%, rgba(201,168,68,0.12) 0%, transparent 65%)" }}/>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 65% 55%, rgba(201,168,68,0.07) 0%, transparent 55%)" }}/>
          <HeroOrbital/>
        </div>
        {/* Left gradient mask */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to right, #0A0A0A 55%, rgba(10,10,10,0.6) 75%, rgba(10,10,10,0.2) 100%)" }}/>

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-xl"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-7">Precision Peptides</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-7 font-light">
              Precision wellness,{" "}
              delivered with{" "}
              <em className="not-italic text-[#C9A844]">intention.</em>
            </h1>
            <p className="text-white/55 text-base md:text-lg leading-relaxed mb-12 max-w-md">
              Evidence-informed peptides and protocols for longevity, performance, and everyday vitality.
            </p>
            <div className="flex flex-col gap-3 max-w-xs">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.12em] text-xs uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 border border-white/25 text-white/70 font-medium tracking-[0.12em] text-xs uppercase px-8 py-4 rounded-lg hover:border-white/50 hover:text-white transition-colors"
              >
                Explore Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. PROTOCOL COLLECTIONS ════════════════════════════════════ */}
      <section id="collections" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        {/* Orbital decoration top right */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-40">
          <svg viewBox="0 0 256 256" fill="none">
            <circle cx="200" cy="56" r="90" stroke="#C9A844" strokeWidth="0.8" strokeOpacity="0.4"/>
            <circle cx="200" cy="56" r="55" stroke="#C9A844" strokeWidth="0.6" strokeOpacity="0.3"/>
            <circle cx="200" cy="56" r="25" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.25"/>
            <circle cx="200" cy="-34" r="3.5" fill="#C9A844" fillOpacity="0.7"/>
            <circle cx="290" cy="70" r="3" fill="#C9A844" fillOpacity="0.6"/>
            <circle cx="255" cy="145" r="2" fill="#C9A844" fillOpacity="0.45"/>
            <circle cx="110" cy="80" r="2" fill="#C9A844" fillOpacity="0.4"/>
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-14"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-5">Protocol Collections</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight max-w-2xl">
              Targeted support for{" "}
              <em className="not-italic text-[#C9A844]">every dimension</em>{" "}
              of you.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLLECTIONS.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href="/shop"
                  className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/8 hover:border-[#C9A844]/35 transition-all duration-300 h-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <div className="text-[#C9A844]">{c.icon}</div>
                  <div>
                    <h3 className="font-serif text-xl text-white mb-2">{c.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="text-[#C9A844] text-lg group-hover:translate-x-1 inline-block transition-transform">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. CONCIERGE PROTOCOL FINDER ══════════════════════════════ */}
      <section id="finder" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <GoldWave/>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-6">Concierge Protocol Finder</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-12">
              Your path is personal.{" "}
              <br className="hidden md:block"/>
              Let's find what{" "}
              <em className="not-italic text-[#C9A844]">fits.</em>
            </h2>

            {/* 4 mini question cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {[
                { q: "What is your primary goal?", icon: "◎" },
                { q: "How would you rate your energy?", icon: "⚡" },
                { q: "How is your sleep quality?", icon: "☽" },
                { q: "What's your experience level?", icon: "▪" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-white/10 hover:border-[#C9A844]/30 transition-colors cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-[#C9A844] text-xl opacity-70">{item.icon}</span>
                  <div className="h-px w-8 bg-[#C9A844]/30" />
                  <p className="text-sm text-white/65 leading-snug">{item.q}</p>
                  <span className="text-[#C9A844] text-sm opacity-60">→</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-sm uppercase px-14 py-4 rounded-xl hover:bg-[#D4B050] transition-colors w-full max-w-md"
              >
                Start My Protocol
              </Link>
              <p className="text-white/30 text-xs mt-3 tracking-wide">Takes less than 60 seconds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. PEPTIDE COLLECTION ══════════════════════════════════════ */}
      <section id="peptides" className="py-20 md:py-28 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F2E9DC", color: "#1a1a1a" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start justify-between mb-10 md:mb-12"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8962E] mb-5">Peptide Collection</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#111] leading-[1.1]">
                Curated. Pure. Purpose.<br />Backed by science.
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-[#111] tracking-[0.15em] uppercase border-b border-[#111] pb-0.5 hover:text-[#B8962E] hover:border-[#B8962E] transition-colors shrink-0 mt-2">
              View All Peptides →
            </Link>
          </motion.div>

          {/* Vial cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
            {PEPTIDES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/shop/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[#1a1a1a]/8 hover:border-[#C9A844]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Vial area */}
                  <div className="h-44 md:h-52 flex items-center justify-center py-4 px-6">
                    <VialSVG name={p.name} tag={p.tag}/>
                  </div>
                  {/* Info */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#1a1a1a]/6">
                    <h3 className="font-serif text-[#111] text-sm md:text-base mb-1.5 leading-snug">{p.name}</h3>
                    <p className="text-[#1a1a1a]/50 text-xs leading-relaxed mb-3">{p.desc}</p>
                    <span className="inline-block text-[9px] font-bold tracking-[0.18em] border border-[#1a1a1a]/25 text-[#1a1a1a]/60 px-2.5 py-1 rounded uppercase">
                      {p.tag}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-12">
            <Link href="/shop"
              className="inline-flex items-center justify-center bg-[#111] text-white font-bold tracking-[0.15em] text-xs uppercase px-12 py-4 rounded-xl hover:bg-[#222] transition-colors w-full max-w-sm"
            >
              Explore All Peptides →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-8 border-t border-[#1a1a1a]/10">
            {[
              { icon: <IconShieldCheck/>, label: "Science-backed formulations" },
              { icon: <IconSkin/>, label: "Purity & quality third-party tested" },
              { icon: <IconFlask/>, label: "Purpose-driven every peptide has a role" },
              { icon: <IconPerson/>, label: "Concierge guidance every step" },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5" style={{ filter: "brightness(0.7)" }}>{b.icon}</div>
                <p className="text-xs text-[#1a1a1a]/55 leading-snug">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. AURYX STANDARD ══════════════════════════════════════════ */}
      <section id="standard" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        <GoldWave/>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-5">The AURYX Standard</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Precision by design.<br/>Trust by standard.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {STANDARD.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-3"
              >
                {s.icon}
                <h3 className="font-medium text-sm text-[#C9A844] tracking-wide">{s.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. LIFESTYLE PHILOSOPHY ════════════════════════════════════ */}
      <section id="philosophy" className="py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-14 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-12 md:py-16 lg:pr-16"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-6">Live With Intention</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
                Longevity is a{" "}
                <em className="not-italic text-[#C9A844]">lifestyle</em>,{" "}
                not a shortcut.
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
                We believe in consistent choices, disciplined routines, and support that helps you thrive for the long run.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs text-[#C9A844] font-semibold tracking-[0.2em] uppercase hover:gap-3 transition-all"
              >
                Our Philosophy <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Atmospheric visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative min-h-[380px] md:min-h-[480px] rounded-2xl overflow-hidden lg:rounded-none lg:rounded-r-none"
              style={{ background: "linear-gradient(135deg, #141008 0%, #1a1206 40%, #0D1810 100%)" }}
            >
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 55% 40%, rgba(201,168,68,0.18) 0%, transparent 60%)" }}/>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 20% 70%, rgba(13,148,136,0.08) 0%, transparent 50%)" }}/>
              {/* Warm golden atmospheric feel */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,8,4,0.7) 100%)" }}/>
              {/* Ambient particles */}
              {[[25, 20, 4, 0.6], [75, 40, 3, 0.4], [60, 70, 2.5, 0.5], [15, 60, 2, 0.35], [85, 75, 3, 0.45], [45, 15, 1.5, 0.3], [90, 30, 2, 0.4]].map(([l, t, r, o], i) => (
                <div key={i} className="absolute rounded-full bg-[#C9A844]"
                  style={{ left: `${l}%`, top: `${t}%`, width: r, height: r, opacity: o }} />
              ))}
              <div className="absolute bottom-10 left-10">
                <div className="w-10 h-px bg-[#C9A844]/40 mb-4" />
                <p className="font-serif text-xl text-white/20 italic max-w-[220px] leading-snug">
                  "Consistent rhythm.<br />Intentional support.<br />Long-term vitality."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 7. TESTIMONIALS ════════════════════════════════════════════ */}
      <section id="results" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        <GoldWave/>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-14"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A844] mb-4">Results That Speak</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Real people.{" "}
              <em className="not-italic text-[#C9A844]">Real results.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-5 p-8 rounded-2xl border border-white/8"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <span className="font-serif text-4xl text-[#C9A844] leading-none opacity-70">"</span>
                <p className="text-white/75 text-base leading-relaxed font-light">{t.quote}</p>
                <div className="h-px bg-white/10 w-full"/>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.5" r="2.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                      <path d="M3 13.5C3 11 5.2 9 8 9C10.8 9 13 11 13 13.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">— {t.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-white/35">{t.label}</p>
                      <CheckCircle className="w-3 h-3 text-[#C9A844] opacity-70"/>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot indicator */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? "w-5 h-1.5 bg-[#C9A844]" : "w-1.5 h-1.5 bg-white/20"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. FINAL CTA ═══════════════════════════════════════════════ */}
      <section id="cta" className="relative overflow-hidden" style={{ backgroundColor: "#F2E9DC", color: "#111" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-20 md:py-24 px-8 md:px-14 lg:px-20"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8962E] mb-5">Ready To Begin?</p>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
                Your best,{" "}
                <em className="not-italic text-[#B8962E]">supported.</em>
              </h2>
              <p className="text-[#111]/55 text-base leading-relaxed mb-10">
                Guided protocols. Premium peptides.<br/>Personalized for you.
              </p>
              <div>
                <Link
                  href="/protocol-finder"
                  className="inline-flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-xs uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
                >
                  Find My Protocol
                </Link>
              </div>
            </motion.div>

            {/* Vial visual */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative min-h-[320px] md:min-h-0 flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a1008 0%, #201508 50%, #0D1208 100%)" }}
            >
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 45% 50%, rgba(201,168,68,0.22) 0%, transparent 65%)" }}/>
              <div className="relative z-10 flex items-center gap-6">
                {/* Large featured vial */}
                <div className="h-48 md:h-56">
                  <VialSVG name="AURYX Precision" tag="PEPTIDE"/>
                </div>
              </div>
              {/* Gold particles */}
              {[[20, 15, 4, 0.5], [80, 30, 3, 0.4], [65, 75, 2.5, 0.45], [10, 65, 2, 0.35], [90, 80, 3, 0.4]].map(([l, t, r, o], i) => (
                <div key={i} className="absolute rounded-full bg-[#C9A844]"
                  style={{ left: `${l}%`, top: `${t}%`, width: r, height: r, opacity: o }} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
      <ProtocolContinuationModal open={continuationOpen} onOpenChange={setContinuationOpen} />
    </div>
  );
}
