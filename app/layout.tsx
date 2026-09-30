import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
<<<<<<< HEAD
import CartButton from "./cart-button";
import CartDrawer from "./cart-drawer";
import NavAuth from "./nav-auth";
=======
import CartLink from "./cart-link";
import NavAuth from "./nav-auth";
import SocialLinks from "./social-links";
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
<<<<<<< HEAD
  weight: ["400", "500", "600", "700"],
=======
  weight: ["400", "500", "600"],
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Dream Comfort Furniture India | Luxury Furniture & Direct Selling Opportunity",
  description:
    "India's premier direct selling furniture brand. Handcrafted solid Sheesham & Teak furniture, ergonomic luxury office solutions, and high-yield leadership MLM earnings.",
=======
  title: "DreamComfortFurnitureIndia — Furniture & Interiors",
  description:
    "Handcrafted furniture and interiors, made in India. Shop sofas, dining sets, bedroom and storage furniture.",
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark">
      <body className={`${fraunces.variable} ${inter.variable} font-body bg-navy-900 text-sand-100 min-h-screen flex flex-col antialiased`}>
        <CartProvider>
          {/* Top Announcement Bar */}
          <div className="bg-gradient-to-r from-navy-900 via-teak-dark to-navy-900 border-b border-gold/30 text-xs py-2 px-4 sm:px-8 text-center text-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="inline-block w-2 h-2 rounded-full bg-gold animate-ping" />
              <span>
                ✨ <strong>Join Dream Comfort Direct Sales Network:</strong> Earn up to 25% Direct Bonus + Leadership Rewards & Luxury Car Pool
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium mx-auto sm:mx-0">
              <span className="text-gold flex items-center gap-1">
                <span className="font-bold">₹ INR</span> (Official Direct Selling Member Rates)
              </span>
              <span className="text-slate-500">|</span>
              <a href="tel:+919876543210" className="text-slate-300 hover:text-gold transition-colors">
                Support: +91 98765 43210
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
                    DreamComfort<span className="gold-gradient-text ml-1">Furniture</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-gold/80 block font-sans">
                    India • Direct Selling Network
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
                <Link href="/products" className="hover:text-gold transition-colors">
                  Furniture Catalog
                </Link>
                <Link href="/business-plan" className="hover:text-gold transition-colors flex items-center gap-1">
                  <span>MLM Business Plan</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gold/20 text-gold border border-gold/30">
                    High ROI
                  </span>
                </Link>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
                <Link href="/stores" className="hover:text-gold transition-colors">
                  Franchise & Stores
                </Link>
                <Link href="/dashboard" className="hover:text-gold transition-colors flex items-center gap-1.5 text-gold-accent font-semibold">
                  <span>Distributor Back-Office</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </Link>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <CartButton />

                <div className="hidden sm:flex items-center">
                  <NavAuth />
                </div>

                <Link
                  href="/register"
                  className="px-3.5 sm:px-4 py-2 rounded-lg gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-md shadow-gold/20 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Become a Distributor</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Mobile Nav sub-bar */}
            <div className="flex lg:hidden items-center justify-around gap-2 pt-2.5 mt-2 border-t border-navy-800 text-xs text-slate-300">
              <Link href="/products" className="hover:text-gold py-1">Catalog</Link>
              <Link href="/business-plan" className="text-gold py-1">Business Plan</Link>
              <Link href="/dashboard" className="text-emerald-400 py-1">Dashboard</Link>
              <Link href="/register" className="text-gold-accent py-1">Join MLM</Link>
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
                      DreamComfort<span className="text-gold">Furniture</span> India
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Bridging timeless Indian craftsmanship with revolutionary direct-selling entrepreneurship. 
                    Offering genuine Sheesham & CP Teak furniture, certified ergonomic suites, and financial freedom for our nationwide distributor partners.
                  </p>
                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-gold/20 text-xs text-slate-300 space-y-1">
                    <div className="text-gold font-semibold flex items-center gap-2">
                      <span>✓ Direct Selling Guidelines 2021 Compliant</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Registered Corporate Entity | 100% Legal Binary & Hybrid Compensation Structure | Ministry of Consumer Affairs Compliant.
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

                {/* Direct Selling Plan */}
                <div>
                  <h4 className="font-display text-sm font-semibold text-sand-100 tracking-wider uppercase mb-4">
                    Direct Sales Network
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li><Link href="/business-plan" className="hover:text-gold transition-colors">Compensation Plan</Link></li>
                    <li><Link href="/business-plan#ranks" className="hover:text-gold transition-colors">Leadership Rank Tiers</Link></li>
                    <li><Link href="/dashboard" className="hover:text-gold transition-colors">Distributor Back-Office</Link></li>
                    <li><Link href="/register" className="hover:text-gold transition-colors">Online Distributor KYC</Link></li>
                    <li><Link href="/business-plan#calculator" className="hover:text-gold transition-colors">MLM Earnings Calculator</Link></li>
                  </ul>
                </div>

                {/* Support & Stores */}
                <div>
                  <h4 className="font-display text-sm font-semibold text-sand-100 tracking-wider uppercase mb-4">
                    HQ & Experience Centers
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-400">
                    <p className="flex items-start gap-2">
                      <span className="text-gold">📍</span>
                      <span>Plot 42, Furniture Hub, Visakhapatnam & Hyderabad, India</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gold">📞</span>
                      <span>+91 98765 43210</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gold">✉️</span>
                      <span>support@dreamcomfort.in</span>
                    </p>
                    <div className="pt-2">
                      <Link href="/stores" className="text-xs text-gold underline hover:text-gold-light">
                        Find a Local Franchise Store →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} Dream Comfort Furniture India Ltd. All rights reserved.</p>
                <div className="flex gap-6">
                  <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-slate-400 cursor-pointer">Terms of Distributor Agreement</span>
                  <span className="hover:text-slate-400 cursor-pointer">Direct Selling Code of Ethics</span>
                </div>
              </div>
            </div>
=======
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body`}>
        <CartProvider>
          <div className="swatch-strip" />
          <header className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 md:px-12 py-4 md:py-5 bg-cream">
            <Link href="/" className="font-display text-base sm:text-xl md:text-2xl text-walnut tracking-tight">
              DreamComfort<span className="text-brass">Furniture</span>India
            </Link>
            <SocialLinks />
            <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-charcoal whitespace-nowrap">
              <NavAuth />
            </nav>
          </header>
          {children}
          <footer className="mt-24 border-t border-walnut/10 px-6 md:px-12 py-10 text-sm text-charcoal/70 bg-cream">
            <p className="font-display text-walnut text-lg mb-2">
              DreamComfortFurnitureIndia
            </p>
            <p>Handmade furniture & interiors, shipped across India.</p>
            <p className="mt-4">© {new Date().getFullYear()} DreamComfortFurnitureIndia. All rights reserved.</p>
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}