import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartButton from "./cart-button";
import CartDrawer from "./cart-drawer";
import NavAuth from "./nav-auth";
import HeaderSearch from "./header-search";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "dreamcomfortfurnitureindia | Handcrafted Solid Wood Luxury Furniture",
  description:
    "India's premier solid Sheesham & CP Teak furniture workshop. Discover hand-carved maharaja sofas, solid teak hydraulic beds, dining suites, and ergonomic office furniture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${fraunces.variable} ${inter.variable} font-body bg-navy-900 text-sand-100 min-h-screen flex flex-col antialiased`}>
        <CartProvider>
          {/* Top Announcement Bar - Pure Premium Furniture Delivery & Showrooms */}
          <div className="bg-gradient-to-r from-navy-950 via-teak-dark to-navy-950 border-b border-gold/30 text-xs py-2 px-4 sm:px-8 text-center text-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="inline-block w-2 h-2 rounded-full bg-gold animate-ping" />
              <span>
                ✨ <strong>Direct From Workshop:</strong> Authentic Solid Sheesham & Teak Wood • 10-Year Anti-Termite Guarantee • Nationwide Safe Delivery
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium mx-auto sm:mx-0">
              <span className="text-gold flex items-center gap-1 font-semibold">
                Customer Care & Custom Orders
              </span>
              <span className="text-slate-500">|</span>
              <a href="https://wa.me/919959427831" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                <span>💬 Call / WhatsApp:</span>
                <span>+91 99594 27831</span>
              </a>
            </div>
          </div>

          <div className="swatch-strip" />

          {/* Main Navigation Header */}
          <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-700/80 px-4 sm:px-8 lg:px-12 py-3.5 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teak flex items-center justify-center shadow-lg shadow-gold/20 border border-gold/50 group-hover:scale-105 transition-transform">
                  <span className="text-navy-900 font-bold font-display text-xl leading-none">DC</span>
                </div>
                <div>
                  <div className="font-display font-bold text-lg sm:text-xl tracking-wide text-sand-100 flex items-center">
                    DreamComfortFurnitureIndia
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-gold/80 block font-sans">
                    Handcrafted Luxury Solid Wood Living
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
                <Link href="/products" className="hover:text-gold transition-colors">
                  Furniture Catalog
                </Link>
                <Link href="/stores" className="hover:text-gold transition-colors">
                  Experience Centers
                </Link>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Heritage
                </Link>
                {/* Single Consolidated Partner Portal Menu Item */}
                <Link
                  href="/business-plan"
                  className="px-3 py-1.5 rounded-lg border border-gold/30 hover:border-gold hover:text-gold text-slate-300 flex items-center gap-1.5 transition-all bg-navy-950/60"
                  title="Distributor Network & ₹15,000 Hybrid Partner Program"
                >
                  <span className="text-gold text-xs">✨</span>
                  <span>Partner Portal</span>
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <HeaderSearch />
                <CartButton />

                <div className="hidden sm:flex items-center">
                  <NavAuth />
                </div>

                <Link
                  href="/products"
                  className="px-3.5 sm:px-4 py-2 rounded-lg gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-md shadow-gold/20 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Explore Catalog</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Mobile & Tablet Quick-Access Navigation Bar */}
            <div className="flex lg:hidden items-center justify-between gap-1 pt-2.5 mt-2 border-t border-navy-800 text-xs overflow-x-auto no-scrollbar py-0.5">
              <Link
                href="/products"
                className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-gold hover:bg-navy-800/60 font-medium whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>🛋️</span>
                <span>Furniture</span>
              </Link>
              <Link
                href="/stores"
                className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-gold hover:bg-navy-800/60 font-medium whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>📍</span>
                <span>Stores</span>
              </Link>
              <Link
                href="/about"
                className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-gold hover:bg-navy-800/60 font-medium whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>🪵</span>
                <span>Heritage</span>
              </Link>
              <Link
                href="/business-plan"
                className="px-2.5 py-1.5 rounded-lg text-gold bg-gold/10 border border-gold/30 font-semibold whitespace-nowrap transition-all flex items-center gap-1 hover:bg-gold hover:text-navy-900"
              >
                <span>✨</span>
                <span>Partner Portal</span>
              </Link>
              <div className="sm:hidden flex items-center pl-1 border-l border-navy-800">
                <NavAuth />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1">{children}</div>

          {/* Cart Drawer Modal */}
          <CartDrawer />

          {/* Luxurious Brand Footer */}
          <footer className="border-t border-gold/20 bg-navy-950 text-slate-400 pt-16 pb-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                {/* Brand overview */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center font-bold text-navy-900 font-display">
                      DC
                    </div>
                    <span className="font-display font-bold text-xl text-sand-100">
                      DreamComfortFurnitureIndia
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Handcrafting timeless solid Sheesham & CP Teak furniture for Indian homes and luxury corporate spaces. 
                    Direct from certified solar-kiln workshops with a 10-year anti-termite guarantee and white-glove doorstep delivery.
                  </p>
                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-gold/20 text-xs text-slate-300 space-y-1">
                    <div className="text-gold font-semibold flex items-center gap-2">
                      <span>✓ 100% Solid Seasoned Wood Certified</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Registered Indian Craft Enterprise • 10-Year Anti-Termite Guarantee • Direct Workshop Pricing.
                    </p>
                  </div>
                </div>

                {/* Furniture Collection */}
                <div>
                  <h4 className="font-display text-sm font-semibold text-sand-100 tracking-wider uppercase mb-4">
                    Furniture Collections
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li><Link href="/products?category=Living Room" className="hover:text-gold transition-colors">Living Room Suites</Link></li>
                    <li><Link href="/products?category=Bedroom Sets" className="hover:text-gold transition-colors">Handcrafted Bedroom Sets</Link></li>
                    <li><Link href="/products?category=Handcrafted Solid Teak" className="hover:text-gold transition-colors">Handcrafted Solid Teak</Link></li>
                    <li><Link href="/products?category=Ergonomic Office" className="hover:text-gold transition-colors">Ergonomic Office Desks</Link></li>
                    <li><Link href="/products?category=Modular Kitchens" className="hover:text-gold transition-colors">Modular Island Kitchens</Link></li>
                  </ul>
                </div>

                {/* Partner & Trade Program */}
                <div>
                  <h4 className="font-display text-sm font-semibold text-sand-100 tracking-wider uppercase mb-4">
                    Partner & Trade
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li><Link href="/business-plan" className="hover:text-gold transition-colors">Partner Portal (₹15,000 Model)</Link></li>
                    <li><Link href="/business-plan#hybrid-model" className="hover:text-gold transition-colors">Advance Retail & Wellness Kit</Link></li>
                    <li><Link href="/business-plan#ranks" className="hover:text-gold transition-colors">Leadership Tiers</Link></li>
                    <li><Link href="/dashboard" className="hover:text-gold transition-colors">Distributor Back-Office</Link></li>
                    <li><Link href="/register" className="hover:text-gold transition-colors">Partner ID Registration</Link></li>
                  </ul>
                </div>

                {/* Support & Stores */}
                <div>
                  <h4 className="font-display text-sm font-semibold text-sand-100 tracking-wider uppercase mb-4">
                    Experience Center & Workshop
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-400">
                    <p className="flex items-start gap-2">
                      <span className="text-gold">📍</span>
                      <span>Railway New Colony, Opposite HDFC Bank, Above ORA Motors Showroom, Visakhapatnam, AP</span>
                    </p>
                    <p className="text-[11px] text-amber-300">
                      ★ Upcoming Centers: Hyderabad • Bengaluru • Delhi NCR
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gold">👤</span>
                      <span>Founder & Director: <strong>Pranay</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400">💬</span>
                      <a href="https://wa.me/919959427831" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                        Call / WhatsApp: 9959427831 / 9347965863
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gold">✉️</span>
                      <a href="mailto:dreamcomfortfurnitureindia@gmail.com" className="hover:text-gold transition-colors">
                        dreamcomfortfurnitureindia@gmail.com
                      </a>
                    </p>
                    <div className="pt-2">
                      <Link href="/stores" className="text-xs text-gold underline hover:text-gold-light">
                        View Showrooms & Directions →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} dreamcomfortfurnitureindia. All rights reserved.</p>
                <div className="flex gap-6">
                  <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-slate-400 cursor-pointer">Terms of Distributor Agreement</span>
                  <span className="hover:text-slate-400 cursor-pointer">Direct Selling Code of Ethics</span>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}