"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import initialOffers from "@/data/offers.json";
import {
  getCurrentAuthUser,
  getActiveSessionMode,
  setActiveSessionMode,
  submitPartnerAccessRequest,
  getPartnerStatus,
  DCFAuthUser,
  SessionViewMode,
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
  const [sessionMode, setSessionMode] = useState<SessionViewMode>("customer");
  const [partnerRequestModalOpen, setPartnerRequestModalOpen] = useState(false);
  const [partnerPhoneInput, setPartnerPhoneInput] = useState("");
  const [requestSuccessMessage, setRequestSuccessMessage] = useState("");

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

    // 2. Load auth session and check mutual exclusion
    function syncAuthAndMode() {
      const user = getCurrentAuthUser();
      setAuthUser(user);
      const mode = getActiveSessionMode();
      setSessionMode(mode);
    }

    syncAuthAndMode();

    // 3. Listen to cross-tab & in-app session mode transitions
    window.addEventListener("dcf_auth_change", syncAuthAndMode);
    window.addEventListener("dcf_session_mode_change", syncAuthAndMode);
    window.addEventListener("storage", syncAuthAndMode);

    return () => {
      window.removeEventListener("dcf_auth_change", syncAuthAndMode);
      window.removeEventListener("dcf_session_mode_change", syncAuthAndMode);
      window.removeEventListener("storage", syncAuthAndMode);
    };
  }, []);

  function handleCopy(code: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }

  // Handle switching to unlock Customer view
  function handleUnlockCustomerView() {
    setActiveSessionMode("customer");
    setSessionMode("customer");
  }

  // Handle Request Partner Elevation
  function handlePartnerRequest(e: React.FormEvent) {
    e.preventDefault();
    const email = authUser?.email || "customer@gmail.com";
    const name = authUser?.name || email.split("@")[0];
    submitPartnerAccessRequest(email, name, partnerPhoneInput || "+91 99594 27831");
    setPartnerRequestModalOpen(false);
    setRequestSuccessMessage(
      "Partner Access Request submitted! Awaiting approval from Super Admin (dreamcomfortfurniture.in@gmail.com)."
    );
    // Refresh user state
    setAuthUser(getCurrentAuthUser());
  }

  // =========================================================================
  // RULE 4.1: ACTIVE DISTRIBUTOR SESSION MUTUAL EXCLUSION LOCK
  // When user opens/logs into Distributor Page, the Customer Page MUST lock.
  // =========================================================================
  if (sessionMode === "distributor") {
    return (
      <main className="min-h-screen bg-navy-950 text-sand-100 flex items-center justify-center p-4 selection:bg-gold selection:text-navy-900">
        <div className="max-w-lg w-full glass-card p-8 rounded-3xl border border-rose-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden bg-navy-900/95">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-3xl border border-rose-500/40 shadow-lg shadow-rose-500/20">
            🔒
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Session Mutual Exclusion Active
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Customer Portal Locked
            </h1>
            <p className="text-xs sm:text-sm text-sand-300/80 leading-relaxed max-w-md mx-auto">
              An <strong>Active Distributor Session</strong> is currently running in your browser. To prevent operational data contamination and ensure security isolation, simultaneous access to Customer and Distributor views is strictly forbidden.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950 border border-gold/20 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-sand-300/80">
              <span>Authenticated Account:</span>
              <strong className="text-gold font-mono">{authUser?.email || "Logged In"}</strong>
            </div>
            <div className="flex items-center justify-between text-sand-300/80">
              <span>Active Portal Mode:</span>
              <strong className="text-amber-400 font-mono">💼 Distributor Operations</strong>
            </div>
            <div className="pt-2 border-t border-gold/15 text-[11px] text-sand-300/60 leading-relaxed">
              Exiting your distributor view unlocks this customer portal in real-time, allowing you to preview customer storefront updates.
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleUnlockCustomerView}
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
            >
              <span>🔓 Exit Distributor Session & Unlock Customer View</span>
            </button>

            <Link
              href="/dashboard"
              className="block w-full py-3 rounded-xl bg-navy-800 text-sand-200 hover:text-white border border-gold/20 hover:border-gold text-xs font-semibold text-center transition-all"
            >
              Return to Distributor Portal (MLM Back-Office) →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // RULE 4.2: ACTIVE CUSTOMER SESSION (UNLOCKED STOREFRONT)
  // =========================================================================
  const partnerStatus = authUser?.partnerStatus || "unrequested";
  const isApprovedPartner = authUser?.role === "distributor" || authUser?.role === "super_admin";

  return (
    <main className="min-h-screen bg-navy-900 text-sand-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-gold selection:text-navy-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Customer Portal Top Control Bar & Mode Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-navy-950 border border-gold/20 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
              ● Customer Mode Active (Unlocked)
            </span>
            <span className="text-sand-300/70">
              Identity: <strong className="text-sand-100 font-mono">{authUser?.email || "Guest Shopper"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isApprovedPartner ? (
              <button
                onClick={() => {
                  setActiveSessionMode("distributor");
                  setSessionMode("distributor");
                }}
                className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Switches session to Distributor Mode (locks Customer view)"
              >
                <span>💼</span>
                <span>Switch to Distributor Mode</span>
              </button>
            ) : partnerStatus === "pending" ? (
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                ⏳ Partner Approval Pending Admin
              </span>
            ) : (
              <button
                onClick={() => setPartnerRequestModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-gold border border-gold/30 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Request Partner Access</span>
              </button>
            )}
          </div>
        </div>

        {requestSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <span>{requestSuccessMessage}</span>
            <button
              onClick={() => setRequestSuccessMessage("")}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
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
                  className="glass-card p-6 rounded-3xl border border-gold/30 hover:border-gold transition-all duration-300 shadow-xl bg-navy-900/80 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">
                        {offer.badge}
                      </span>
                      <span className="text-xs text-sand-300/60 font-mono">
                        Till {offer.validUntil}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-sand-50 leading-snug group-hover:text-gold transition-colors">
                      {offer.title}
                    </h3>

                    <div className="text-2xl font-black text-gold-accent font-serif tracking-tight">
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

        {/* 2. Furniture Craftsmanship & Order Milestones */}
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
      </div>

      {/* ========================================================================= */}
      {/* MODAL: REQUEST PARTNER / DISTRIBUTOR ELEVATION */}
      {/* ========================================================================= */}
      {partnerRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form
            onSubmit={handlePartnerRequest}
            className="bg-navy-900 border border-gold/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  Request Partner Elevation
                </h3>
                <span className="text-xs text-gold">Elevate from Customer to Distributor</span>
              </div>
              <button
                type="button"
                onClick={() => setPartnerRequestModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-sand-300/80 leading-relaxed">
              Customers can request access to the Partner & Distributor Portal. Access must be approved by Super Admin (<span className="text-gold font-mono">dreamcomfortfurniture.in@gmail.com</span>).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-sand-300/80 mb-1 font-medium">Google Account</label>
                <input
                  type="text"
                  disabled
                  value={authUser?.email || "customer@gmail.com"}
                  className="w-full bg-navy-950 border border-gold/20 rounded-xl px-3 py-2 text-sand-300/60 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-sand-300/80 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={authUser?.name || "Customer Member"}
                  className="w-full bg-navy-950 border border-gold/20 rounded-xl px-3 py-2 text-sand-300/60 text-xs"
                />
              </div>

              <div>
                <label className="block text-sand-300/80 mb-1 font-medium">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={partnerPhoneInput}
                  onChange={(e) => setPartnerPhoneInput(e.target.value)}
                  placeholder="+91 99594 27831"
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs font-mono focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setPartnerRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
