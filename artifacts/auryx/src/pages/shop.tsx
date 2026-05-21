import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronRight, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
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

function ProductCard({ product }: { product: ProductSummary }) {
  const { addToCart } = useCart();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border border-border hover:border-primary/40 rounded-xl overflow-hidden transition-colors duration-300 flex flex-col"
    >
      <div className="p-7 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-[10px] uppercase tracking-widest text-primary/70 font-medium">{product.category}</span>
        </div>
        <h3 className="font-serif text-xl text-foreground mb-2">{product.name}</h3>
        <p className="text-sm text-foreground/65 leading-relaxed flex-1">{product.shortDescription}</p>
        {product.requiresConsultation && (
          <div className="flex items-center gap-1.5 mt-3">
            <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-[10px] text-amber-400">Consultation required</span>
          </div>
        )}
        <div className="mt-5 pt-5 border-t border-border/40 flex items-center justify-between gap-3">
          <span className="text-primary font-medium text-lg">${(product.priceCents / 100).toFixed(0)}</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${product.slug}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Learn More <ChevronRight className="w-3 h-3" />
            </Link>
            <Button
              size="sm"
              onClick={() => addToCart(product)}
              className="bg-primary text-primary-foreground h-8 text-xs px-3 flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 border-b border-border/40">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Peptide Marketplace</p>
            <h1 className="text-5xl md:text-6xl font-serif text-foreground mb-4">Shop Protocols</h1>
            <p className="text-foreground/60 text-lg max-w-xl">
              Pharmaceutical-grade peptides. Every order reviewed by our clinical team before fulfillment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border/40 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs px-4 py-1.5 rounded-full border font-medium transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card/30 rounded-xl border border-border/40 h-64 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>Failed to load products. Please try again.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-6">{filtered.length} protocol{filtered.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Trust strip */}
          <div className="mt-16 pt-12 border-t border-border/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "US-Sourced", sub: "Licensed compounding pharmacies" },
              { label: "99%+ Purity", sub: "Third-party tested every batch" },
              { label: "Physician-Supervised", sub: "Every order clinically reviewed" },
              { label: "Direct to Door", sub: "Nationwide delivery" },
            ].map(item => (
              <div key={item.label}>
                <p className="text-primary text-sm font-medium mb-0.5">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
