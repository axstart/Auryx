import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingCart, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import type { Product } from "@/types/shop";

async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export default function ProductPage() {
  const [, params] = useRoute("/shop/:slug");
  const slug = params?.slug ?? "";
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found.</p>
          <Link href="/shop" className="text-primary hover:underline text-sm">← Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="pt-28 pb-6 px-6 md:px-12 border-b border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Shop
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground/60">{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[10px] uppercase tracking-widest text-primary/70 font-medium">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mt-3 mb-5">{product.name}</h1>
              <p className="text-foreground/70 text-base leading-relaxed mb-6">{product.fullDescription}</p>

              {product.requiresConsultation && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-300 mb-1">Consultation Required</p>
                    <p className="text-xs text-amber-300/70">
                      This protocol requires a brief physician consultation before fulfillment. After ordering, our clinical team will contact you to schedule your review.
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Primary Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Physician Note */}
              {product.physicianNote && (
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-teal-400/80 mb-2">Physician's Note</p>
                  <p className="text-sm text-foreground/70 italic leading-relaxed">"{product.physicianNote}"</p>
                </div>
              )}
            </motion.div>

            {/* Right Column — Purchase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:sticky lg:top-28"
            >
              <div className="bg-card/60 border border-border rounded-2xl p-8 space-y-6">
                {/* Price */}
                <div>
                  <p className="text-3xl font-serif text-primary">${(product.priceCents / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Per protocol unit · Price may vary by dosing</p>
                </div>

                {/* Qty */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => setQty(n)}
                        className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                          qty === n
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to cart */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 bg-primary text-primary-foreground text-sm flex items-center justify-center gap-2"
                >
                  {added ? (
                    <><CheckCircle2 className="w-4 h-4" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart — ${((product.priceCents * qty) / 100).toFixed(2)}</>
                  )}
                </Button>

                {/* Trust signals */}
                <div className="pt-4 border-t border-border/40 space-y-2.5">
                  {[
                    "US-licensed compounding pharmacy",
                    "99%+ purity, third-party tested",
                    "Physician-reviewed before fulfillment",
                    "Discreet nationwide delivery",
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosing */}
              <div className="mt-6 bg-card/30 border border-border/50 rounded-xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Dosing & Protocol</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{product.dosingInfo}</p>
                <p className="text-xs text-muted-foreground/60 mt-3">All dosing is confirmed and supervised by your Auryx physician before fulfillment.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
