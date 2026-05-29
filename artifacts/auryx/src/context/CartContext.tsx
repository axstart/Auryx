import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, ProductSummary } from "@/types/shop";

function makeCartKey(slug: string, variantLabel?: string): string {
  return variantLabel ? `${slug}:${variantLabel}` : slug;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: ProductSummary, quantity?: number, variantLabel?: string, variantPriceCents?: number) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
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
      if (!stored) return [];
      const parsed = JSON.parse(stored) as CartItem[];
      return parsed.map(item => ({
        ...item,
        cartKey: item.cartKey
          ?? makeCartKey(item.product.slug, item.variantLabel),
      }));
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((
    product: ProductSummary,
    quantity = 1,
    variantLabel?: string,
    variantPriceCents?: number,
  ) => {
    const cartKey = makeCartKey(product.slug, variantLabel);
    setItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i =>
          i.cartKey === cartKey
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      return [...prev, { cartKey, product, quantity, variantLabel, variantPriceCents }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((cartKey: string) => {
    setItems(prev => prev.filter(i => i.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.cartKey !== cartKey));
    } else {
      setItems(prev =>
        prev.map(i => i.cartKey === cartKey ? { ...i, quantity: Math.min(quantity, 10) } : i)
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCents = items.reduce(
    (sum, i) => sum + (i.variantPriceCents ?? i.product.priceCents) * i.quantity,
    0,
  );
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
