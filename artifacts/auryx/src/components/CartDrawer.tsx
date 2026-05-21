import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ background: "#0A0A0A" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#B8962E]" />
                <h2 className="font-serif text-white text-lg tracking-wide">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-[#B8962E] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-white/30 hover:text-white/80 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-10 h-10 text-white/10 mb-4" />
                  <p className="text-white/30 text-sm">Your cart is empty.</p>
                  <button
                    onClick={() => { closeCart(); navigate("/shop"); }}
                    className="mt-4 text-[#B8962E] text-sm hover:underline"
                  >
                    Browse protocols →
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.slug} className="flex gap-4 py-4 border-b border-white/[0.06] last:border-0">
                    {/* Mini vial visual */}
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
                      <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wide">{product.category}</p>
                      {product.requiresConsultation && (
                        <p className="text-[10px] text-amber-400/80 mt-1">Consultation required</p>
                      )}
                      <p className="text-[#B8962E] text-sm font-semibold mt-1.5">
                        ${((product.priceCents * quantity) / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeFromCart(product.slug)}
                        className="text-white/20 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2 border border-white/10 rounded-lg px-2.5 py-1.5">
                        <button
                          onClick={() => updateQuantity(product.slug, quantity - 1)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm text-white w-4 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.slug, quantity + 1)}
                          className="text-white/40 hover:text-white transition-colors"
                          disabled={quantity >= 10}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 shrink-0 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-white/40 uppercase tracking-wider">Subtotal</span>
                  <span className="text-[#B8962E] font-semibold text-xl font-serif">${(totalCents / 100).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-white/25 leading-relaxed">
                  Shipping calculated at checkout. All orders require physician review prior to fulfillment.
                </p>
                <button
                  onClick={() => { closeCart(); navigate("/checkout"); }}
                  className="w-full h-12 bg-[#B8962E] text-white text-sm font-medium tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-[#A07828] transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
