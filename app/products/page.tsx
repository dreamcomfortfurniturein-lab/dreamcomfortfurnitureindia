"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import products from "@/data/products.json";
import { useCart } from "@/lib/cart-context";

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const { addItem, isMemberPricing, setIsMemberPricing } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCategory && urlCategory !== "All") setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const materials = ["All", "Sheesham", "Teak", "Leatherette", "Acrylic"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchMaterial =
        selectedMaterial === "All" ||
        p.material.toLowerCase().includes(selectedMaterial.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchMaterial && matchPrice && matchSearch;
    });
  }, [selectedCategory, selectedMaterial, maxPrice, searchQuery]);

  function handleShare(slug: string, productName: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://dreamcomfortfurnitureindia.com";
    const refUrl = `${origin}/products/${slug}?ref=DC109283`;
    navigator.clipboard.writeText(refUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-700/80 pb-6">
          <div>
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              Handcrafted Collection
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-1">
              Solid Wood Furniture & Office Suites
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Handcrafted from 100% seasoned CP Teak and Sheesham wood with 10-year warranty.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card p-5 rounded-2xl border border-slate-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input with Icon and Clear button */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gold mb-1.5 flex items-center justify-between">
                <span>🔍 Search Furniture Catalog</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sofa, teak bed, dining, desk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-950/95 border-2 border-slate-700 hover:border-gold/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-gold outline-none shadow-inner transition-colors font-medium"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  🔍
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-sand-100 focus:border-gold outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Material Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Material</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-sand-100 focus:border-gold outline-none"
              >
                {materials.map((m) => (
                  <option key={m} value={m}>{m === "All" ? "All Materials" : m}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Max Price:</span>
                <span className="font-bold text-gold">₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={150000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Results Count & Quick Tags */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>Showing {filteredProducts.length} pieces of luxury Indian furniture</p>
          <div className="flex gap-2">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>●</span> Free White-Glove Installation Nationwide
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const activePrice = isMemberPricing ? p.memberPrice : p.price;
            const isCopied = copiedSlug === p.slug;

            return (
              <div
                key={p.slug}
                className="glass-card rounded-2xl border border-navy-700/80 hover:border-gold/50 overflow-hidden flex flex-col transition-all group shadow-xl"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-[4/3] bg-navy-950 overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-gold text-navy-900 shadow">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="uppercase font-semibold text-gold tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-slate-400">{p.material.split("&")[0]}</span>
                    </div>

                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-display font-bold text-sm text-sand-100 hover:text-gold transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-slate-700/60">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Price:</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-sand-100">
                            ₹{p.price.toLocaleString("en-IN")}
                          </span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ₹{p.mrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          In Stock
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Workshop Direct
                        </span>
                      </div>
                    </div>

                    {/* Action button: Add to Cart */}
                    <div>
                      <button
                        onClick={() =>
                          addItem({
                            slug: p.slug,
                            name: p.name,
                            price: p.price,
                            memberPrice: p.memberPrice,
                            bv: p.bv,
                            pv: p.pv,
                            image: p.images[0],
                          })
                        }
                        className="w-full py-2.5 rounded-lg gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>🛒 Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="bg-navy-900 text-sand-100 min-h-screen py-20 text-center">
        <div className="inline-block animate-spin text-gold text-3xl">⏳</div>
        <p className="text-xs text-slate-400 mt-2">Loading Furniture Catalog...</p>
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}