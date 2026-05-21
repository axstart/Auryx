import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalCents, totalItems } = useCart();
  const [, navigate] = useLocation();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg text-foreground">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">Your cart is empty.</p>
                  <button
                    onClick={() => { closeCart(); navigate("/shop"); }}
                    className="mt-4 text-primary text-sm hover:underline"
                  >
                    Browse protocols →
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.slug} className="flex gap-4 py-4 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.category}</p>
                      {product.requiresConsultation && (
                        <p className="text-[10px] text-amber-400 mt-1">Consultation required</p>
                      )}
                      <p className="text-primary text-sm font-medium mt-1">
                        ${(product.priceCents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <button onClick={() => removeFromCart(product.slug)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(product.slug, quantity - 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm text-foreground w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.slug, quantity + 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
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
              <div className="px-6 py-5 border-t border-border shrink-0 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">${(totalCents / 100).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Shipping calculated at checkout. All orders require physician review.</p>
                <Button
                  onClick={() => { closeCart(); navigate("/checkout"); }}
                  className="w-full bg-primary text-primary-foreground h-11 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
