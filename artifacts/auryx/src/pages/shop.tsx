import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, AlertCircle, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import type { ProductSummary } from "@/types/shop";

const PRODUCT_IMAGES: Record<string, string> = {
  "sermorelin": "/products/sermorelin.png",
  "tesamorelin": "/products/tesamorelin.png",
  "tesamorelin-ipamorelin": "/products/ipamorelin.png",
  "ipamorelin": "/products/ipamorelin.png",
  "cjc-1295-ipamorelin": "/products/cjc-1295-ipamorelin.png",
  "tesofensine": "/products/tesofensine.png",
  "tesofensine-ipamorelin": "/products/tesofensine-ipamorelin.png",
  "bpc-157": "/products/bpc-157.png",
  "tb-500": "/products/tb-500.png",
  "kpv": "/products/kpv.png",
  "pt-141": "/products/pt-141.png",
  "kisspeptin": "/products/kisspeptin.png",
  "thymosin-alpha-1": "/products/thymosin-alpha-1.png",
  "epithalon": "/products/epithalon.png",
  "pinealon": "/products/pinealon.png",
  "mots-c": "/products/mots-c.png",
  "semax": "/products/semax.png",
  "selank": "/products/selank.png",
  "cortagen": "/products/cortagen.png",
  "nad-plus": "/products/nad-plus.png",
  "glow-complex": "/products/glow-complex.png",
  "aod-9604": "/products/aod-9604.png",
};

const CATEGORIES = [
  "All",
  "GLP-1 & Metabolic",
  "Growth Hormone",
  "Recovery & Regeneration",
  "Sexual Health & Vitality",
  "Immune & Longevity",
  "Cognitive & Neuroprotective",
  "Auryx Signature Complexes",
];

async function fetchProducts(): Promise<ProductSummary[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

/* ─── Particle canvas for hero ─────────────────────────────────────── */
interface Particle {
  x: number; y: number; r: number;
  vx: number; vy: number;
  alpha: number; color: string;
}

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const COLORS = ["#C9A844", "#B8962E", "#0D9488", "#FFFFFF"];
    const count = Math.floor((W * H) / 14000);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
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

      // Draw faint connecting lines between nearby particles
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

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─── Vial illustration for product card ───────────────────────────── */
function CardVial() {
  return (
    <svg width="100" height="148" viewBox="0 0 100 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cap */}
      <rect x="38" y="4" width="24" height="14" rx="5" fill="#C9A844" opacity="0.85" />
      {/* Neck band */}
      <rect x="34" y="16" width="32" height="7" rx="2" fill="#C9A844" opacity="0.55" />
      {/* Body */}
      <rect x="28" y="22" width="44" height="96" rx="9" fill="white" opacity="0.90" stroke="#C9A844" strokeWidth="1.2" strokeOpacity="0.35" />
      {/* Inner liquid fill */}
      <rect x="34" y="28" width="32" height="52" rx="5" fill="#C9A844" opacity="0.09" />
      {/* Glass highlight left */}
      <rect x="32" y="26" width="9" height="88" rx="4" fill="white" opacity="0.55" />
      {/* Label area */}
      <rect x="35" y="70" width="30" height="30" rx="3" fill="#F5EDD0" opacity="0.7" />
      <text x="50" y="83" textAnchor="middle" fontSize="6.5" fill="#C9A844" opacity="0.9" fontFamily="Georgia, serif" letterSpacing="1.5" fontWeight="600">AURYX</text>
      <text x="50" y="93" textAnchor="middle" fontSize="4.5" fill="#B8962E" opacity="0.65" fontFamily="Georgia, serif" letterSpacing="0.5">PEPTIDE</text>
      {/* Bottom dome */}
      <ellipse cx="50" cy="118" rx="22" ry="4" fill="#C9A844" opacity="0.08" />
    </svg>
  );
}

/* ─── Product card ──────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:ring-1 hover:ring-[#B8962E]/40"
    >
      {/* Visual area */}
      <div
        className="relative h-56 flex items-center justify-center overflow-hidden"
        style={productImage
          ? { background: "#080808" }
          : { background: "linear-gradient(135deg, #F8F3E8 0%, #EDE6D3 50%, #F0EBE0 100%)" }
        }
      >
        {productImage ? (
          <>
            {/* Subtle gold radial glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(201,168,68,0.12) 0%, transparent 70%)" }}
            />
            <img
              src={productImage}
              alt={product.name}
              className="relative z-10 h-44 w-auto object-contain group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 drop-shadow-2xl"
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,68,0.18) 0%, transparent 65%)" }}
            />
            <div className="relative z-10 group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500">
              <CardVial />
            </div>
          </>
        )}

        {/* Category label */}
        <span
          className={`absolute top-3.5 left-4 text-[9px] uppercase tracking-[0.18em] font-semibold ${productImage ? "text-[#C9A844]/80" : "text-[#B8962E]"}`}
        >
          {product.category}
        </span>
        {product.requiresConsultation && (
          <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${productImage ? "bg-amber-400/10 border border-amber-400/25 text-amber-400" : "bg-amber-100 border border-amber-200 text-amber-700"}`}>
            Rx
          </span>
        )}
      </div>

      {/* Text + actions */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-serif text-[#0A0A0A] text-xl mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-[#0A0A0A]/50 text-sm leading-relaxed flex-1 mb-4">{product.shortDescription}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[#0A0A0A] font-semibold text-lg tabular-nums">
            ${(product.priceCents / 100).toFixed(0)}
          </span>
          {product.requiresConsultation && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] text-amber-600 font-medium">Consultation required</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/shop/${product.slug}`}
            className="flex-1 h-9 rounded-lg border border-[#0A0A0A]/18 text-[#0A0A0A]/75 text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-1 transition-all hover:border-[#0A0A0A]/50 hover:text-[#0A0A0A]"
          >
            Details <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={handleAdd}
            className={`flex-1 h-9 rounded-lg text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all duration-200 ${
              adding
                ? "bg-[#B8962E] text-white"
                : "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>

      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: "70vh", background: "#080808" }}
      >
        {/* Layered radial gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 75% 40%, rgba(184,150,46,0.22) 0%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 20% 70%, rgba(13,148,136,0.12) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,68,0.06) 0%, transparent 50%)" }} />
        </div>

        {/* Animated particles */}
        <HeroParticles />

        {/* Content — centred */}
        <div className="relative z-10 text-center px-6 py-32 md:py-40 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#B8962E] mb-6 font-medium"
          >
            Peptide Marketplace
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-white leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            Precision.<br />Delivered.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-white/45 max-w-md text-sm md:text-base leading-relaxed mb-10"
          >
            Pharmaceutical-grade peptide protocols.<br />
            Physician-reviewed before every shipment.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            onClick={scrollToGrid}
            className="inline-flex items-center gap-2 bg-[#B8962E] text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 rounded-full hover:bg-[#A07828] transition-colors"
          >
            Browse Protocols
          </motion.button>
        </div>

        {/* Bottom fade to light */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #FAFAF8)" }}
        />
      </div>

      {/* ── Category Pills ── */}
      <div
        className="sticky z-30 bg-[#FAFAF8]/96 backdrop-blur border-b border-[#E8E8E4]"
        style={{ top: 57 }}
        ref={gridRef}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div
            className="flex gap-2 py-3.5"
            style={{
              overflowX: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <style>{`.pill-row::-webkit-scrollbar { display: none; }`}</style>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-[11px] px-4 py-1.5 rounded-full border font-medium tracking-wide transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-transparent text-[#0A0A0A]/70 border-[#0A0A0A]/22 hover:border-[#0A0A0A]/50 hover:text-[#0A0A0A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="py-10 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-[10px] text-[#0A0A0A]/35 mb-7 uppercase tracking-[0.2em]">
                {filtered.length} Protocol{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} />
                ))}
              </div>
            </>
          )}

          {/* ── Trust Strip ── */}
          <div className="mt-20 pt-12 border-t border-[#E8E8E4]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "US-Sourced", sub: "Licensed compounding pharmacies" },
                { label: "99%+ Purity", sub: "Third-party tested every batch" },
                { label: "Physician-Supervised", sub: "Every order clinically reviewed" },
                { label: "Direct to Door", sub: "Nationwide discreet delivery" },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <p className="text-[#B8962E] text-sm font-semibold">{item.label}</p>
                  <p className="text-[#0A0A0A]/40 text-xs leading-relaxed">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
