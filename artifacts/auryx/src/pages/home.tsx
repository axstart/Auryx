import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
import { ArrowRight, CheckCircle, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductSummary } from "@/types/shop";
import { applyPageSeo } from "@/lib/seo";
import { useI18n } from "@/i18n";

async function fetchProducts(): Promise<ProductSummary[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

/* ─── Gold SVG Icons ───────────────────────────────────────────────── */
const IconMetabolic = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L26 8.5 V16.5 C26 21.5 21.5 26 16 28 C10.5 26 6 21.5 6 16.5 V8.5 Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <line x1="16" y1="11" x2="16" y2="21" stroke="#C9A844" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11" y1="16" x2="21" y2="16" stroke="#C9A844" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSkin = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 5 C16 5 22 11 22 18 C22 21.3 19.3 24 16 24 C12.7 24 10 21.3 10 18 C10 11 16 5 16 5Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <path d="M16 17 C16 17 14 15 14 13" stroke="#C9A844" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const IconEnergy = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M18 4 L10 18 H16 L14 28 L24 14 H18 Z" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const IconCognitive = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M11 8 C8 8 6 10.5 6 13 C6 14.8 7 16.3 8.5 17.1 C8.2 17.7 8 18.3 8 19 C8 21.2 9.8 23 12 23 L12 24 C12 25.1 12.9 26 14 26 H18 C19.1 26 20 25.1 20 24 L20 23 C22.2 23 24 21.2 24 19 C24 18.3 23.8 17.7 23.5 17.1 C25 16.3 26 14.8 26 13 C26 10.5 24 8 21 8 C20.1 8 19.2 8.3 18.5 8.8 C17.7 8.3 16.9 8 16 8 C15.1 8 14.3 8.3 13.5 8.8 C12.8 8.3 11.9 8 11 8Z" stroke="#C9A844" strokeWidth="1.4" fill="none"/>
    <line x1="16" y1="13" x2="16" y2="20" stroke="#C9A844" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const IconSleep = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M17 5 C14 8 14 12 17 15 C14 15 10 13 10 9.5 C10 6.5 13 4 17 5Z" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <circle cx="22" cy="8" r="1.5" fill="#C9A844" opacity="0.7"/>
    <circle cx="26" cy="12" r="1" fill="#C9A844" opacity="0.5"/>
    <circle cx="24" cy="5" r="1" fill="#C9A844" opacity="0.4"/>
  </svg>
);

const IconFlask = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
    <path d="M10 4 L10 14 L4 22 C3 23.5 4 26 6 26 H22 C24 26 25 23.5 24 22 L18 14 L18 4" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <line x1="8" y1="4" x2="20" y2="4" stroke="#C9A844" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="11" cy="20" r="1.5" fill="#C9A844" opacity="0.6"/>
    <circle cx="16" cy="22" r="1" fill="#C9A844" opacity="0.4"/>
  </svg>
);

const IconShieldCheck = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
    <path d="M14 3 L24 7 V14 C24 19.5 19.5 24.5 14 26 C8.5 24.5 4 19.5 4 14 V7 Z" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <path d="M9.5 14 L12.5 17 L18.5 11" stroke="#C9A844" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTarget = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
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
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="4" stroke="#C9A844" strokeWidth="1.4" fill="none"/>
    <path d="M5 24 C5 19.6 9 16 14 16 C19 16 23 19.6 23 24" stroke="#C9A844" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── Gold wave background decoration ───────────────────────────────── */
const GoldWave = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute bottom-0 right-0 w-full h-full opacity-25" viewBox="0 0 800 500" preserveAspectRatio="xMaxYMax slice" fill="none">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A844" stopOpacity="0"/>
          <stop offset="50%" stopColor="#C9A844" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#C9A844" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <path d="M600 500 Q550 350 650 250 Q720 170 750 50 Q770 0 800 0 L800 500Z" fill="url(#waveGrad)" opacity="0.4"/>
      <path d="M650 500 Q580 380 700 270 Q760 200 780 80 Q790 30 800 0 L800 500Z" fill="url(#waveGrad)" opacity="0.2"/>
      {[
        [640, 450], [700, 380], [740, 300], [760, 220], [775, 150],
        [660, 420], [710, 350], [745, 270], [765, 190],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.5} fill="#C9A844" opacity={0.25 + (i % 4) * 0.08}/>
      ))}
    </svg>
  </div>
);

/* ─── Orbital accent for hero ────────────────────────────────────────── */
const HeroOrbitalAccent = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 700" fill="none" preserveAspectRatio="xMidYMid slice">
    <ellipse cx="320" cy="340" rx="260" ry="260" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.14"/>
    <ellipse cx="320" cy="340" rx="180" ry="180" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.11"/>
    <ellipse cx="320" cy="340" rx="100" ry="100" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.09"/>
    <ellipse cx="310" cy="330" rx="300" ry="210" stroke="#C9A844" strokeWidth="0.4" strokeOpacity="0.09" transform="rotate(-18 310 330)"/>
    <circle cx="320" cy="80" r="3.5" fill="#C9A844" fillOpacity="0.55"/>
    <circle cx="580" cy="200" r="3" fill="#C9A844" fillOpacity="0.45"/>
    <circle cx="530" cy="490" r="2.5" fill="#C9A844" fillOpacity="0.4"/>
    <circle cx="100" cy="420" r="2" fill="#C9A844" fillOpacity="0.35"/>
    <circle cx="65" cy="170" r="2" fill="#C9A844" fillOpacity="0.3"/>
    <circle cx="440" cy="130" r="1.5" fill="#C9A844" fillOpacity="0.35"/>
    <circle cx="180" cy="600" r="1.5" fill="#C9A844" fillOpacity="0.3"/>
  </svg>
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
      <rect x="38" y="6" width="34" height="18" rx="4" fill={`url(#cap-${name})`}/>
      <rect x="34" y="21" width="42" height="6" rx="2" fill={`url(#cap-${name})`} opacity="0.8"/>
      <rect x="26" y="26" width="58" height="120" rx="12" fill={`url(#glass-${name})`} stroke="rgba(201,168,68,0.2)" strokeWidth="1"/>
      <rect x="30" y="30" width="14" height="112" rx="7" fill="white" opacity="0.45"/>
      <rect x="29" y="42" width="52" height="78" rx="5" fill="white" opacity="0.97"/>
      <text x="55" y="63" textAnchor="middle" fontSize="7.5" fill="#C9A844" fontFamily="Georgia,serif" letterSpacing="3" fontWeight="400">AURYX</text>
      <line x1="35" y1="68" x2="75" y2="68" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.4"/>
      <text x="55" y="84" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontFamily="Georgia,serif" letterSpacing="0.5" fontWeight="400">{name.split(" ")[0]}</text>
      {name.split(" ").length > 1 && (
        <text x="55" y="95" textAnchor="middle" fontSize="8" fill="#1a1a1a" fontFamily="Georgia,serif" letterSpacing="0.5" fontWeight="400">{name.split(" ").slice(1).join(" ")}</text>
      )}
      <line x1="35" y1="102" x2="75" y2="102" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.3"/>
      <text x="55" y="114" textAnchor="middle" fontSize="5.5" fill="#C9A844" letterSpacing="2" fontFamily="Arial,sans-serif">PEPTIDE</text>
      <rect x="26" y="138" width="58" height="8" rx="0" fill="white" opacity="0.15"/>
    </svg>
  );
}

/* ─── Data (text lives in src/i18n/translations.ts, keyed by index) ──── */
const COLLECTION_ICONS = [
  <IconMetabolic key="metabolic"/>,
  <IconRecovery key="recovery"/>,
  <IconSkin key="skin"/>,
  <IconEnergy key="energy"/>,
  <IconCognitive key="cognitive"/>,
  <IconSleep key="sleep"/>,
];

const PEPTIDE_PRODUCTS = [
  { name: "TB-500", slug: "tb-500" },
  { name: "BPC-157", slug: "bpc-157" },
  { name: "NAD+", slug: "nad-plus" },
  { name: "CJC-1295 + Ipamorelin", slug: "cjc-1295-ipamorelin" },
];

const BADGE_ICONS = [
  <IconShieldCheck key="shield"/>,
  <IconSkin key="purity"/>,
  <IconFlask key="flask"/>,
  <IconPerson key="person"/>,
];

const FINDER_ICONS = [
  <IconTarget key="target"/>,
  <IconEnergy key="energy"/>,
  <IconSleep key="sleep"/>,
  <IconPerson key="person"/>,
];

const METHODOLOGY_NUMBERS = ["01", "02", "03", "04"];

const TESTIMONIALS = [
  { quote: "I feel more focused, sleep better, and recover faster.", name: "Jason R.", label: "Verified Customer" },
  { quote: "My energy and clarity feel more consistent.", name: "Sophia L.", label: "Verified Customer" },
  { quote: "AURYX fits seamlessly into my wellness routine.", name: "Michael B.", label: "Verified Customer" },
];

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const { t, lang, dict } = useI18n();
  const home = dict.home;
  const { data: products = [] } = useQuery<ProductSummary[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // English keeps the static FAQPage JSON-LD in index.html; es/pt inject a localized one.
    const jsonLd =
      lang === "en"
        ? []
        : [
            {
              id: "ld-home-faq-local",
              data: {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: home.faq.items.map(f => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            },
          ];
    return applyPageSeo({
      title: home.seoTitle,
      description: home.seoDescription,
      path: "/",
      jsonLd,
    });
  }, [lang, home]);

  function handleAdd(slug: string) {
    const product = products.find(p => p.slug === slug);
    if (!product) return;
    addToCart(product);
    setAddedSlugs(prev => new Set([...prev, slug]));
    setTimeout(() => setAddedSlugs(prev => { const s = new Set(prev); s.delete(slug); return s; }), 1500);
  }

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div className="w-full bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ═══ 1. HERO ════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">

        {/* Hero image — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <motion.img
            src="/Hero.webp"
            alt="Precision wellness"
            className="absolute inset-0 w-full object-cover"
            style={{
              objectPosition: "center top",
              height: "120%",
              top: "-10%",
              y: heroImageY,
              willChange: "transform",
            }}
          />
          {/* Fade image into dark background on left */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)" }}/>
          {/* Subtle bottom fade */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 20%)" }}/>
          {/* Enhance the natural gold glow from the image */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 55% 38%, rgba(201,168,68,0.08) 0%, transparent 60%)" }}/>
          {/* Orbital accent lines overlay */}
          <HeroOrbitalAccent/>
        </div>

        {/* Subtle atmospheric gradient overall */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, rgba(10,10,10,0.95) 40%, transparent 100%)" }}/>

        {/* Mobile bg */}
        <div className="absolute inset-0 z-0 md:hidden" style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.85) 100%)" }}/>

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-[calc(var(--site-header-height)+1rem)] pb-24 md:pt-[calc(var(--site-header-height)+1.5rem)] md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[540px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">{t("home.hero.eyebrow")}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light">
              {t("home.hero.title1")}{" "}
              <em className="not-italic text-[#C9A844]">{t("home.hero.titleEm")}</em>{" "}
              {t("home.hero.title2")}
            </h1>
            <p data-geo-chunk="definition" className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                {t("home.hero.ctaFind")}
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                {t("home.hero.ctaExplore")}
              </Link>
            </div>
            {/* Trust line */}
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              {t("home.hero.trustLine")}
            </p>
            <p className="byline mt-3 text-[11px] text-white/35">
              Medically reviewed by <Link href="/about" rel="author" className="text-[#C9A844] hover:underline">Romy Fontoura, MD</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. PROTOCOL COLLECTIONS ════════════════════════════════════ */}
      <section id="collections" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        {/* Orbital top-right decoration */}
        <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none opacity-35">
          <svg viewBox="0 0 256 256" fill="none">
            <circle cx="200" cy="56" r="90" stroke="#C9A844" strokeWidth="0.8" strokeOpacity="0.4"/>
            <circle cx="200" cy="56" r="55" stroke="#C9A844" strokeWidth="0.6" strokeOpacity="0.3"/>
            <circle cx="200" cy="56" r="25" stroke="#C9A844" strokeWidth="0.5" strokeOpacity="0.25"/>
            <circle cx="200" cy="-34" r="3.5" fill="#C9A844" fillOpacity="0.7"/>
            <circle cx="290" cy="70" r="3" fill="#C9A844" fillOpacity="0.6"/>
            <circle cx="255" cy="145" r="2" fill="#C9A844" fillOpacity="0.45"/>
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-5 font-medium">{t("home.collections.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] max-w-2xl font-light">
              {t("home.collections.title1")}{" "}
              <em className="not-italic text-[#C9A844]">{t("home.collections.titleEm")}</em>{" "}
              {t("home.collections.title2")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {home.collections.items.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href="/shop"
                  className="group flex flex-col gap-5 p-7 rounded-2xl border border-white/[0.07] hover:border-[#C9A844]/40 bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-300 h-full"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-[#C9A844]">{COLLECTION_ICONS[i]}</div>
                    <span className="text-[#C9A844]/40 text-base group-hover:text-[#C9A844]/70 group-hover:translate-x-0.5 inline-block transition-all duration-300">→</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2 leading-snug">{c.title}</h3>
                    <p className="text-[13px] text-white/45 leading-relaxed">{c.desc}</p>
                  </div>
                  {/* Subtle gold line on hover */}
                  <div className="h-px w-0 group-hover:w-8 bg-[#C9A844]/40 transition-all duration-500 mt-auto"/>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. PEPTIDE COLLECTION ══════════════════════════════════════ */}
      <section id="peptides" className="py-20 md:py-28 px-6 md:px-14 lg:px-20" style={{ backgroundColor: "#F5EEE4", color: "#1a1a1a" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 md:mb-14 flex-wrap gap-5"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">{t("home.peptides.eyebrow")}</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#111] leading-[1.1] font-light max-w-lg">
                {t("home.peptides.title1")}<br className="hidden md:block"/> {t("home.peptides.title2")}
              </h2>
              <p className="text-[#111]/50 text-sm md:text-base leading-relaxed mt-5 max-w-md">
                {t("home.peptides.subtitle")}
              </p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-[11px] font-semibold text-[#111] tracking-[0.18em] uppercase border-b border-[#111]/50 pb-0.5 hover:text-[#B8962E] hover:border-[#B8962E] transition-colors shrink-0">
              {t("home.peptides.viewAll")}
            </Link>
          </motion.div>

          {/* Editorial product image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden mb-8"
            style={{ height: "340px" }}
          >
            <img
              src="/peptides-collection.webp"
              alt="AURYX Peptide Collection — Sermorelin, BPC-157, NAD+, CJC-1295"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 45%" }}
            />
            {/* Subtle top + bottom fades */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(245,238,228,0.3) 0%, transparent 20%, transparent 75%, rgba(245,238,228,0.35) 100%)" }}/>
          </motion.div>

          {/* Product info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
            {PEPTIDE_PRODUCTS.map((p, i) => {
              const copy = home.peptides.items[i];
              const product = products.find(pr => pr.slug === p.slug);
              const isAdded = addedSlugs.has(p.slug);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="group flex flex-col bg-white rounded-xl border border-[#1a1a1a]/6 hover:border-[#C9A844]/35 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md p-5 h-full">
                    <div className="mb-3">
                      <span className="inline-block text-[9px] font-bold tracking-[0.2em] border border-[#1a1a1a]/18 text-[#1a1a1a]/50 px-2.5 py-1 rounded uppercase mb-3">
                        {copy.tag}
                      </span>
                      <h3 className="font-serif text-[#111] text-base leading-snug">{p.name}</h3>
                    </div>
                    <p className="text-[#1a1a1a]/45 text-xs leading-relaxed mb-4 flex-1">{copy.desc}</p>
                    <div className="mt-auto space-y-2">
                      {product && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#111] tabular-nums">
                            ${(product.priceCents / 100).toFixed(0)}
                          </span>
                          <Link href={`/shop/${p.slug}`} className="text-[10px] text-[#B8962E] hover:underline">
                            {t("home.peptides.details")}
                          </Link>
                        </div>
                      )}
                      <button
                        onClick={() => handleAdd(p.slug)}
                        disabled={!product}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                          isAdded
                            ? "bg-[#B8962E] text-white"
                            : product
                              ? "bg-[#111] text-white hover:bg-[#222]"
                              : "bg-[#111]/10 text-[#111]/30 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {isAdded ? t("home.peptides.added") : t("home.peptides.addToCart")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mb-12">
            <Link href="/shop"
              className="inline-flex items-center justify-center bg-[#111] text-white font-bold tracking-[0.15em] text-[11px] uppercase px-12 py-4 rounded-xl hover:bg-[#222] transition-colors w-full max-w-sm"
            >
              {t("home.peptides.exploreAll")}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-8 border-t border-[#1a1a1a]/8">
            {home.peptides.badges.map((label, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5" style={{ filter: "brightness(0.65)" }}>{BADGE_ICONS[i]}</div>
                <p className="text-xs text-[#1a1a1a]/50 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. PROTOCOL FINDER ═════════════════════════════════════════ */}
      <section id="finder" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <GoldWave/>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-6 font-medium">{t("home.finder.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-5 font-light">
              {t("home.finder.title1")}<br className="hidden md:block"/>
              {" "}{t("home.finder.title2")}{" "}
              <em className="not-italic text-[#C9A844]">{t("home.finder.titleEm")}</em>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-12 max-w-md">
              {t("home.finder.subtitle")}
            </p>

            {/* Question preview tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {home.finder.questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col gap-5 p-6 rounded-2xl border border-white/[0.08] hover:border-[#C9A844]/30 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                >
                  <div className="text-[#C9A844]">{FINDER_ICONS[i]}</div>
                  <div className="h-px w-6 bg-[#C9A844]/25" />
                  <p className="text-[13px] text-white/55 leading-snug">{q}</p>
                  <span className="text-[#C9A844]/50 text-sm">→</span>
                </motion.div>
              ))}
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8 justify-center">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`rounded-full flex items-center justify-center text-[9px] font-bold ${n === 1 ? "w-5 h-5 bg-[#C9A844] text-[#0A0A0A]" : "w-5 h-5 border border-white/15 text-white/25"}`}>{n}</div>
                  {n < 4 && <div className="w-6 h-px bg-white/10"/>}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-14 py-4 rounded-xl hover:bg-[#D4B050] transition-colors w-full max-w-md"
              >
                {t("home.finder.start")}
              </Link>
              <p className="text-white/25 text-[11px] mt-4 tracking-wide">{t("home.finder.takes")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 5. AURYX METHODOLOGY ═══════════════════════════════════════ */}
      <section id="methodology" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        <GoldWave/>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-5 font-medium">{t("home.methodology.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight font-light">
              {t("home.methodology.title1")}<br/>
              <em className="not-italic text-[#C9A844]">{t("home.methodology.title2Em")}</em>{t("home.methodology.title2")}
            </h2>
          </motion.div>

          {/* Editorial numbered layout */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A844]/30 via-[#C9A844]/15 to-transparent hidden md:block" style={{ transform: "translateX(-50%)" }}/>

            <div className="space-y-10 md:space-y-0">
              {home.methodology.steps.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 md:mb-14 ${i % 2 === 0 ? "" : "md:direction-rtl"}`}
                >
                  {i % 2 === 0 ? (
                    <>
                      {/* Left: content */}
                      <div className={`flex gap-6 items-start md:justify-end md:text-right pl-12 md:pl-0`}>
                        <div className="flex flex-col gap-3 max-w-sm">
                          <h3 className="font-serif text-2xl text-white leading-snug">{m.title}</h3>
                          <p className="text-[13px] text-white/45 leading-relaxed">{m.desc}</p>
                        </div>
                      </div>
                      {/* Right: number node */}
                      <div className="hidden md:flex items-start gap-6">
                        <div className="relative flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border border-[#C9A844]/40 bg-[#0D0D0D] flex items-center justify-center -ml-5">
                            <span className="font-serif text-sm text-[#C9A844] leading-none">{METHODOLOGY_NUMBERS[i]}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left: number node */}
                      <div className="hidden md:flex items-start justify-end gap-6">
                        <div className="relative flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border border-[#C9A844]/40 bg-[#0D0D0D] flex items-center justify-center -mr-5">
                            <span className="font-serif text-sm text-[#C9A844] leading-none">{METHODOLOGY_NUMBERS[i]}</span>
                          </div>
                        </div>
                      </div>
                      {/* Right: content */}
                      <div className="flex gap-6 items-start pl-12 md:pl-6">
                        <div className="flex flex-col gap-3 max-w-sm">
                          <h3 className="font-serif text-2xl text-white leading-snug">{m.title}</h3>
                          <p className="text-[13px] text-white/45 leading-relaxed">{m.desc}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Mobile number */}
                  <div className="absolute left-0 top-0 md:hidden">
                    <div className="w-10 h-10 rounded-full border border-[#C9A844]/40 bg-[#0D0D0D] flex items-center justify-center">
                      <span className="font-serif text-sm text-[#C9A844] leading-none">{METHODOLOGY_NUMBERS[i]}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. LIFESTYLE PHILOSOPHY ════════════════════════════════════ */}
      <section id="philosophy" className="py-20 md:py-0 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-14 lg:px-20 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:min-h-[560px]">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-12 md:py-20 lg:py-24 lg:pl-20 lg:pr-16"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-6 font-medium">{t("home.philosophy.eyebrow")}</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.1] mb-8 font-light">
                {t("home.philosophy.title1")}
                <em className="not-italic text-[#C9A844]">{t("home.philosophy.titleEm")}</em>{t("home.philosophy.title2")}
                <br/>{t("home.philosophy.title3")}
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
                {t("home.philosophy.body")}
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 text-[11px] text-[#C9A844] font-semibold tracking-[0.22em] uppercase hover:gap-3 transition-all self-start"
              >
                {t("home.philosophy.cta")} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Image panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative min-h-[380px] md:min-h-[480px] lg:min-h-0 overflow-hidden"
            >
              <img
                src="/Lifestyle.webp"
                alt="Research-grade peptide compounds"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 25%" }}
              />
              {/* Overlay to blend into dark bg */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.2) 15%, transparent 50%)" }}/>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.7) 100%)" }}/>
              {/* Gold tint overlay */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 60% 40%, rgba(201,168,68,0.06) 0%, transparent 70%)" }}/>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 7. QUALITY ASSURANCE ════════════════════════════════════════ */}
      <section id="quality" className="relative py-20 md:py-28 px-6 md:px-14 lg:px-20 overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
        <GoldWave/>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-4 font-medium">{t("home.quality.eyebrow")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("home.quality.title1")}{" "}
              <em className="not-italic text-[#C9A844]">{t("home.quality.titleEm")}</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {home.quality.cards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6 p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-[#C9A844]/25 transition-colors duration-300"
              >
                <p className="font-serif text-5xl text-[#C9A844] font-light">{item.stat}</p>
                <p className="text-white/60 text-sm leading-relaxed">{item.label}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.5" r="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
                      <path d="M3 13.5C3 11 5.2 9 8 9C10.8 9 13 11 13 13.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">{t("home.quality.standard")}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-white/30">{t("home.quality.researchGrade")}</p>
                      <CheckCircle className="w-3 h-3 text-[#C9A844] opacity-65"/>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot indicator */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {[0, 1, 2].map(i => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? "w-6 h-1.5 bg-[#C9A844]" : "w-1.5 h-1.5 bg-white/15"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ (matches FAQPage JSON-LD) ═══════════════════════════════ */}
      <section id="faq" className="py-20 md:py-28 px-6 md:px-12" style={{ background: "#FAFAF8", color: "#111" }}>
        <div className="container mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-4 font-medium text-center">
            {t("home.faq.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-10 font-light text-center">
            {t("home.faq.title")}
          </h2>
          <div className="space-y-3">
            {home.faq.items.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border border-[#E8E8E4] rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="font-medium text-[15px] text-[#111]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#B8962E] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-5 pb-5">
                      <p className="text-[14px] text-[#111]/65 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 8. FINAL CTA ═══════════════════════════════════════════════ */}
      <section id="cta" className="relative overflow-hidden" style={{ backgroundColor: "#F5EEE4", color: "#111" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center py-20 md:py-28 px-8 md:px-14 lg:px-20"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-5 font-medium">{t("home.cta.eyebrow")}</p>
              <h2 className="font-serif text-5xl md:text-6xl leading-[1.08] mb-6 font-light">
                {t("home.cta.title1")}{" "}
                <em className="not-italic text-[#B8962E]">{t("home.cta.titleEm")}</em>
              </h2>
              <p className="text-[#111]/50 text-base leading-relaxed mb-10 max-w-sm">
                {t("home.cta.body1")}<br/>{t("home.cta.body2")}
              </p>
              <div>
                <Link
                  href="/protocol-finder"
                  className="inline-flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
                >
                  {t("home.cta.button")}
                </Link>
              </div>
            </motion.div>

            {/* Peptide standout panel */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1 }}
              className="relative min-h-[340px] md:min-h-0 overflow-hidden"
            >
              <img
                src="/Peptide_standout.webp"
                alt="AURYX Precision Peptides"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 30%" }}
              />
              {/* Left edge blend into ivory */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #F5EEE4 0%, rgba(245,238,228,0.15) 18%, transparent 40%)" }}/>
              {/* Bottom fade */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,16,8,0.4) 0%, transparent 40%)" }}/>
            </motion.div>
          </div>
        </div>
      </section>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
      <ProtocolContinuationModal open={continuationOpen} onOpenChange={setContinuationOpen} onSwitchToConsultation={() => { setContinuationOpen(false); setModalOpen(true); }} />
    </div>
  );
}
