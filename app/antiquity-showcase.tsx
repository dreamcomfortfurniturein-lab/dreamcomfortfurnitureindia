"use client";

import { useState, useEffect, useRef } from "react";
import {
  ANTIQUITY_CITIES,
  AntiquityCity,
  AntiquityFurnitureItem,
} from "@/data/antiquity-showcase-data";
import { useCart } from "@/lib/cart-context";

export default function AntiquityShowcase() {
  const [selectedCity, setSelectedCity] = useState<AntiquityCity>("Visakhapatnam");
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  const { addItem, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dcf_antiquity_city") as AntiquityCity | null;
      if (stored && ANTIQUITY_CITIES[stored]) {
        setSelectedCity(stored);
      }
    } catch {
      // silent
    }
  }, []);

  const handleCitySelect = (city: AntiquityCity) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("dcf_antiquity_city", city);
    } catch {
      // silent
    }
  };

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentConfig = ANTIQUITY_CITIES[selectedCity];

  const handleAddToCart = (item: AntiquityFurnitureItem) => {
    addItem({
      slug: item.id,
      name: item.name,
      price: item.price,
      memberPrice: Math.round(item.price * 0.8),
      image: item.image,
      material: item.material,
      bv: Math.round(item.price * 0.4),
      pv: Math.round(item.price / 300),
    });
    setAddedItem(item.id);
    setTimeout(() => {
      setAddedItem(null);
      setIsCartDrawerOpen(true);
    }, 600);
  };

  return (
    <section id="antiquity-experience" className="w-full relative bg-[#0B0F0C] text-[#FBFBFA]">
      {/* ============================================================== */}
      {/* STEP 1 (HERO SCREEN): Full-Screen Iconic City Landmark View     */}
      {/* ============================================================== */}
      <div className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Dynamic Landmark Image Background with Fade Transition */}
        <div className="absolute inset-0 z-0">
          <img
            key={currentConfig.landmarkImage}
            src={currentConfig.landmarkImage}
            alt={`${currentConfig.city} - ${currentConfig.landmark}`}
            className="w-full h-full object-cover animate-fadeIn duration-1000 transform scale-100 transition-transform hover:scale-105"
          />
          {/* Subtle Theme-Aware Vignette Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${currentConfig.themeClasses.heroOverlay}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/90" />
        </div>

        {/* Top Controls Bar: City Preference Selector & Live JSON Indicator */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Brand & Bot Status */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="font-semibold text-white">Antiquity Bot:</span>
            <span className="text-[#D4AF37] font-bold">{selectedCity} Configured</span>
          </div>

          {/* Interactive City Selector Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs shadow-xl">
            {(Object.keys(ANTIQUITY_CITIES) as AntiquityCity[]).map((cName) => {
              const isSelected = selectedCity === cName;
              return (
                <button
                  key={cName}
                  onClick={() => handleCitySelect(cName)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-bold transition-all duration-300 text-xs ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#111111] shadow-lg scale-105"
                      : "text-stone-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cName}
                </button>
              );
            })}
          </div>

          {/* Technical JSON Toggle Button */}
          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="px-3.5 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-700 text-[11px] font-mono transition-colors flex items-center gap-1.5"
            title="Inspect Technical JSON Output Schema"
          >
            <span>{"{ }"}</span>
            <span>{showJsonInspector ? "Hide JSON" : "Inspect JSON"}</span>
          </button>
        </div>

        {/* Technical JSON Schema Popover / Inspector */}
        {showJsonInspector && (
          <div className="relative z-30 max-w-4xl mx-auto w-full px-4 my-2">
            <div className="p-4 rounded-2xl bg-[#090D0A]/95 backdrop-blur-xl border border-[#D4AF37]/50 shadow-2xl font-mono text-xs text-stone-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                <span className="text-[#D4AF37] font-bold">
                  Technical JSON Output Payload (Auto-Emitted by Antiquity Bot)
                </span>
                <button
                  onClick={() => setShowJsonInspector(false)}
                  className="text-stone-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] text-emerald-400 p-2 bg-black/60 rounded-xl leading-relaxed">
                {JSON.stringify(currentConfig.jsonPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Center / Bottom Landmark Hero Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 pt-16">
          <div className="max-w-3xl space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${currentConfig.themeClasses.badgeBg}`}
            >
              <span>📍 {selectedCity} Iconic Landmark</span>
              <span>•</span>
              <span>{currentConfig.themeName}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.05]">
              {currentConfig.landmark}
            </h1>

            <p className="text-stone-200 text-sm sm:text-lg max-w-2xl leading-relaxed drop-shadow-md">
              {currentConfig.landmarkSubtitle}. Seamlessly transitioning into our localized heritage antiquity and fine solid timber collection below.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={scrollToCollection}
                className="px-6 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Explore {currentConfig.catalogTitle}</span>
                <span>↓</span>
              </button>

              <a
                href={`https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20exploring%20the%20${selectedCity}%20heritage%20antiquity%20collection.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <span>💬</span>
                <span>Consult Antiquity Curator</span>
              </a>
            </div>
          </div>

          {/* Animated Scroll / Swipe-Up Indicator for All Devices */}
          <div className="pt-10 flex items-center justify-center">
            <button
              onClick={scrollToCollection}
              className="flex flex-col items-center gap-2 text-stone-300 hover:text-[#D4AF37] transition-colors group cursor-pointer"
              aria-label="Scroll down to heritage collection"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] font-bold group-hover:tracking-[0.3em] transition-all">
                Swipe Up / Scroll For Heritage Antiquities
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-stone-400 group-hover:border-[#D4AF37] flex items-start justify-center p-1.5 transition-colors">
                <div className="w-1.5 h-2.5 rounded-full bg-[#D4AF37] animate-bounce" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 2 (CONTENT SECTION): Localized Heritage Furniture Gallery  */}
      {/* ============================================================== */}
      <div
        ref={collectionRef}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-stone-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
              <span>STEP 2: LOCALIZED HERITAGE SHOWCASE</span>
              <span>•</span>
              <span>{selectedCity} COLLECTION</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {currentConfig.catalogTitle}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {currentConfig.catalogSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 font-mono">
              Theme: <strong className="text-white">{currentConfig.themeName}</strong>
            </span>
          </div>
        </div>

        {/* Responsive Gallery Grid: Mobile 1-col, Tablet 2-col, Desktop 4-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {currentConfig.featuredItems.map((item) => (
            <div
              key={item.id}
              className={`group flex flex-col rounded-3xl overflow-hidden bg-[#111812] border border-stone-800 ${currentConfig.themeClasses.cardBorder} shadow-2xl transition-all duration-500 hover:-translate-y-2`}
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/40 shadow-md">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1A3A2A]/90 text-stone-200 text-[10px] font-semibold border border-white/20">
                  {item.dimensions}
                </span>
              </div>

              {/* Item Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block">
                    {item.period}
                  </span>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#F7E7A9] transition-colors line-clamp-1 mt-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-3 text-[11px] text-stone-300 flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">✦</span>
                    <span className="line-clamp-1">{item.material}</span>
                  </div>
                </div>

                {/* Price & Cart Actions */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase font-semibold">
                      Heirloom Value
                    </span>
                    <span className="text-lg font-black text-white">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(
                        item.name
                      )}%20from%20the%20${encodeURIComponent(selectedCity)}%20Antiquity%20Collection.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-stone-900 border border-emerald-600/60 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                      title="WhatsApp Inquiry"
                    >
                      💬
                    </a>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addedItem === item.id}
                      className="px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      {addedItem === item.id ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Curated White-Glove Regional Assurance */}
        <div className="mt-16 p-6 rounded-3xl bg-[#1A3A2A]/30 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-white">
              Pan-India Insured Transit for {selectedCity} Antiquities
            </h4>
            <p className="text-xs text-stone-300">
              Every antique and solid wood piece is transported in high-density foam crates with dedicated in-house carpentry placement.
            </p>
          </div>
          <button
            onClick={() => {
              const nextCity =
                selectedCity === "Visakhapatnam"
                  ? "Vijayawada"
                  : selectedCity === "Vijayawada"
                  ? "Hyderabad"
                  : "Visakhapatnam";
              handleCitySelect(nextCity);
            }}
            className="shrink-0 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold transition-colors"
          >
            Explore Next Landmark City →
          </button>
        </div>
      </div>
    </section>
  );
}
