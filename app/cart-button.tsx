"use client";

import { useCart } from "@/lib/cart-context";

export default function CartButton() {
  const { items, setIsCartDrawerOpen, totalBV } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <button
      onClick={() => setIsCartDrawerOpen(true)}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/80 border border-gold/30 hover:border-gold hover:bg-navy-700/80 text-sand-100 transition-all text-xs font-medium"
      title="View Shopping Cart"
    >
      <span className="text-sm">🛒</span>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-navy-900 font-bold text-[10px] animate-pulse">
          {count}
        </span>
      )}
    </button>
  );
}
