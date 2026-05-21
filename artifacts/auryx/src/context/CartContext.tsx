import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, ProductSummary } from "@/types/shop";

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: number;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "auryx_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: ProductSummary, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.slug === product.slug);
      if (existing) {
        return prev.map(i =>
          i.product.slug === product.slug
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.product.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.slug !== slug));
    } else {
      setItems(prev =>
        prev.map(i => i.product.slug === slug ? { ...i, quantity: Math.min(quantity, 10) } : i)
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCents = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalCents, totalItems, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
