import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, AlertCircle, ChevronRight, Search,
  Flame, TrendingUp, RefreshCw, Heart, Shield, Brain,
  Sparkles, ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import type { ProductSummary } from "@/types/shop";

function setPageMeta({ title, description }: { title: string; description: string }) {
  document.title = title;
  const el = document.querySelector('meta[name="description"]');
  if (el) el.setAttribute("content", description);
}

/* ── Page meta ──────────────────────────────────────────────────────── */

const PAGE_TITLE = "Shop | AURYX — Research-Grade Peptides";
const PAGE_DESC = "Browse AURYX's curated collection of physician-prescribed peptide compounds. GLP-1 agonists, growth hormone secretagogues, recovery peptides, cognitive enhancers, and longevity protocols.";

/* ── Product image map ──────────────────────────────────────────────── */
const PRODUCT_IMAGES: Record<string, string> = {
  "semaglutide": "/products/semaglutide.png",
  "tirzepatide": "/products/tirzepatide.png",
  "retatrutide": "/products/retatrutide.png",
  "sermorelin": "/products/sermorelin.png",
  "tesamorelin": "/products/tesamorelin.png",
  "tesamorelin-ipamorelin": "/products/ipamorelin.png",
  "ipamorelin": "/products/ipamorelin.png",
  "cjc-1295": "/products/cjc-1295.png",
  "cjc-1295-dac": "/products/cjc-1295-dac.png",
  "cjc-1295-ipamorelin": "/products/cjc-1295-ipamorelin.png",
  "bpc-157": "/products/bpc-157.png",
  "tb-500": "/products/tb-500.png",
  "bpc-157-tb-500": "/products/bpc-157-tb-500.png",
  "kpv": "/products/kpv.png",
  "ghk-cu": "/products/ghk-cu.png",
  "pt-141": "/products/pt-141.png",
  "kisspeptin": "/products/kisspeptin.png",
  "thymosin-alpha-1": "/products/thymosin-alpha-1.png",
  "epithalon": "/products/epithalon.png",
  "pinealon": "/products/pinealon.png",
  "mots-c": "/products/mots-c.png",
  "semax": "/products/semax.png",
  "selank": "/products/selank.png",
  "cerebrolysin": "/products/cerebrolysin.png",
  "nad-plus": "/products/nad-plus.png",
  "glutathione": "/products/glutathione.png",
  "ss-31": "/products/ss-31.png",
  "glow-complex": "/products/glow-complex.png",
  "klow-complex": "/products/klow-complex.png",
  "aod-9604": "/products/aod-9604.png",
  "reconstitution-kit": "/products/reconstitution-kit.png",
};

/* ── Categories & config ────────────────────────────────────────────── */
const CATEGORIES = [
  "All",
  "GLP-1 & Metabolic",
  "Growth Hormone",
  "Recovery & Regeneration",
  "Sexual Health & Vitality",
  "Immune & Cellular Biology",
  "Neuroprotective & CNS",
  "Auryx Signature Complexes",
  "Accessories",
];

const GOAL_CARDS = [
  { category: "GLP-1 & Metabolic",           tagline: "Body composition & metabolic support",     Icon: Flame },
  { category: "Growth Hormone",               tagline: "Recovery, lean mass & performance",        Icon: TrendingUp },
  { category: "Recovery & Regeneration",      tagline: "Tissue repair & physical restoration",     Icon: RefreshCw },
  { category: "Sexual Health & Vitality",     tagline: "Drive, vitality & hormonal balance",       Icon: Heart },
  { category: "Immune & Cellular Biology",           tagline: "Cellular health & immune resilience",      Icon: Shield },
  { category: "Neuroprotective & CNS",       tagline: "Neuroprotection & CNS mechanisms",         Icon: Brain },
  { category: "Auryx Signature Complexes",   tagline: "Bespoke multi-peptide protocols",          Icon: Sparkles },
  { category: "Accessories",                  tagline: "Reconstitution kits & supplies",           Icon: ShoppingCart },
];

const FEATURED_SLUGS = ["sermorelin", "bpc-157", "nad-plus", "cjc-1295-ipamorelin"];

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "az",         label: "A–Z" },
];

/* ── Data fetcher ───────────────────────────────────────────────────── */
async function fetchProducts(): Promise<ProductSummary[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

/* ── Hero particles ─────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; color: string;
}

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const COLORS = ["#C9A844", "#B8962E", "#0D9488", "#FFFFFF"];
    const count  = Math.floor((W * H) / 14000);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const ctx = canvas.getContext("2d")!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "#C9A844";
            ctx.globalAlpha = (1 - dist / 90) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animRef.current);
      init(canvas);
    });
    observer.observe(canvas);
    init(canvas);
    return () => { observer.disconnect(); cancelAnimationFrame(animRef.current); };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
}

/* ── SVG vial fallback ──────────────────────────────────────────────── */
function CardVial() {
  return (
    <svg width="90" height="134" viewBox="0 0 100 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="38" y="4" width="24" height="14" rx="5" fill="#C9A844" opacity="0.85" />
      <rect x="34" y="16" width="32" height="7" rx="2" fill="#C9A844" opacity="0.55" />
      <rect x="28" y="22" width="44" height="96" rx="9" fill="white" opacity="0.90" stroke="#C9A844" strokeWidth="1.2" strokeOpacity="0.35" />
      <rect x="34" y="28" width="32" height="52" rx="5" fill="#C9A844" opacity="0.09" />
      <rect x="32" y="26" width="9" height="88" rx="4" fill="white" opacity="0.55" />
      <rect x="35" y="70" width="30" height="30" rx="3" fill="#F5EDD0" opacity="0.7" />
      <text x="50" y="88" textAnchor="middle" fontSize="6.5" fill="#C9A844" opacity="0.9" fontFamily="Georgia, serif" letterSpacing="1.5" fontWeight="600">AURYX</text>
      <ellipse cx="50" cy="118" rx="22" ry="4" fill="#C9A844" opacity="0.08" />
    </svg>
  );
}

/* ── Product card ───────────────────────────────────────────────────── */
function ProductCard({
  product, index, featured = false, outOfStock = false,
}: {
  product: ProductSummary;
  index: number;
  featured?: boolean;
  outOfStock?: boolean;
}) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const productImage = PRODUCT_IMAGES[product.slug];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group rounded-2xl overflow-hidden flex flex-row
        shadow-[0_2px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_36px_rgba(0,0,0,0.12)]
        hover:-translate-y-0.5 hover:ring-1 hover:ring-[#C9A844]/40
        transition-all duration-300"
      style={{ background: "linear-gradient(135deg, #F9F5EC 0%, #F3EBD8 50%, #EDE3CC 100%)" }}
    >
      {/* ── Image zone — narrow vertical rectangle ── */}
      <div
        className={`relative shrink-0 flex items-center justify-center overflow-hidden self-stretch ${featured ? "w-[26%]" : "w-[22%]"}`}
        style={{ background: "linear-gradient(180deg, #F5F0E5 0%, #EDE3CC 100%)" }}
      >
        {/* Permanent soft base glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 65% at 50% 55%, rgba(201,168,68,0.18) 0%, transparent 72%)" }}
        />
        {/* Stronger hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 85% 60% at 50% 55%, rgba(201,168,68,0.38) 0%, transparent 68%)" }}
        />
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className={`relative z-10 object-contain group-hover:scale-[1.07] group-hover:-translate-y-0.5 transition-transform duration-500 drop-shadow-lg ${featured ? "h-32 w-auto max-w-[90%]" : "h-[5.5rem] w-auto max-w-[85%]"}`}
          />
        ) : (
          <div className="relative z-10 group-hover:scale-[1.07] transition-transform duration-500 scale-75">
            <CardVial />
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="w-px bg-[#C9A844]/20 my-4 shrink-0" />

      {/* ── Content ── */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#B8962E] leading-none mt-0.5">
              {product.category}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-50/80 border border-amber-200/60 text-amber-700 shrink-0">
              Research
            </span>
          </div>

          <h3
            className="text-[#0A0A0A] leading-[1.0] mb-2 truncate"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: featured ? "clamp(1.6rem, 2.4vw, 2.2rem)" : "clamp(1.3rem, 1.9vw, 1.8rem)",
              letterSpacing: "0.02em",
            }}
          >
            {product.name}
          </h3>

          <p className="text-[#0A0A0A]/48 text-[12px] leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[#0A0A0A] font-semibold text-[1rem] tabular-nums mr-auto">
            {product.variants && product.variants.length > 1
              ? <>
                  <span className="text-[0.7rem] text-[#0A0A0A]/40 font-normal mr-0.5">from</span>
                  ${Math.min(...product.variants.map(v => v.priceCents / 100)).toFixed(0)}
                </>
              : `$${(product.priceCents / 100).toFixed(0)}`
            }
          </span>
          {outOfStock ? (
            <span className="h-8 px-4 rounded-lg text-[10px] font-semibold tracking-widest uppercase flex items-center bg-[#0A0A0A]/8 text-[#0A0A0A]/35 border border-[#0A0A0A]/10 cursor-not-allowed whitespace-nowrap select-none">
              Out of Stock
            </span>
          ) : product.variants && product.variants.length > 1 ? (
            <Link
              href={`/shop/${product.slug}`}
              className={`h-8 px-3 rounded-lg text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
                adding
                  ? "bg-[#B8962E] text-white"
                  : "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a] hover:ring-1 hover:ring-[#C9A844]/40"
              }`}
            >
              <ChevronRight className="w-3 h-3" />
              Select Dose
            </Link>
          ) : (
            <>
              <Link
                href={`/shop/${product.slug}`}
                className="h-8 px-3 rounded-lg bg-white/70 border border-[#D8CEB8] text-[#6B5A3A] text-[10px] font-medium tracking-widest uppercase flex items-center gap-1 hover:bg-white hover:border-[#B8962E]/60 hover:text-[#B8962E] transition-all whitespace-nowrap shadow-sm"
              >
                More <ChevronRight className="w-2.5 h-2.5" />
              </Link>
              <button
                onClick={handleAdd}
                className={`h-8 px-3 rounded-lg text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
                  adding
                    ? "bg-[#B8962E] text-white"
                    : "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a] hover:ring-1 hover:ring-[#C9A844]/40"
                }`}
              >
                <ShoppingCart className="w-3 h-3" />
                {adding ? "Added ✓" : "Add to Cart"}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function ShopPage() {
  useEffect(() => {
    setPageMeta({ title: PAGE_TITLE, description: PAGE_DESC });
  }, []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [sortBy,         setSortBy]         = useState("featured");
  const gridRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: stockMap = {} } = useQuery<Record<string, number>>({
    queryKey: ["stock"],
    queryFn: () => fetch("/api/stock").then(r => r.json()),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  /* ── Filter + sort ── */
  const filtered = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.priceCents - b.priceCents;
    if (sortBy === "price-desc") return b.priceCents - a.priceCents;
    if (sortBy === "az")         return a.name.localeCompare(b.name);
    return 0;
  });

  const featured = products.filter(p => FEATURED_SLUGS.includes(p.slug))
    .sort((a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug));

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGoalClick = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setSortBy("featured");
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        {/* Right-side image */}
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/peptides-collection.webp"
            alt="AURYX peptide collection"
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
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">Peptide Marketplace</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              Curated peptides.{" "}
              <em className="not-italic text-[#C9A844]">Delivered</em>{" "}
              with intention.
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              Premium peptide protocols for recovery, vitality, performance, and modern longevity — physician-supervised and third-party tested.
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol
              </Link>
              <button
                onClick={() => goalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Shop by Goal
              </button>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              Third-party tested · Discreet shipping · Concierge guidance
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══════════════════════════════════════════════════ */}
      <div className="border-b border-[#E8E4DC]" style={{ background: "#F5F1E8" }}>
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { icon: "✦", text: "Third-party tested" },
              { icon: "✦", text: "Discreet shipping" },
              { icon: "✦", text: "Secure checkout" },
              { icon: "✦", text: "Concierge guidance" },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-2 text-[11px] text-[#B8962E] font-medium tracking-[0.12em] uppercase">
                <span className="text-[#C9A844] text-[8px]">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SHOP BY GOAL ═════════════════════════════════════════════════ */}
      <section ref={goalRef} className="py-16 px-6 md:px-12" style={{ background: "#FAFAF8" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#B8962E] mb-3 font-medium">Guided Shopping</p>
            <h2 className="font-serif text-[#0A0A0A] text-[1.9rem] md:text-[2.4rem] leading-tight">
              Shop by Goal
            </h2>
          </div>

          <div
            className="flex gap-4 pb-2"
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {GOAL_CARDS.map(({ category, tagline, Icon }) => (
              <button
                key={category}
                onClick={() => handleGoalClick(category)}
                className={`shrink-0 w-44 md:w-48 text-left rounded-2xl border p-5 transition-all duration-200 group/goal
                  ${activeCategory === category
                    ? "bg-[#0A0A0A] border-[#0A0A0A] shadow-lg"
                    : "bg-white border-[#E8E4DC] hover:border-[#C9A844]/50 hover:shadow-md"
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 transition-colors
                  ${activeCategory === category ? "bg-[#C9A844]/20" : "bg-[#F5F0E8] group-hover/goal:bg-[#C9A844]/15"}`}>
                  <Icon className={`w-3.5 h-3.5 ${activeCategory === category ? "text-[#C9A844]" : "text-[#B8962E]"}`} />
                </div>
                <p className={`font-serif text-[14px] leading-snug mb-1.5 ${activeCategory === category ? "text-white" : "text-[#0A0A0A]"}`}>
                  {category}
                </p>
                <p className={`text-[11px] leading-relaxed ${activeCategory === category ? "text-white/50" : "text-[#0A0A0A]/40"}`}>
                  {tagline}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROTOCOLS ═══════════════════════════════════════════ */}
      {!isLoading && featured.length > 0 && activeCategory === "All" && !searchQuery && (
        <section className="py-4 pb-16 px-6 md:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#B8962E] mb-2 font-medium">Most Requested</p>
                <h2 className="font-serif text-[#0A0A0A] text-[1.7rem] md:text-[2.1rem] leading-tight">Featured Protocols</h2>
              </div>
              <button
                onClick={scrollToGrid}
                className="hidden md:flex items-center gap-1.5 text-[11px] text-[#0A0A0A]/45 hover:text-[#B8962E] tracking-widest uppercase font-medium transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {featured.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} featured outOfStock={(stockMap[p.slug] ?? -1) === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CONVERSION BANNER ════════════════════════════════════════════ */}
      {activeCategory === "All" && !searchQuery && (
        <section className="px-6 md:px-12 pb-16">
          <div className="container mx-auto max-w-7xl">
            <div
              className="relative rounded-3xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
              style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #111008 60%, #0D0D0B 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div style={{ background: "radial-gradient(ellipse 55% 60% at 85% 50%, rgba(201,168,68,0.10) 0%, transparent 65%)" }} className="absolute inset-0" />
                <div style={{ background: "radial-gradient(ellipse 35% 50% at 10% 80%, rgba(13,148,136,0.08) 0%, transparent 55%)" }} className="absolute inset-0" />
              </div>
              <div className="relative z-10 flex-1 text-center md:text-left">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A844] mb-3 font-medium">Personalised Protocol</p>
                <h3 className="font-serif text-white text-[1.7rem] md:text-[2rem] leading-tight mb-3">
                  Not sure where to start?
                </h3>
                <p className="text-white/40 text-[14px] leading-relaxed max-w-md">
                  Answer a few questions and find the AURYX collection that best matches your goals,
                  lifestyle, and current rhythm.
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#C9A844] text-[#0A0A0A] text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#D4B34E] transition-colors shadow-lg shadow-[#C9A844]/20"
                >
                  Take the 60-second Protocol Finder
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ FILTER BAR ═══════════════════════════════════════════════════ */}
      <div
        ref={gridRef}
        className="sticky z-30 bg-[#FAFAF8]/97 backdrop-blur border-b border-[#E8E4DC]"
        style={{ top: 57 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          {/* Search + sort row */}
          <div className="flex items-center gap-3 pt-3 pb-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A0A0A]/30" />
              <input
                type="text"
                placeholder="Search protocols…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-[12px] rounded-lg border border-[#E8E4DC] bg-white/70 text-[#0A0A0A] placeholder:text-[#0A0A0A]/30 focus:outline-none focus:border-[#C9A844]/60 focus:ring-1 focus:ring-[#C9A844]/25 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="py-2 px-3 text-[11px] rounded-lg border border-[#E8E4DC] bg-white/70 text-[#0A0A0A]/70 focus:outline-none focus:border-[#C9A844]/60 cursor-pointer tracking-wide"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Category pills */}
          <div
            className="flex gap-2 pb-3"
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-[11px] px-4 py-1.5 rounded-full border font-medium tracking-wide transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-transparent text-[#0A0A0A]/60 border-[#0A0A0A]/18 hover:border-[#C9A844]/50 hover:text-[#0A0A0A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PRODUCT GRID ═════════════════════════════════════════════════ */}
      <section className="py-10 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#0A0A0A]/35">
              <p>Failed to load products. Please refresh and try again.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-7">
                <p className="text-[10px] text-[#0A0A0A]/35 uppercase tracking-[0.2em]">
                  {sorted.length} Protocol{sorted.length !== 1 ? "s" : ""}
                  {activeCategory !== "All" && (
                    <span className="ml-2 text-[#B8962E]">— {activeCategory}</span>
                  )}
                </p>
                {(activeCategory !== "All" || searchQuery) && (
                  <button
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); setSortBy("featured"); }}
                    className="text-[10px] text-[#0A0A0A]/40 hover:text-[#B8962E] tracking-widest uppercase font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + sortBy + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                >
                  {sorted.map((product, i) => (
                    <ProductCard key={product.slug} product={product} index={i} outOfStock={(stockMap[product.slug] ?? -1) === 0} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {sorted.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-[#0A0A0A]/30 text-sm">No protocols match your search.</p>
                  <button
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                    className="mt-4 text-[11px] text-[#B8962E] uppercase tracking-widest font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Bottom trust strip ── */}
          <div className="mt-20 pt-12 border-t border-[#E8E4DC]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "US-Sourced", sub: "Licensed compounding pharmacies" },
                { label: "99%+ Purity", sub: "Third-party tested every batch" },
                { label: "Physician-Supervised", sub: "Every order clinically reviewed" },
                { label: "Direct to Door", sub: "Nationwide discreet delivery" },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <p className="text-[#B8962E] text-sm font-semibold">{item.label}</p>
                  <p className="text-[#0A0A0A]/38 text-xs leading-relaxed">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
