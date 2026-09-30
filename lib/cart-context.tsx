"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

<<<<<<< HEAD
const STORAGE_KEY = "dcf-cart-v2";
=======
const STORAGE_KEY = "dcf-cart";
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e

export type CartItem = {
  slug: string;
  name: string;
  price: number;
<<<<<<< HEAD
  memberPrice?: number;
  bv?: number;
  pv?: number;
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
  image: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
<<<<<<< HEAD
  memberSubtotal: number;
  totalBV: number;
  totalPV: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isMemberPricing: boolean;
  setIsMemberPricing: (active: boolean) => void;
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
<<<<<<< HEAD
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMemberPricing, setIsMemberPricing] = useState(false);
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
<<<<<<< HEAD
      const savedMember = localStorage.getItem("dcf-member-pricing");
      if (savedMember) setIsMemberPricing(JSON.parse(savedMember));
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
<<<<<<< HEAD
      localStorage.setItem("dcf-member-pricing", JSON.stringify(isMemberPricing));
    } catch {
      // storage unavailable
    }
  }, [items, isMemberPricing]);
=======
    } catch {
      // storage unavailable, cart just won't persist
    }
  }, [items]);
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e

  function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
<<<<<<< HEAD
    setIsCartDrawerOpen(true);
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function setQty(slug: string, qty: number) {
<<<<<<< HEAD
    if (qty <= 0) {
      removeItem(slug);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
=======
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
    );
  }

  function clear() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

<<<<<<< HEAD
  const memberSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.memberPrice || i.price * 0.8) * i.qty, 0),
    [items]
  );

  const totalBV = useMemo(
    () => items.reduce((sum, i) => sum + (i.bv || Math.round(i.price * 0.4)) * i.qty, 0),
    [items]
  );

  const totalPV = useMemo(
    () => items.reduce((sum, i) => sum + (i.pv || Math.round(i.price * 0.004)) * i.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        clear,
        subtotal,
        memberSubtotal,
        totalBV,
        totalPV,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isMemberPricing,
        setIsMemberPricing,
      }}
=======
  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clear, subtotal }}
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
