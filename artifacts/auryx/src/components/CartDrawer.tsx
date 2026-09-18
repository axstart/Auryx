import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/i18n";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();
  const { dict } = useI18n();
  const copy = dict.cart;

  return (
    <Sheet open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) closeCart(); }}>
      <SheetContent
        side="right"
        className="h-[100dvh] w-full max-w-md sm:max-w-md p-0 flex flex-col gap-0 border-white/10 bg-[#0A0A0A] motion-reduce:transition-none [&>button]:hidden"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#B8962E]" />
            <SheetTitle className="font-serif text-white text-lg tracking-wide">{copy.title}</SheetTitle>
            <SheetDescription className="sr-only">{copy.description}</SheetDescription>
            {totalItems > 0 && (
              <span className="bg-[#B8962E] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-white/30 hover:text-white/80 transition-colors motion-reduce:transition-none min-h-11 min-w-11 inline-flex items-center justify-center -mr-3"
            aria-label={copy.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-10 h-10 text-white/10 mb-4" />
              <p className="text-white/30 text-sm">{copy.empty}</p>
              <button
                onClick={() => { closeCart(); navigate("/shop"); }}
                className="mt-4 min-h-11 px-3 text-[#B8962E] text-sm hover:underline"
              >
                {copy.browse}
              </button>
            </div>
          ) : (
            items.map(({ cartKey, product, quantity, variantLabel, variantPriceCents }) => {
              const linePriceCents = variantPriceCents ?? product.priceCents;
              return (
                <div key={cartKey} className="flex gap-4 py-4 border-b border-white/[0.06] last:border-0">
                  <div className="w-12 h-16 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(184,150,46,0.1)" }}>
                    <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
                      <rect x="7" y="1" width="6" height="4" rx="1.5" fill="#B8962E" opacity="0.7" />
                      <rect x="6" y="4" width="8" height="2" rx="0.5" fill="#B8962E" opacity="0.4" />
                      <rect x="4" y="6" width="12" height="22" rx="3" fill="white" opacity="0.15" stroke="#B8962E" strokeWidth="0.5" strokeOpacity="0.4" />
                      <rect x="6" y="8" width="8" height="12" rx="1.5" fill="#B8962E" opacity="0.08" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 leading-tight">{product.name}</p>
                    {variantLabel && (
                      <p className="text-[10px] text-[#B8962E]/80 mt-0.5 font-medium">{variantLabel}</p>
                    )}
                    <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wide">{product.category}</p>
                    {product.slug === "reconstitution-kit" && (
                      <p className="text-[10px] text-white/30 mt-0.5 italic">{copy.autoAdded}</p>
                    )}
                    {product.requiresConsultation && (
                      <p className="text-[10px] text-amber-400/80 mt-1">{copy.consultationRequired}</p>
                    )}
                    <p className="text-[#B8962E] text-sm font-semibold mt-1.5">
                      ${((linePriceCents * quantity) / 100).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeFromCart(cartKey)}
                      className="text-white/20 hover:text-red-400 transition-colors min-h-11 min-w-11 inline-flex items-center justify-center -mr-3 -mt-3"
                      aria-label={`${copy.removeAria} ${product.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-white/10 rounded-lg">
                      <button
                        onClick={() => updateQuantity(cartKey, quantity - 1)}
                        className="text-white/40 hover:text-white transition-colors min-h-11 min-w-11 inline-flex items-center justify-center"
                        aria-label={`${copy.decreaseAria} ${product.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-white w-4 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(cartKey, quantity + 1)}
                        className="text-white/40 hover:text-white transition-colors min-h-11 min-w-11 inline-flex items-center justify-center disabled:opacity-30"
                        disabled={quantity >= 10}
                        aria-label={`${copy.increaseAria} ${product.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="px-4 sm:px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/10 shrink-0 space-y-3 bg-[#0A0A0A]">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-white/40 uppercase tracking-wider">{copy.subtotal}</span>
              <span className="text-[#B8962E] font-semibold text-xl font-serif">${(totalCents / 100).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-white/25 leading-relaxed">{copy.shippingNote}</p>
            <button
              onClick={() => { closeCart(); navigate("/checkout"); }}
              className="w-full min-h-12 bg-[#B8962E] text-white text-sm font-medium tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#A07828] transition-colors motion-reduce:transition-none"
            >
              {copy.checkout} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
