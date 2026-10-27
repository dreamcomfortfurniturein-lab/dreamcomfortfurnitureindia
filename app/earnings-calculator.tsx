"use client";

import { useState } from "react";
import Link from "next/link";

export default function FurnitureBudgetEstimator() {
  const [includeLivingRoom, setIncludeLivingRoom] = useState(true);
  const [includeMasterBed, setIncludeMasterBed] = useState(true);
  const [includeGuestBed, setIncludeGuestBed] = useState(false);
  const [includeDining, setIncludeDining] = useState(true);
  const [woodChoice, setWoodChoice] = useState<"teak" | "sheesham">("teak");

  // Workshop direct prices vs Multi-brand retail showroom estimates
  let workshopTotal = 0;
  let showroomTotal = 0;

  if (includeLivingRoom) {
    workshopTotal += woodChoice === "teak" ? 75000 : 62000;
    showroomTotal += woodChoice === "teak" ? 125000 : 98000;
  }

  if (includeMasterBed) {
    workshopTotal += woodChoice === "teak" ? 55000 : 44000;
    showroomTotal += woodChoice === "teak" ? 89000 : 72000;
  }

  if (includeGuestBed) {
    workshopTotal += woodChoice === "teak" ? 42000 : 34000;
    showroomTotal += woodChoice === "teak" ? 68000 : 54000;
  }

  if (includeDining) {
    workshopTotal += woodChoice === "teak" ? 48000 : 38000;
    showroomTotal += woodChoice === "teak" ? 79000 : 62000;
  }

  const savings = showroomTotal - workshopTotal;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-wider text-gold font-bold">
          Transparent Cost Comparison
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-sand-100">
          Home Furnishing Cost & Workshop Savings Estimator
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          See how much you save by purchasing 100% solid wood furniture directly from our solar-kiln workshop compared to multi-brand commercial retail stores.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-sand-200">
            1. Select Solid Timber Species:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWoodChoice("teak")}
              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                woodChoice === "teak"
                  ? "border-gold bg-gold/15 text-gold shadow-md"
                  : "border-slate-700 bg-navy-950 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="text-sm">👑 100% Solid CP Teak (Sagwan)</div>
              <div className="text-[10px] text-slate-400 mt-1">Rich golden-brown grains, maximum durability</div>
            </button>

            <button
              type="button"
              onClick={() => setWoodChoice("sheesham")}
              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                woodChoice === "sheesham"
                  ? "border-gold bg-gold/15 text-gold shadow-md"
                  : "border-slate-700 bg-navy-950 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="text-sm">🪵 Pure Seasoned Sheesham</div>
              <div className="text-[10px] text-slate-400 mt-1">Dark heartwood, natural rustic elegance</div>
            </button>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-sand-200 pt-2">
            2. Choose Rooms to Furnish:
          </label>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-700 cursor-pointer hover:border-gold/40">
              <input
                type="checkbox"
                checked={includeLivingRoom}
                onChange={(e) => setIncludeLivingRoom(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-semibold text-sand-100">Living Room (7-Seater Royal Sofa + Center Table)</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-700 cursor-pointer hover:border-gold/40">
              <input
                type="checkbox"
                checked={includeMasterBed}
                onChange={(e) => setIncludeMasterBed(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-semibold text-sand-100">Master Bedroom (King Hydraulic Bed + 2 Nightstands)</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-700 cursor-pointer hover:border-gold/40">
              <input
                type="checkbox"
                checked={includeGuestBed}
                onChange={(e) => setIncludeGuestBed(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-semibold text-sand-100">Guest / Kids Bedroom (Queen Solid Wood Bed)</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-700 cursor-pointer hover:border-gold/40">
              <input
                type="checkbox"
                checked={includeDining}
                onChange={(e) => setIncludeDining(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-semibold text-sand-100">Dining Suite (6-Seater Solid Hardwood Table + Chairs)</span>
            </label>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 rounded-2xl bg-navy-950 border border-gold/30 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-gold tracking-widest block">
              Estimated Comparison Summary
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Multi-Brand Retail Showrooms:</span>
                <span className="line-through text-slate-500 font-mono text-sm">
                  ₹{showroomTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-sand-100 font-semibold pt-2 border-t border-slate-800">
                <span>Direct Workshop Price:</span>
                <span className="text-xl font-bold text-gold font-mono">
                  ₹{workshopTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between font-bold text-xs mt-3">
                <span>Your Workshop Savings:</span>
                <span className="text-base text-emerald-400 font-mono">
                  Save ₹{savings.toLocaleString("en-IN")} (~40%)
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <p>✓ 10-Year Anti-Termite Guarantee included with certificate</p>
              <p>✓ Free Pan-India Doorstep Delivery & Carpenter Assembly</p>
              <p>✓ Zero Middleman Distributor Margins or Commissions</p>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/919959427831?text=${encodeURIComponent(`Hi Pranay, I used your budget estimator for a solid ${woodChoice} furniture package (Est: ₹${workshopTotal.toLocaleString("en-IN")}). Please share catalog photos and customizations.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              <span>💬 WhatsApp Master Artisan Pranay (+91 99594 27831)</span>
            </a>

            <Link
              href="/products"
              className="block w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold text-center transition-colors"
            >
              Explore Complete Product Catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
