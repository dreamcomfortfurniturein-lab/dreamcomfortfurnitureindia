"use client";

import Link from "next/link";

export default function LuxuryFooter() {
  return (
    <footer className="w-full bg-[#111812] text-stone-300 border-t border-[#D4AF37]/30 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-stone-800">
          {/* Brand Description (Col 1 - 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3A2A] to-[#111812] flex items-center justify-center border border-[#D4AF37]/60 shadow-lg shrink-0">
                <span className="text-[#D4AF37] font-display font-bold text-lg">
                  DC
                </span>
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight block">
                  Dream Comfort
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] block font-sans">
                  Furniture India
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Handcrafting timeless solid Sheesham & CP Teak furniture for Indian homes, luxury villas, and architectural spaces. Direct from certified solar-kiln workshops with a 10-year anti-termite guarantee and white-glove doorstep delivery.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#1A3A2A]/40 border border-[#D4AF37]/25 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <span>✓ 100% Solid Seasoned Wood Certified</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Zero MDF or synthetic core boards • Handcrafted with traditional mortise & tenon joinery in Visakhapatnam.
              </p>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-2">
                Follow Our Lookbooks & Builds
              </span>
              <div className="flex items-center gap-3 text-sm">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#1A3A2A] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  📸
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#1A3A2A] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#1A3A2A] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://wa.me/919959427831"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1A3A2A] text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition-colors font-bold"
                  title="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>
          </div>

          {/* Quick Site Links (Col 2 - 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Furniture Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/products?category=Living Room" className="hover:text-[#D4AF37] transition-colors">
                  Living Room Sofas & Tables
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bedroom Sets" className="hover:text-[#D4AF37] transition-colors">
                  Master Bedroom Hydraulic Beds
                </Link>
              </li>
              <li>
                <Link href="/products?category=Handcrafted Solid Teak" className="hover:text-[#D4AF37] transition-colors">
                  Handcrafted Teak Dining Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=Ergonomic Office" className="hover:text-[#D4AF37] transition-colors">
                  Executive Home Office Suites
                </Link>
              </li>
              <li>
                <Link href="/business-plan" className="hover:text-[#D4AF37] transition-colors">
                  Custom Orders & Blueprints
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#D4AF37] transition-colors">
                  View Full Product Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Info (Col 3 - 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Customer Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#queries" className="hover:text-[#D4AF37] transition-colors">
                  Queries & Buying Guide
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  10-Year Anti-Termite Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  Pan-India Delivery & Assembly
                </Link>
              </li>
              <li>
                <Link href="/business-plan" className="hover:text-[#D4AF37] transition-colors">
                  Solid Wood Care & Polish Guide
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#D4AF37] transition-colors">
                  Shopping Cart & Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/customer" className="hover:text-[#D4AF37] transition-colors">
                  Trade & Architect Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Locations in India (Col 4 - 3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Experience Centers & Stores
            </h4>
            <div className="text-xs text-stone-400 space-y-2.5">
              <p className="flex items-start gap-2">
                <span className="text-[#D4AF37] text-sm shrink-0">📍</span>
                <span>
                  <strong className="text-white block">Flagship Experience Center:</strong>
                  Railway New Colony, Opposite HDFC Bank, Above ORA Motors Showroom, Visakhapatnam, Andhra Pradesh
                </span>
              </p>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-amber-300">
                ✦ Upcoming Studios: Jubilee Hills (Hyderabad) • Indiranagar (Bengaluru) • Golf Course Rd (Delhi NCR)
              </div>
              <p className="flex items-center gap-2">
                <span className="text-[#D4AF37]">👤</span>
                <span>Founder & Master Craftsman: <strong>Pranay</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">💬</span>
                <a
                  href="https://wa.me/919959427831"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 text-stone-300 font-semibold transition-colors"
                >
                  WhatsApp: +91 99594 27831 / 93479 65863
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#D4AF37]">✉️</span>
                <a
                  href="mailto:dreamcomfortfurnitureindia@gmail.com"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  dreamcomfortfurnitureindia@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Badges & Trust Accreditations */}
        <div className="py-8 border-b border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-2 text-center md:text-left">
              Secure Indian Payment Modes & 0% Cost EMI Options
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-bold">
                UPI / Google Pay
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-bold">
                PhonePe
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-bold">
                Paytm
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-bold">
                RuPay
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-bold">
                Visa / Mastercard
              </span>
              <span className="px-3 py-1 rounded-md bg-[#1A3A2A] border border-[#D4AF37]/40 text-[#D4AF37] font-bold">
                0% EMI Available
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400 text-center md:text-right">
            <div>
              <span className="block font-bold text-white">100% Insured Transit</span>
              <span className="text-[11px] text-stone-500">Pan-India Doorstep Replacement</span>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div>
              <span className="block font-bold text-white">10-Year Guarantee</span>
              <span className="text-[11px] text-stone-500">Anti-Termite Certified</span>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Policy Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Dream Comfort Furniture India. Handcrafted Solid Wood Luxury. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">10-Year Warranty Terms</span>
            <span className="hover:text-stone-300 cursor-pointer">Pan-India Shipping Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Timber Seasoning Process</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
