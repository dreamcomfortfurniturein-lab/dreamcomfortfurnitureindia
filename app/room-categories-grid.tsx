"use client";

import Link from "next/link";

interface CategoryCard {
  id: string;
  name: string;
  tagline: string;
  image: string;
  count: string;
  highlights: string[];
  link: string;
}

const categories: CategoryCard[] = [
  {
    id: "living-room",
    name: "Living Room",
    tagline: "Curated Teak Sofas, Loungers & Haveli Center Tables",
    image: "/hero-luxury-living-room.jpg",
    count: "34 Exclusive Pieces",
    highlights: ["Grade-A CP Teak & Sheesham", "Belgian Stain-Resistant Velvet", "10-Year Termite Warranty"],
    link: "/products?category=Living Room",
  },
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    tagline: "Solid Teak Hydraulic Beds & Fluted Nightstands",
    image: "/category-master-bedroom.jpg",
    count: "22 Signature Suites",
    highlights: ["German Gas-Lift Storage", "Acoustic Fluted Headboards", "Kiln-Seasoned Hardwood"],
    link: "/products?category=Bedroom Sets",
  },
  {
    id: "dining-bar",
    name: "Dining & Bar",
    tagline: "8-Seater Hand-Inlaid Tables & Brass Bar Consoles",
    image: "/category-dining-bar.jpg",
    count: "18 Heritage Sets",
    highlights: ["Italian Marble Inlays", "Solid Teakwood Dining Frames", "Architectural Brass Details"],
    link: "/products?category=Handcrafted Solid Teak",
  },
  {
    id: "home-office",
    name: "Home Office",
    tagline: "Executive Teak Desks & Bookshelf Architectures",
    image: "/category-home-office.jpg",
    count: "16 Study Collections",
    highlights: ["Integrated Wire Management", "Traditional Mortise & Tenon", "Ergonomic Posture Support"],
    link: "/products?category=Ergonomic Office",
  },
];

export default function RoomCategoriesGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Section Header with Ultra-Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A3A2A] block mb-2">
            ROOM CATEGORY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight">
            Explore By Category
          </h2>
          <p className="text-[#555555] text-sm sm:text-base mt-2 max-w-xl">
            Thoughtfully planned spatial suites engineered from 100% seasoned solid timber for contemporary Indian homes.
          </p>
        </div>

        <Link
          href="/products"
          className="self-start md:self-end px-6 py-2.5 rounded-full border border-[#1A3A2A] text-[#1A3A2A] hover:bg-[#1A3A2A] hover:text-[#FBFBFA] font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm flex items-center gap-2"
        >
          <span>See All Categories</span>
          <span className="text-[#D4AF37]">→</span>
        </Link>
      </div>

      {/* Grid of 4 High-End Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
            className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Card Image Container with Hover Zoom */}
            <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden bg-stone-900">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Count Pill */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#111111] text-[10px] sm:text-xs font-bold shadow-md border border-[#D4AF37]/40">
                {cat.count}
              </div>

              {/* Floating Name Overlay for Visual Hierarchy */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  Collection
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#F7E7A9] transition-colors drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </div>

            {/* Card Details on Crisp Off-White Plinth */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <p className="text-xs text-[#555555] leading-relaxed mb-4">
                  {cat.tagline}
                </p>

                {/* Micro Features / Chips */}
                <div className="space-y-1.5 pt-1">
                  {cat.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#222222]">
                      <span className="text-[#D4AF37] text-xs leading-none">✦</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#1A3A2A] group-hover:text-[#D4AF37] transition-colors">
                <span>View Full Collection</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
