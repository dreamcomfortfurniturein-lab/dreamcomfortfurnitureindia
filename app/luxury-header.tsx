"use client";

import { useState } from "react";
import Link from "next/link";
import CartButton from "./cart-button";
import NavAuth from "./nav-auth";
import HeaderSearch from "./header-search";

export default function LuxuryHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(2);
  const [showWishlistToast, setShowWishlistToast] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Antiquity View", href: "#antiquity-experience" },
    { name: "Special Rooms", href: "#special-rooms" },
    { name: "Living Room", href: "/products?category=Living Room" },
    { name: "Bedroom", href: "/products?category=Bedroom Sets" },
    { name: "Custom Orders", href: "/business-plan" },
    { name: "Projects", href: "#craftsmanship" },
    { name: "Contact Us", href: "/stores" },
  ];

  const handleWishlistClick = () => {
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 2500);
  };

  return (
    <>
      {/* Top Announcement Strip in Deep Forest Green */}
      <div className="bg-[#1A3A2A] text-stone-200 border-b border-[#D4AF37]/30 text-[11px] sm:text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping shrink-0" />
            <span className="truncate">
              Direct From Workshop: 100% Solid CP Teak & Sheesham • 10-Yr Guarantee • Pan-India White-Glove Delivery
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0 font-medium">
            <span className="hidden md:inline text-stone-400">Currency: ₹ INR</span>
            <a
              href="https://wa.me/919959427831"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-[#F7E7A9] font-semibold transition-colors flex items-center gap-1"
            >
              <span>💬 Showroom Desk: +91 99594 27831</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-stone-200/90 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1A3A2A] to-[#111812] flex items-center justify-center shadow-md border border-[#D4AF37]/60 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-[#D4AF37] font-display font-bold text-base sm:text-lg tracking-wider">
                DC
              </span>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-xl lg:text-2xl text-[#111111] tracking-tight group-hover:text-[#1A3A2A] transition-colors block leading-tight">
                Dream Comfort
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] block font-sans">
                Furniture India
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#222222]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-[#1A3A2A] relative py-1 transition-colors group/nav"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover/nav:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Search Bar */}
            <HeaderSearch />

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2 rounded-full hover:bg-stone-200/70 text-[#222222] transition-colors"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5 text-[#222222]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#D4AF37] text-[#111111] text-[9px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon / Auth */}
            <div className="flex items-center">
              <NavAuth />
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <CartButton />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#111111] hover:bg-stone-200/60 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FBFBFA] border-t border-stone-200 px-6 py-5 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-200">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-[#111111] hover:bg-stone-100 hover:text-[#1A3A2A]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
              <span>Visit Visakhapatnam Showroom</span>
              <a
                href="https://wa.me/919959427831"
                className="text-emerald-700 font-bold"
              >
                +91 99594 27831
              </a>
            </div>
          </div>
        )}

        {/* Wishlist Notification Toast */}
        {showWishlistToast && (
          <div className="absolute top-full right-6 mt-2 px-4 py-2.5 rounded-xl bg-[#1A3A2A] text-white text-xs font-semibold shadow-xl border border-[#D4AF37]/50 flex items-center gap-2 animate-bounce">
            <span className="text-[#D4AF37]">♥</span>
            <span>You have {wishlistCount} luxury pieces saved in your Wishlist!</span>
          </div>
        )}
      </header>
    </>
  );
}
