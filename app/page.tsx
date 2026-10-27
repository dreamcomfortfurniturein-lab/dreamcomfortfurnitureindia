import AntiquityShowcase from "./antiquity-showcase";
import HeroHotspotBanner from "./hero-hotspot-banner";
import RoomCategoriesGrid from "./room-categories-grid";
import SpecialRoomsCatalog from "./special-rooms-catalog";
import CraftsmanshipAbout from "./craftsmanship-about";
import FeaturedMasterpieces from "./featured-masterpieces";
import FAQAccordion from "./faq-accordion";
import FurnitureBudgetEstimator from "./earnings-calculator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#FBFBFA] text-[#111111] overflow-hidden">
      {/* 1. ANTIQUITY BOT: DYNAMIC LANDMARK HERO & REGIONAL ANTIQUITY SHOWCASE */}
      <AntiquityShowcase />

      {/* 2. ARCHITECTURAL LIVING ROOM HERO WITH INTERACTIVE HOTSPOT PINS */}
      <HeroHotspotBanner />

      {/* 3. ROOM CATEGORIES GRID (LIVING, BEDROOM, DINING & BAR, HOME OFFICE) */}
      <RoomCategoriesGrid />

      {/* 4. DEDICATED SPECIAL ROOMS (MATERIAL ISOLATION & REGIONAL HUBS) */}
      <SpecialRoomsCatalog />

      {/* 4. CURATED GALLERY & ABOUT OUR STORY (MADE-IN-INDIA CRAFTSMANSHIP) */}
      <CraftsmanshipAbout />

      {/* 4. FEATURED SOLID WOOD MASTERPIECES */}
      <FeaturedMasterpieces />

      {/* 5. TRANSPARENT WORKSHOP PRICING & ESTIMATOR */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A3A2A] block mb-2">
            DIRECT WORKSHOP ESTIMATOR
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Transparent Woodwork Pricing
          </h2>
          <p className="text-[#555555] text-sm mt-2">
            Calculate estimated savings by ordering 100% solid timber direct from our certified solar-kiln workshop without retail showroom markups.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-xl">
          <FurnitureBudgetEstimator />
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <div id="queries">
        <FAQAccordion />
      </div>

      {/* 8. SHOWROOM EXPERIENCE & ARCHITECTURAL CONSULTATION BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1A3A2A] via-[#111812] to-[#1A3A2A] text-white border-t border-[#D4AF37]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wider uppercase">
            Visakhapatnam Experience Center & Pan-India Workshop
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#FBFBFA] leading-tight">
            Ready to Furnish Your Dream Residence?
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Touch and feel our hand-carved solid CP Teak and Sheesham timber, or consult with Master Craftsman Pranay for bespoke dimensions and blueprint commissions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] font-bold text-sm shadow-xl transition-all"
            >
              Explore Full Furniture Catalog →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20would%20like%20to%20discuss%20custom%20solid%20wood%20furniture."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp Showroom (+91 99594 27831)</span>
            </a>
            <Link
              href="/stores"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-stone-500 hover:border-white text-white font-medium text-sm transition-all"
            >
              Showroom Locations & Directions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}