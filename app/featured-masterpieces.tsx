"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import products from "@/data/products.json";

export default function FeaturedMasterpieces() {
  const { addItem, setIsCartDrawerOpen } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [productsList, setProductsList] = useState<any[]>(products);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dcf_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setProductsList(parsed);
      }
    } catch {}

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const signaturePieces = productsList.slice(0, 4);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({
      slug: p.slug,
      name: p.name,
      price: p.price,
      memberPrice: p.memberPrice,
      image: p.images[0],
      material: p.material,
      bv: p.bv,
      pv: p.pv,
    });
    setAddedSlug(p.slug);
    setTimeout(() => {
      setAddedSlug(null);
      setIsCartDrawerOpen(true);
    }, 600);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header with High-Impact Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#1A3A2A] block mb-2">
            FURNITURE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight">
            Handcrafted Solid Wood Masterpieces
          </h2>
          <p className="text-[#555555] text-sm sm:text-base mt-2 max-w-xl">
            Each heirloom creation is individually crafted from solar-kiln dried CP Teak and Sheesham, with a 10-year anti-termite guarantee.
          </p>
        </div>

        <Link
          href="/products"
          className="self-start md:self-end px-6 py-2.5 rounded-full border border-[#1A3A2A] text-[#1A3A2A] hover:bg-[#1A3A2A] hover:text-[#FBFBFA] font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm flex items-center gap-2"
        >
          <span>Browse All Masterpieces</span>
          <span className="text-[#D4AF37]">→</span>
        </Link>
      </div>

      {/* Grid of 4 Masterpieces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {signaturePieces.map((p) => (
          <div
            key={p.slug}
            className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Container with Badges */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1A3A2A]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/40 shadow-sm">
                {p.badge || "Artisan Line"}
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-[#111111] text-[10px] font-bold shadow-sm">
                100% Solid Wood
              </span>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A3A2A] block">
                  {p.category}
                </span>
                <h3 className="font-display font-bold text-base text-[#111111] mt-1 group-hover:text-[#1A3A2A] transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-[#555555] mt-1.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-3 text-[11px] text-stone-600 flex items-center gap-1.5">
                  <span className="text-[#D4AF37]">✦</span>
                  <span className="line-clamp-1">{p.material}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">
                      Workshop Price
                    </span>
                    <span className="text-lg font-black text-[#111111]">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {p.mrp && (
                    <span className="text-xs text-stone-400 line-through">
                      ₹{p.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="py-2 px-3 text-center rounded-full border border-stone-300 text-xs font-semibold text-[#222222] hover:bg-stone-50 transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={addedSlug === p.slug}
                    className="py-2 px-3 text-center rounded-full bg-[#1A3A2A] hover:bg-[#111812] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                  >
                    {addedSlug === p.slug ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
