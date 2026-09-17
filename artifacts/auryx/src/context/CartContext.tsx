import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, ProductSummary } from "@/types/shop";
import { trackAddToCart } from "@/lib/analytics";

function makeCartKey(slug: string, variantLabel?: string): string {
  return variantLabel ? `${slug}:${variantLabel}` : slug;
}

const RECONSTITUTION_KIT: ProductSummary = {
  slug: "reconstitution-kit",
  name: "Reconstitution Kit",
  category: "Accessories",
  shortDescription: "Everything you need to safely reconstitute your peptides.",
  priceCents: 3500,
  requiresConsultation: false,
  regulatoryStatus: "standard",
};

const EXEMPT_SLUGS = new Set([
  "reconstitution-kit",
  "tirzepatide-b12-glycine",
  "test-charge",
]);

function isExempt(product: ProductSummary): boolean {
  return EXEMPT_SLUGS.has(product.slug) || product.category === "Accessories";
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
  kitPopupOpen: boolean;
  dismissKitPopup: () => void;
  removeKitAndDismiss: () => void;
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
  const [kitPopupOpen, setKitPopupOpen] = useState(false);

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
    const kitKey = makeCartKey(RECONSTITUTION_KIT.slug);

    // Determine kit need BEFORE setItems so popup triggers correctly
    const needsKit = !isExempt(product) && !items.some(i => i.cartKey === kitKey);

    setItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i =>
          i.cartKey === cartKey
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      const newItems = [...prev, { cartKey, product, quantity, variantLabel, variantPriceCents }];
      if (needsKit) {
        newItems.push({ cartKey: kitKey, product: RECONSTITUTION_KIT, quantity: 1 });
      }
      return newItems;
    });

    if (needsKit) {
      setKitPopupOpen(true);
    }

    const unitPrice = variantPriceCents ?? product.priceCents;
    trackAddToCart({
      slug: product.slug,
      name: product.name,
      priceCents: unitPrice,
      quantity,
    });

    setIsOpen(true);
  }, [items]);

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

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem("auryx_consultation"); } catch {}
  }, []);

  const dismissKitPopup = useCallback(() => setKitPopupOpen(false), []);

  const removeKitAndDismiss = useCallback(() => {
    setItems(prev => prev.filter(i => i.cartKey !== makeCartKey(RECONSTITUTION_KIT.slug)));
    setKitPopupOpen(false);
  }, []);

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
      kitPopupOpen,
      dismissKitPopup,
      removeKitAndDismiss,
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
