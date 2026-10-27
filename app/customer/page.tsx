"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import initialOffers from "@/data/offers.json";
import {
  getCurrentAuthUser,
  generateWelcomeGmailUrl,
  extractFirstName,
  signOutGoogleUser,
  ADMIN_WHATSAPP_NUMBER,
  DCFAuthUser,
} from "@/lib/auth-session";

interface Offer {
  id: string;
  title: string;
  discount: string;
  code: string;
  category: string;
  badge: string;
  description: string;
  validUntil: string;
  minOrder: number;
  active: boolean;
}

export default function CustomerPortalPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);

  useEffect(() => {
    // 1. Load active offers
    try {
      const stored = localStorage.getItem("dcf_customer_offers");
      if (stored) {
        setOffers(JSON.parse(stored));
      } else {
        setOffers(initialOffers);
      }
    } catch {
      setOffers(initialOffers);
    }

    // 2. Load auth user
    function syncAuth() {
      const user = getCurrentAuthUser();
      setAuthUser(user);
    }

    syncAuth();
    window.addEventListener("dcf_auth_change", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("dcf_auth_change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  function handleCopy(code: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }

  const firstName = extractFirstName(authUser?.name || authUser?.email);

  return (
    <main className="min-h-screen bg-navy-900 text-sand-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-gold selection:text-navy-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Customer Portal Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-navy-950 border border-gold/20 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
              ● Customer Rewards & Loyalty Hub
            </span>
            <span className="text-sand-300/70">
              Signed in as: <strong className="text-gold font-semibold">{firstName}</strong>{" "}
              <span className="text-sand-400 font-mono text-[11px]">({authUser?.email || "Guest"})</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/products"
              className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>🛋️</span>
              <span>Shop Collections</span>
            </Link>

            {authUser && (
              <button
                onClick={() => {
                  signOutGoogleUser();
                  window.location.href = "/";
                }}
                className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-red-950/60 text-sand-300 hover:text-red-300 border border-sand-700/50 hover:border-red-500/40 text-xs font-semibold transition-all flex items-center gap-1"
                title="Log Out of Account"
              >
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* WELCOMING MESSAGE SENT TO GMAIL BANNER */}
        {authUser?.email && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-gold/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center text-xl shrink-0 border border-gold/40">
                ✉️
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gold font-bold block">
                  Welcoming Welcome Letter Ready in Gmail
                </span>
                <p className="text-xs sm:text-sm text-sand-100">
                  Exclusive 25% welcome offer code details prepared for <strong className="text-gold font-mono">{authUser.email}</strong>.
                </p>
              </div>
            </div>

            <a
              href={generateWelcomeGmailUrl({
                email: authUser.email,
                name: authUser.name,
              })}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs shrink-0 hover:brightness-110 shadow flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>Open Welcome Letter in Gmail ↗</span>
            </a>
          </div>
        )}

        {/* Customer Portal Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-2xl relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-semibold">
                <span>🛍️</span>
                <span>Customer Loyalty & Offers Portal</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Welcome, {firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-sand-300/80 max-w-2xl leading-relaxed">
                Welcome to your private customer rewards hub. Browse active festive discount vouchers, consult with our master artisans, and explore authentic solid teakwood and sheesham furniture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/products"
                className="gold-gradient-bg text-navy-900 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 text-center transition-all"
              >
                Browse Furniture Catalog →
              </Link>
              <a
                href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20logged%20into%20my%20Dream%20Comfort%20account%20and%20would%20like%20to%20discuss%20custom%20furniture."
                target="_blank"
                rel="noreferrer"
                className="bg-navy-800 text-sand-200 border border-gold/30 hover:border-gold px-5 py-3 rounded-xl text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* 1. Promotional Offers & Festive Updates Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-sand-50">
                Active Furniture Discount Vouchers
              </h2>
              <p className="text-xs text-sand-300/70">
                Apply these codes during checkout to save instantly on handcrafted living, bedroom, and dining sets.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              {offers.filter((o) => o.active).length} Offers Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers
              .filter((o) => o.active)
              .map((offer) => (
                <div
                  key={offer.id}
                  className="glass-card p-6 rounded-3xl border border-gold/30 hover:border-gold transition-all duration-300 shadow-xl bg-navy-900/80 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">
                        {offer.badge}
                      </span>
                      <span className="text-xs text-sand-300/60 font-mono">
                        Valid till {offer.validUntil}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-sand-50 leading-snug group-hover:text-gold transition-colors">
                      {offer.title}
                    </h3>

                    <div className="text-2xl font-black text-amber-300 font-serif tracking-tight">
                      {offer.discount}
                    </div>

                    <p className="text-xs text-sand-300/80 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="text-[11px] text-sand-300/60">
                      Minimum order: ₹{offer.minOrder.toLocaleString()} • Category: {offer.category}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/15 flex items-center justify-between gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-gold/30 font-mono text-xs font-bold text-gold tracking-wider">
                      {offer.code}
                    </div>

                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        copiedCode === offer.code
                          ? "bg-emerald-500 text-navy-900"
                          : "gold-gradient-bg text-navy-900 hover:brightness-110 shadow-md shadow-gold/20"
                      }`}
                    >
                      {copiedCode === offer.code ? "Copied ✓" : "Copy Code"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 2. Furniture Craftsmanship & Quality Protocol */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-gold/20 space-y-6 bg-navy-950/60">
          <div>
            <h2 className="font-display text-2xl font-bold text-sand-50">
              White-Glove Customer Journey
            </h2>
            <p className="text-xs text-sand-300/70">
              Every handcrafted piece follows our strict quality assurance protocol from timber selection to doorstep placement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-navy-900 border border-gold/20 space-y-1.5">
              <span className="text-lg">🪵</span>
              <strong className="text-sand-100 block font-semibold">1. Solar Kiln Seasoning</strong>
              <p className="text-sand-300/70 text-[11px]">
                45-day solar drying ensures 8-10% core moisture, preventing seasonal warping in Indian climates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-900 border border-gold/20 space-y-1.5">
              <span className="text-lg">🪚</span>
              <strong className="text-sand-100 block font-semibold">2. Master Artisan Carving</strong>
              <p className="text-sand-300/70 text-[11px]">
                Traditional mortise-and-tenon joints combined with hand-chiseled floral floral crests.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-900 border border-gold/20 space-y-1.5">
              <span className="text-lg">🛡️</span>
              <strong className="text-sand-100 block font-semibold">3. Anti-Termite Treatment</strong>
              <p className="text-sand-300/70 text-[11px]">
                3-stage chemical vacuum infusion backed by our official 10-Year Anti-Termite Guarantee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-900 border border-gold/20 space-y-1.5">
              <span className="text-lg">🚚</span>
              <strong className="text-sand-100 block font-semibold">4. White-Glove Installation</strong>
              <p className="text-sand-300/70 text-[11px]">
                Doorstep delivery, room placement, and hydraulic assembly handled by our trained carpenters.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Need Help Or Custom Sizes */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-sand-50">
            Have Custom Dimensions or Floor Plan Drawings?
          </h2>
          <p className="text-xs sm:text-sm text-sand-300/80 max-w-xl mx-auto">
            Our master carpenters can custom craft dining tables, wardrobes, beds, and sofas to fit your room dimensions perfectly.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/business-plan"
              className="px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow"
            >
              Request Custom Woodwork Quote →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20have%20floor%20plan%20measurements%20and%20want%20to%20order%20custom%20furniture."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow flex items-center gap-2"
            >
              <span>💬 WhatsApp Master Artisan (9959427831)</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
