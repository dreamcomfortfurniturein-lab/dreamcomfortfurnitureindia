"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Product = {
  slug: string;
  name: string;
  price: number;
  memberPrice?: number;
  bv?: number;
  pv?: number;
  images: string[];
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isMemberPricing } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
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
  }

  if (product.stock === 0) {
    return (
      <button disabled className="w-full bg-slate-800 text-slate-500 py-3 rounded-xl cursor-not-allowed text-xs font-semibold">
        Temporarily Out of Stock
      </button>
    );
  }

  return (
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
      </button>
    </div>
  );
}
