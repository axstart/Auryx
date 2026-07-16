import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import type { Product } from "@/types/shop";

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
  "tirzepatide-b12-glycine": "/products/tirzepatide-b12-glycine.png",
};

async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

async function fetchStock(): Promise<Record<string, number>> {
  const res = await fetch("/api/stock");
  if (!res.ok) return {};
  return res.json();
}

function PeptideVial({ category }: { category: string }) {
  const isTeal = category.includes("Cogni") || category.includes("Immune");
  const accent = isTeal ? "#0D9488" : "#B8962E";
  const accentLight = isTeal ? "#CCF0ED" : "#F5EDD0";

  return (
    <div className="relative flex items-center justify-center h-full">
      <div
        className="absolute inset-0 rounded-3xl opacity-40"
        style={{ background: `radial-gradient(ellipse at 60% 40%, ${accentLight} 0%, transparent 70%)` }}
      />
      <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="44" y="4" width="32" height="16" rx="6" fill={accent} opacity="0.8" />
        <rect x="40" y="18" width="40" height="8" rx="2" fill={accent} opacity="0.5" />
        <rect x="34" y="24" width="52" height="116" rx="12" fill="white" opacity="0.92" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3" />
        <rect x="40" y="32" width="40" height="60" rx="6" fill={accent} opacity="0.08" />
        <rect x="42" y="36" width="12" height="52" rx="4" fill="white" opacity="0.7" />
        <rect x="34" y="132" width="52" height="8" rx="0" fill={accent} opacity="0.12" />
        <path d="M34 140 Q60 152 86 140 L86 148 Q60 160 34 148 Z" fill={accent} opacity="0.06" />
        <text x="60" y="80" textAnchor="middle" fontSize="9" fill={accent} opacity="0.6" fontFamily="serif" letterSpacing="1">AURYX</text>
      </svg>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[9px] uppercase tracking-[0.2em] font-medium" style={{ color: accent }}>
          Pharmaceutical Grade
        </p>
      </div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E8E4]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-[#0A0A0A] uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#0A0A0A]/40" /> : <ChevronDown className="w-4 h-4 text-[#0A0A0A]/40" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-5"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

const TRUST_BADGES = [
  { label: "US-Sourced", icon: "🇺🇸" },
  { label: "Pharma Grade", icon: "⚗️" },
  { label: "3rd Party Tested", icon: "✓" },
  { label: "Physician-Supervised", icon: "🩺" },
];

export default function ProductPage() {
  const [, params] = useRoute("/shop/:slug");
  const slug = params?.slug ?? "";
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });

  const { data: stockMap = {} } = useQuery<Record<string, number>>({
    queryKey: ["stock"],
    queryFn: fetchStock,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    setSelectedVariantIdx(0);
  }, [slug]);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | AURYX Shop`;
      const el = document.querySelector('meta[name="description"]');
      if (el && product.shortDescription) el.setAttribute("content", product.shortDescription);
    }
  }, [product]);

  const hasVariants = !!(product?.variants && product.variants.length > 1);
  const selectedVariant = hasVariants ? product!.variants![selectedVariantIdx] : null;
  const displayPriceCents = selectedVariant ? selectedVariant.priceCents : (product?.priceCents ?? 0);
  const variantLabel = selectedVariant?.label;

  // Per-variant stock lookup (must be after variantLabel is declared)
  const variantStock = (vLabel: string) => stockMap[`${slug}:${vLabel}`];
  const selectedVariantKey = variantLabel ? `${slug}:${variantLabel}` : slug;
  const selectedStock = selectedVariantKey in stockMap ? stockMap[selectedVariantKey] : undefined;
  const selectedOutOfStock = selectedStock === 0;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      product,
      qty,
      variantLabel,
      selectedVariant ? selectedVariant.priceCents : undefined,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF8" }}>
        <div className="w-7 h-7 rounded-full border-2 border-[#B8962E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
        <div className="text-center">
          <p className="text-[#0A0A0A]/50 mb-4 text-sm">Product not found.</p>
          <Link href="/shop" className="text-[#B8962E] hover:underline text-sm">← Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      {/* Breadcrumb */}
      <div className="pt-32 pb-4 px-6 md:px-12 border-b border-[#E8E8E4]">
        <div className="container mx-auto max-w-7xl">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-[#0A0A0A]/45 hover:text-[#B8962E] transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Shop
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Left — Visual */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-28 self-start"
            >
              <div
                className="relative rounded-3xl overflow-hidden flex items-center justify-center"
                style={{
                  minHeight: 440,
                  background: "linear-gradient(160deg, #F9F5EC 0%, #F2EAD6 55%, #EDE2CB 100%)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 65% 55% at 50% 52%, rgba(201,168,68,0.22) 0%, transparent 68%)" }}
                />
                {PRODUCT_IMAGES[product.slug] ? (
                  <img
                    src={PRODUCT_IMAGES[product.slug]}
                    alt={product.name}
                    className="relative z-10 h-72 w-auto object-contain drop-shadow-2xl"
                  />
                ) : (
                  <PeptideVial category={product.category} />
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                {TRUST_BADGES.map(b => (
                  <div
                    key={b.label}
                    className="bg-white rounded-xl border border-[#E8E8E4] p-3 flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className="text-base">{b.icon}</span>
                    <span className="text-[9px] text-[#0A0A0A]/60 font-medium uppercase tracking-wide leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8962E] font-semibold">{product.category}</span>
                <h1 className="font-serif text-[#0A0A0A] text-4xl md:text-5xl mt-2 mb-4 leading-tight">{product.name}</h1>

                {/* Benefit pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.benefits.slice(0, 4).map((b, i) => (
                    <span
                      key={i}
                      className="bg-[#0A0A0A]/[0.06] text-[#0A0A0A] text-[11px] font-medium px-3 py-1 rounded-full"
                    >
                      {b.split(" ").slice(0, 4).join(" ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Regulatory status notice */}
              {product.regulatoryStatus === "research" && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-0.5">Research Compound</p>
                    <p className="text-xs text-amber-700/70 leading-relaxed">
                      Sold strictly for legitimate scientific research purposes. Not intended for human consumption. Not approved for clinical use in the United States.
                    </p>
                  </div>
                </div>
              )}

              {product.regulatoryStatus === "prescription" && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-0.5">Prescription Protocol</p>
                    <p className="text-xs text-blue-700/70 leading-relaxed">
                      This compound requires a valid prescription. Our clinical team will verify your eligibility before fulfillment.
                    </p>
                  </div>
                </div>
              )}

              {product.requiresConsultation && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-0.5">Consultation Required</p>
                    <p className="text-xs text-amber-700/70 leading-relaxed">
                      This protocol requires a brief physician review before fulfillment. Our clinical team will reach out after your order.
                    </p>
                  </div>
                </div>
              )}

              {/* Purchase Box */}
              <div className="bg-white border border-[#E8E8E4] rounded-2xl p-6 shadow-sm space-y-5">

                {/* Dosage Variant Selector */}
                {hasVariants && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/45 font-medium mb-3">
                      Dosage — <span className="text-[#0A0A0A]/70 normal-case tracking-normal font-semibold">{product.variants![selectedVariantIdx].label}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants!.map((v, i) => (
                        <button
                          key={v.label}
                          onClick={() => setSelectedVariantIdx(i)}
                          disabled={variantStock(v.label) === 0}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                            selectedVariantIdx === i
                              ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-sm"
                              : variantStock(v.label) === 0
                                ? "bg-white/50 text-[#0A0A0A]/25 border-[#D8D4CC]/50 cursor-not-allowed"
                                : "bg-white text-[#0A0A0A]/70 border-[#D8D4CC] hover:border-[#B8962E]/60 hover:text-[#B8962E]"
                          }`}
                        >
                          {v.label}
                          {variantStock(v.label) === 0 && (
                            <span className="ml-1.5 text-[10px] text-red-400/70">Out of Stock</span>
                          )}
                          {v.priceCents !== product.variants![0].priceCents && variantStock(v.label) !== 0 && (
                            <span className={`ml-1.5 text-[11px] ${selectedVariantIdx === i ? "text-white/60" : "text-[#0A0A0A]/40"}`}>
                              ${(v.priceCents / 100).toFixed(0)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cold shipping notice */}
                {product.requiresColdShipping && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                    <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-blue-700">Cold Shipping Included</p>
                      <p className="text-[11px] text-blue-600/80 leading-relaxed mt-0.5">Ships in insulated packaging with gel ice packs at no additional cost.</p>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div>
                  <p className="text-3xl font-semibold text-[#0A0A0A]">
                    ${(displayPriceCents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-[#0A0A0A]/40 mt-0.5">
                    {hasVariants ? "Per vial · Physician-supervised protocol" : "Per protocol unit · Price may vary by dosing"}
                  </p>
                </div>

                {/* Quantity */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/45 font-medium mb-2.5">Quantity</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => setQty(n)}
                        className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                          qty === n
                            ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                            : "border-[#E8E8E4] text-[#0A0A0A]/60 hover:border-[#0A0A0A]/40"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedOutOfStock ? (
                  <div className="w-full py-3.5 rounded-xl bg-[#0A0A0A]/6 border border-[#E8E8E4] flex items-center justify-center gap-2">
                    <span className="text-sm text-[#0A0A0A]/35 font-medium tracking-widest uppercase">Out of Stock</span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={`w-full h-13 py-3.5 rounded-xl text-sm font-medium tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
                      added
                        ? "bg-[#B8962E] text-white"
                        : "bg-[#0A0A0A] text-white hover:bg-[#222]"
                    }`}
                  >
                    {added ? (
                      <><CheckCircle2 className="w-4 h-4" /> Added to Cart</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart — ${((displayPriceCents * qty) / 100).toFixed(2)}</>
                    )}
                  </button>
                )}
              </div>

              {/* Expandable Sections */}
              <div className="border-t border-[#E8E8E4]">
                <Accordion title="Description">
                  <p className="text-sm text-[#0A0A0A]/65 leading-relaxed">{product.fullDescription}</p>
                </Accordion>

                <Accordion title="Primary Benefits">
                  <ul className="space-y-2">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#0A0A0A]/70">
                        <CheckCircle2 className="w-4 h-4 text-[#B8962E] shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Dosing Protocol">
                  {product.regulatoryStatus === "prescription" ? (
                    <>
                      <p className="text-sm text-[#0A0A0A]/65 leading-relaxed">{product.dosingInfo}</p>
                      <p className="text-xs text-[#0A0A0A]/35 mt-3">All dosing confirmed and supervised by your Auryx physician before fulfillment.</p>
                    </>
                  ) : (
                    <div className="bg-[#F5F0E8] rounded-xl p-4">
                      <p className="text-sm text-[#0A0A0A]/65 leading-relaxed">
                        Dosing guidance for this compound is provided privately during your consultation, following review of your health history and research objectives. Specific dosing information is not published publicly in accordance with applicable guidelines.
                      </p>
                      <p className="text-xs text-[#0A0A0A]/35 mt-3">Book a consultation to discuss your protocol with an Auryx physician.</p>
                    </div>
                  )}
                </Accordion>

                {product.physicianNote && (
                  <Accordion title="Physician's Note">
                    <div className="bg-[#F5F0E8] rounded-xl p-4">
                      <p className="text-sm text-[#0A0A0A]/70 italic leading-relaxed">"{product.physicianNote}"</p>
                    </div>
                  </Accordion>
                )}

                {product.coas && product.coas.length > 0 && (
                  <Accordion title="Certificate of Analysis">
                    <div className="space-y-3">
                      {product.coas.map((coa, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#F5F0E8] rounded-xl p-4 gap-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-[#0A0A0A]/80 uppercase tracking-wider">{coa.label}</p>
                            <p className="text-[11px] text-[#0A0A0A]/50 mt-0.5">{coa.lab}</p>
                            <p className="text-[11px] text-[#0A0A0A]/40 mt-0.5">Accession #{coa.accession}</p>
                            {coa.purity && (
                              <p className="text-[11px] text-[#B8962E] font-semibold mt-1">HPLC Purity: {coa.purity}</p>
                            )}
                          </div>
                          <a
                            href={coa.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-[#B8962E] hover:text-[#0A0A0A] transition-colors uppercase tracking-wider"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View COA
                          </a>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#0A0A0A]/30 mt-3 leading-relaxed">
                      All certificates are issued by FDA-registered, ISO-accredited third-party analytical laboratories. Results are independently verifiable via the lab's online verification portals.
                    </p>
                  </Accordion>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
