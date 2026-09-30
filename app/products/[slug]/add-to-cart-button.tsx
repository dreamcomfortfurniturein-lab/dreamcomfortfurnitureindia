"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Product = {
  slug: string;
  name: string;
  price: number;
<<<<<<< HEAD
  memberPrice?: number;
  bv?: number;
  pv?: number;
=======
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
  images: string[];
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
<<<<<<< HEAD
  const { addItem, isMemberPricing } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
=======
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
<<<<<<< HEAD
      memberPrice: product.memberPrice,
      bv: product.bv,
      pv: product.pv,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleShareRef() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://dreamcomfort.in";
    const refUrl = `${origin}/products/${product.slug}?ref=DC109283`;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
=======
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
  }

  if (product.stock === 0) {
    return (
<<<<<<< HEAD
      <button disabled className="w-full bg-slate-800 text-slate-500 py-3 rounded-xl cursor-not-allowed text-xs font-semibold">
        Temporarily Out of Stock
=======
      <button disabled className="bg-charcoal/20 text-charcoal/50 px-6 py-3 rounded-sm cursor-not-allowed">
        Out of stock
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
      </button>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAdd}
          className="py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-1.5"
        >
          <span>🛒</span>
          <span>{added ? "Added to Cart ✓" : "Add to Order"}</span>
        </button>

        <button
          onClick={() => {
            handleAdd();
            router.push("/checkout");
          }}
          className="py-3.5 rounded-xl border border-gold/50 text-gold font-bold text-xs sm:text-sm hover:bg-gold/10 transition-all flex items-center justify-center gap-1.5"
        >
          <span>⚡</span>
          <span>Instant Checkout</span>
        </button>
      </div>

      <button
        onClick={handleShareRef}
        className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
          copied
            ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
            : "border-slate-700 text-slate-300 hover:border-gold hover:text-gold"
        }`}
      >
        <span>{copied ? "✓ Referral Link Copied to Clipboard!" : "🔗 Share with Clients & Earn Sponsor Commission"}</span>
=======
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className="bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push("/checkout");
        }}
        className="border border-walnut text-walnut px-6 py-3 rounded-sm hover:bg-linen transition-colors"
      >
        Buy now
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
      </button>
    </div>
  );
}
