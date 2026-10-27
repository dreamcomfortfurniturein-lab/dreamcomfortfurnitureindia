"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  x: number; // percentage from left
  y: number; // percentage from top
  slug: string;
  image: string;
}

const hotspots: Hotspot[] = [
  {
    id: "sofa",
    name: "Aura Curved Solid Teakwood Sofa",
    category: "Living Room",
    price: 84000,
    material: "Grade-A CP Teak & Belgian Sand Velvet",
    x: 37,
    y: 67,
    slug: "royal-sheesham-maharaja-sofa-set",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "table",
    name: "Monolith Fluted Marble & Teak Center Table",
    category: "Living Room",
    price: 38500,
    material: "Italian Carrara Marble & Teak Plinth",
    x: 55,
    y: 79,
    slug: "emperors-8-seater-teak-dining-suite",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "pendant",
    name: "Imperial Brass & Amber Fluted Chandelier",
    category: "Architectural Lighting",
    price: 24500,
    material: "Hand-brushed Solid Brass & Amber Glass",
    x: 52,
    y: 16,
    slug: "royal-sheesham-maharaja-sofa-set",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "chair",
    name: "Verona Minimalist Teak Accent Armchair",
    category: "Accent Seating",
    price: 29900,
    material: "Kiln-Dried CP Teak & Natural Sand Linen",
    x: 88,
    y: 74,
    slug: "royal-sheesham-maharaja-sofa-set",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
  },
];

export default function HeroHotspotBanner() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(hotspots[0]);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addItem, setIsCartDrawerOpen } = useCart();

  const handleAddToCart = (spot: Hotspot) => {
    addItem({
      slug: spot.slug,
      name: spot.name,
      price: spot.price,
      memberPrice: Math.round(spot.price * 0.8),
      image: spot.image,
      material: spot.material,
      bv: Math.round(spot.price * 0.4),
      pv: Math.round(spot.price / 300),
    });
    setAddedItem(spot.id);
    setTimeout(() => {
      setAddedItem(null);
      setIsCartDrawerOpen(true);
    }, 600);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      {/* 1. Header Typography & Intro */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A3A2A]/10 border border-[#1A3A2A]/20 text-[#1A3A2A] text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            Modern Indian Luxury Architecture
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.1]">
            Furniture That Inspires Living
          </h1>
          <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed">
            Direct-from-workshop solid CP Teak and Sheesham wood creations, 
            sculpted with rich minimalist elegance for modern Indian luxury residences.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <Link
            href="/products"
            className="px-6 py-3.5 rounded-full bg-[#1A3A2A] text-[#FBFBFA] font-medium text-sm hover:bg-[#111812] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <span className="text-[#D4AF37]">→</span>
          </Link>
          <a
            href="https://wa.me/919959427831?text=Hello%20Dream%20Comfort,%20I%20would%20like%20to%20consult%20for%20custom%20furniture."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-white border border-[#D4AF37] text-[#111111] font-medium text-sm hover:bg-[#FBFBFA] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span className="text-emerald-700">💬</span>
            <span>Architectural Consultation</span>
          </a>
        </div>
      </div>

      {/* 2. Hero Image Banner with Hotspots */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-900 group">
        <img
          src="/hero-luxury-living-room.jpg"
          alt="Dream Comfort Furniture Luxury Living Room with Solid Teakwood & Emerald Walls"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* 3. Social Proof Badges Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2.5 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-lg text-[#111111] text-xs font-semibold">
            <span className="text-base">🇮🇳</span>
            <span>120k+ Happy Homes Across India</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-lg text-[#111111] text-xs font-semibold">
            <span className="text-[#D4AF37] text-sm">✦</span>
            <span>450+ Premium Designs</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#1A3A2A]/90 backdrop-blur-md border border-[#D4AF37]/50 shadow-lg text-[#FBFBFA] text-xs font-semibold">
            <span className="text-[#D4AF37]">★</span>
            <span className="font-bold">4.9★</span>
            <span className="text-stone-300 font-normal hidden sm:inline">(8,400+ Reviews)</span>
          </div>
        </div>

        {/* 4. Interactive Hotspot Pins */}
        {hotspots.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group/pin"
            >
              {/* Outer pulsing ring */}
              <button
                onClick={() => setActiveHotspot(isSelected ? null : spot)}
                aria-label={`Inspect ${spot.name}`}
                className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125 focus:outline-none"
              >
                <span className="absolute w-8 h-8 rounded-full bg-[#D4AF37]/40 animate-ping pointer-events-none" />
                <span className="w-6 h-6 rounded-full bg-[#1A3A2A] border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-white text-[10px] font-bold">
                  ✦
                </span>
              </button>

              {/* Tooltip Card (Shown on click or active) */}
              {isSelected && (
                <div
                  className={`absolute z-40 w-64 sm:w-72 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl transition-all duration-300 text-left ${
                    spot.x > 60
                      ? "right-0 -translate-x-4 top-8"
                      : spot.x < 30
                      ? "left-0 translate-x-4 top-8"
                      : "left-1/2 -translate-x-1/2 top-8"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A3A2A] bg-[#1A3A2A]/10 px-2 py-0.5 rounded-md">
                      {spot.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 text-xs font-bold leading-none"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-sm text-[#111111] mt-1.5 leading-snug">
                    {spot.name}
                  </h4>
                  <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">
                    {spot.material}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">
                        Direct Workshop Price
                      </span>
                      <span className="text-base font-extrabold text-[#1A3A2A]">
                        ₹{spot.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(spot)}
                      disabled={addedItem === spot.id}
                      className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
                    >
                      {addedItem === spot.id ? (
                        <span>✓ Added</span>
                      ) : (
                        <>
                          <span>+</span>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 5. Bottom Interactive Hint Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 pointer-events-none">
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-xs border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>Click any glowing pin ✦ to view furniture specifications & pricing</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/90 text-[#111111] text-xs font-bold shadow-md ml-auto">
            <span>✨ 100% Solid Seasoned Teak Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
