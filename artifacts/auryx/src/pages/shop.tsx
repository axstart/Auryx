import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, AlertCircle, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import type { ProductSummary } from "@/types/shop";

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

function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

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
      className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:ring-1 hover:ring-[#B8962E]/50"
    >
      {/* Visual strip */}
      <div className="h-44 bg-gradient-to-br from-[#F5F0E8] to-[#EDE8DC] flex items-center justify-center relative overflow-hidden">
        <VialGraphic />
        <span className="absolute top-3 left-4 text-[9px] uppercase tracking-[0.2em] text-[#B8962E] font-semibold">
          {product.category}
        </span>
        {product.requiresConsultation && (
          <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full">
            Rx
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-serif text-[#0A0A0A] text-xl mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-[#0A0A0A]/55 text-sm leading-relaxed flex-1 mb-4">{product.shortDescription}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[#0A0A0A] font-semibold text-lg">
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
            className="flex-1 h-9 rounded-lg border border-[#0A0A0A]/20 text-[#0A0A0A] text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-1 transition-all hover:border-[#0A0A0A]/60"
          >
            Learn More <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={handleAdd}
            className={`flex-1 h-9 rounded-lg text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all ${
              adding
                ? "bg-[#B8962E] text-white"
                : "bg-[#0A0A0A] text-white hover:bg-[#222]"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function VialGraphic() {
  return (
    <svg width="56" height="80" viewBox="0 0 56 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-80 transition-opacity">
      <rect x="20" y="2" width="16" height="8" rx="3" fill="#C9A844" opacity="0.7" />
      <rect x="18" y="9" width="20" height="4" rx="1" fill="#C9A844" opacity="0.5" />
      <rect x="16" y="12" width="24" height="52" rx="5" fill="white" opacity="0.85" stroke="#C9A844" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="18" y="16" width="20" height="28" rx="3" fill="#C9A844" opacity="0.12" />
      <rect x="20" y="18" width="6" height="24" rx="2" fill="white" opacity="0.6" />
      <rect x="16" y="60" width="24" height="4" rx="0" fill="#C9A844" opacity="0.15" />
    </svg>
  );
}

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

      {/* Hero Banner */}
      <div className="relative w-full bg-[#0A0A0A] overflow-hidden" style={{ minHeight: 340 }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(ellipse 60% 80% at 80% 50%, #B8962E 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 80%, #0D9488 0%, transparent 40%)",
          }}
        />
        <div className="relative container mx-auto px-6 md:px-12 pt-36 pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E] mb-4">Peptide Marketplace</p>
            <h1 className="font-serif text-white text-5xl md:text-6xl leading-tight mb-4">
              Precision.<br />Delivered.
            </h1>
            <p className="text-white/50 max-w-sm text-sm leading-relaxed">
              Pharmaceutical-grade peptide protocols. Physician-reviewed before every shipment.
            </p>
          </div>
          <button
            onClick={scrollToGrid}
            className="self-start md:self-end shrink-0 inline-flex items-center gap-2 bg-[#B8962E] text-white text-sm font-medium tracking-wide uppercase px-6 py-3 rounded-lg hover:bg-[#A07828] transition-colors"
          >
            Browse Protocols
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="sticky top-[57px] z-30 bg-[#FAFAF8]/95 backdrop-blur border-b border-[#E8E8E4]" ref={gridRef}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex gap-2 py-3.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-[11px] px-4 py-1.5 rounded-full border font-medium tracking-wide transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-transparent text-[#0A0A0A] border-[#0A0A0A]/25 hover:border-[#0A0A0A]/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-10 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#0A0A0A]/40">
              <p>Failed to load products. Please refresh and try again.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#0A0A0A]/40 mb-6 uppercase tracking-wider">
                {filtered.length} Protocol{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Trust Strip */}
          <div className="mt-20 pt-12 border-t border-[#E8E8E4] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "US-Sourced", sub: "Licensed compounding pharmacies" },
              { label: "99%+ Purity", sub: "Third-party tested every batch" },
              { label: "Physician-Supervised", sub: "Every order clinically reviewed" },
              { label: "Direct to Door", sub: "Nationwide discreet delivery" },
            ].map(item => (
              <div key={item.label}>
                <p className="text-[#B8962E] text-sm font-semibold mb-1">{item.label}</p>
                <p className="text-[#0A0A0A]/45 text-xs leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
