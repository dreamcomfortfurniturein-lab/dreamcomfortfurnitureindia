"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import initialOffers from "@/data/offers.json";

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

  useEffect(() => {
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
  }, []);

  function handleCopy(code: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }

  return (
    <main className="min-h-screen bg-navy-900 text-sand-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-gold selection:text-navy-900">
      <div className="max-w-6xl mx-auto space-y-10">
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
                Exclusive Promotional Offers & Updates
              </h1>
              <p className="text-xs sm:text-sm text-sand-300/80 max-w-2xl leading-relaxed">
                Welcome to your private customer rewards hub. Browse active festive discount vouchers, track workshop order milestones, and explore our mastercrafted solid teakwood collections.
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
                href="https://wa.me/919959427831"
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
                Active Promotional Offers & Discount Codes
              </h2>
              <p className="text-xs text-sand-300/70">
                Published directly by our store management for verified clients. Apply codes during checkout.
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
                  className="glass-card rounded-2xl border border-gold/30 p-6 flex flex-col justify-between hover:border-gold transition-all duration-300 shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                        {offer.badge}
                      </span>
                      <span className="text-[11px] text-amber-300 font-mono">
                        Valid till {offer.validUntil}
                      </span>
                    </div>

                    <div className="text-2xl font-display font-extrabold text-white group-hover:text-gold transition-colors">
                      {offer.discount}
                    </div>

                    <h3 className="font-bold text-sm text-sand-100">
                      {offer.title}
                    </h3>

                    <p className="text-xs text-sand-300/80 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="text-[11px] text-sand-300/60 pt-1">
                      Min. Order: ₹{offer.minOrder.toLocaleString("en-IN")} • Category: {offer.category}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gold/15 mt-4 flex items-center justify-between gap-3">
                    <div className="bg-navy-950 border border-gold/40 rounded-xl px-3 py-1.5 font-mono text-xs font-bold text-amber-400 tracking-wider">
                      {offer.code}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(offer.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        copiedCode === offer.code
                          ? "bg-emerald-600 text-white"
                          : "gold-gradient-bg text-navy-900 hover:brightness-110 shadow-md"
                      }`}
                    >
                      {copiedCode === offer.code ? "Code Copied ✓" : "Copy Code"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 2. Order Tracking Timeline Lookup */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-gold/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-sand-50">
                Order Tracking & Craftsmanship Milestones
              </h2>
              <p className="text-xs text-sand-300/70">
                Every solid Sheesham & Teak piece undergoes traditional solar kiln seasoning and hand-finishing.
              </p>
            </div>
            <span className="text-xs text-gold font-mono">Order #DCF-2026-9812</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-navy-950/80 p-4 rounded-xl border border-emerald-500/40 text-center space-y-1">
              <span className="text-xl block">🪵</span>
              <strong className="text-xs text-emerald-400 block font-bold">1. Timber Selection</strong>
              <p className="text-[10px] text-slate-400">100% Seasoned CP Teak Verified</p>
            </div>

            <div className="bg-navy-950/80 p-4 rounded-xl border border-emerald-500/40 text-center space-y-1">
              <span className="text-xl block">🪚</span>
              <strong className="text-xs text-emerald-400 block font-bold">2. Hand-Carved Joinery</strong>
              <p className="text-[10px] text-slate-400">Mortise & Tenon Assembly Complete</p>
            </div>

            <div className="bg-navy-950/80 p-4 rounded-xl border border-amber-500/40 text-center space-y-1">
              <span className="text-xl block">🛡️</span>
              <strong className="text-xs text-amber-300 block font-bold">3. Termite Shield Polish</strong>
              <p className="text-[10px] text-amber-300/80">In Progress (10-Yr Sealant)</p>
            </div>

            <div className="bg-navy-950/40 p-4 rounded-xl border border-slate-700 text-center space-y-1 opacity-60">
              <span className="text-xl block">🚚</span>
              <strong className="text-xs text-slate-300 block font-bold">4. Doorstep Delivery</strong>
              <p className="text-[10px] text-slate-400">Scheduled for White-Glove Setup</p>
            </div>
          </div>
        </section>

        {/* 3. Direct Contact Concierge */}
        <div className="text-center pt-4 pb-8 space-y-2 text-xs text-sand-300/70 border-t border-gold/10">
          <p>
            Need custom dimensions or bespoke interior requests? Contact our master craftsmen at{" "}
            <a href="tel:+919959427831" className="text-gold font-bold hover:underline">
              +91 99594 27831
            </a>{" "}
            or email{" "}
            <a href="mailto:dreamcomfortfurniture.in@gmail.com" className="text-gold font-bold hover:underline">
              dreamcomfortfurniture.in@gmail.com
            </a>
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>•</span>
            <Link href="/products" className="hover:text-gold">Catalog</Link>
            <span>•</span>
            <Link href="/stores" className="hover:text-gold">Showrooms</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-gold">Switch Login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
