"use client";

import { useState } from "react";
import Link from "next/link";

export default function EarningsCalculator() {
  const [personalVolume, setPersonalVolume] = useState<number>(50000); // in INR
  const [directReferrals, setDirectReferrals] = useState<number>(5);
  const [teamVolume, setTeamVolume] = useState<number>(250000); // team BV in INR

  // Calculations based on Direct Selling Compensation Plan
  // 1. Retail / Personal Direct Bonus (up to 20%)
  const retailBonus = Math.round(personalVolume * 0.20);
  // 2. Direct Referral Sponsor Bonus (10% on direct recruits' personal volume)
  const referralBonus = Math.round(directReferrals * 4000);
  // 3. Binary / Matching Team Commission (12% on weaker leg / balanced volume)
  const binaryBonus = Math.round(teamVolume * 0.10);
  // 4. Leadership & Furniture Allowance Pool
  const leadershipBonus = teamVolume >= 200000 ? Math.round(teamVolume * 0.04) : 0;

  const totalMonthlyEarnings = retailBonus + referralBonus + binaryBonus + leadershipBonus;
  const projectedAnnualEarnings = totalMonthlyEarnings * 12;

  // Rank determination
  let currentRank = "Independent Associate";
  let rankBadgeColor = "text-slate-300 border-slate-600 bg-slate-800";
  let perkText = "Retail margin + Direct sponsor bonuses";

  if (teamVolume >= 500000 && directReferrals >= 10) {
    currentRank = "Crown Ambassador";
    rankBadgeColor = "text-amber-300 border-amber-500 bg-amber-950/60";
    perkText = "Luxury Car Allowance (₹50,000/mo) + Global Royalty Pool + 20% Team Match";
  } else if (teamVolume >= 250000 && directReferrals >= 5) {
    currentRank = "Diamond Director";
    rankBadgeColor = "text-cyan-300 border-cyan-500 bg-cyan-950/60";
    perkText = "International Annual Luxury Tour + Home Furniture Allowance + 15% Binary Match";
  } else if (teamVolume >= 100000 && directReferrals >= 3) {
    currentRank = "Gold Leader";
    rankBadgeColor = "text-yellow-300 border-yellow-500 bg-yellow-950/60";
    perkText = "12% Binary Team Commission + Leadership Development Fund";
  } else if (teamVolume >= 50000) {
    currentRank = "Silver Executive";
    rankBadgeColor = "text-gray-300 border-gray-400 bg-gray-800/80";
    perkText = "10% Binary Team Commission + Recognition Pin";
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-gold/30 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teak/20 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gold/15 text-gold text-2xl border border-gold/30">
              📊
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-sand-100">
                Interactive MLM Earnings Simulator
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Estimate your weekly & monthly income from direct furniture sales and team expansion.
              </p>
            </div>
          </div>

          {/* Slider 1: Personal Furniture Sales Volume */}
          <div className="space-y-2 bg-navy-900/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium">Personal Monthly Furniture Sales:</span>
              <span className="font-bold text-gold text-base">
                ₹{personalVolume.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={personalVolume}
              onChange={(e) => setPersonalVolume(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>₹10,000 (Starter)</span>
              <span>₹1,50,000 (Pro)</span>
              <span>₹3,00,000+ (Master Showroom)</span>
            </div>
          </div>

          {/* Slider 2: Number of Direct Distributor Referrals */}
          <div className="space-y-2 bg-navy-900/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium">Personally Sponsored Partners:</span>
              <span className="font-bold text-gold text-base">
                {directReferrals} Active Members
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={directReferrals}
              onChange={(e) => setDirectReferrals(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1 Partner</span>
              <span>10 Partners</span>
              <span>25+ Mega Network</span>
            </div>
          </div>

          {/* Slider 3: Downline Team Business Volume */}
          <div className="space-y-2 bg-navy-900/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-300 font-medium">Total Team Monthly Volume (BV):</span>
              <span className="font-bold text-gold text-base">
                ₹{teamVolume.toLocaleString("en-IN")} BV
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={1000000}
              step={25000}
              value={teamVolume}
              onChange={(e) => setTeamVolume(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>₹25k BV</span>
              <span>₹5,00,000 BV</span>
              <span>₹10,00,000+ BV</span>
            </div>
          </div>
        </div>

        {/* Projected Payout Summary Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-6 rounded-2xl border border-gold/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">Achieved Tier</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${rankBadgeColor}`}>
              👑 {currentRank}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1">Estimated Monthly Commission</p>
            <div className="text-3xl sm:text-4xl font-black gold-gradient-text font-display">
              ₹{totalMonthlyEarnings.toLocaleString("en-IN")}
              <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ month</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              ≈ ₹{projectedAnnualEarnings.toLocaleString("en-IN")} Projected Annual Income
            </p>
          </div>

          {/* Breakdown items */}
          <div className="space-y-2.5 pt-3 border-t border-slate-700/80 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Retail Margin Profit (20%):</span>
              <span className="font-semibold text-sand-100">₹{retailBonus.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Direct Sponsor Referral Bonus:</span>
              <span className="font-semibold text-sand-100">₹{referralBonus.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Binary Team Commission (10%):</span>
              <span className="font-semibold text-sand-100">₹{binaryBonus.toLocaleString("en-IN")}</span>
            </div>
            {leadershipBonus > 0 && (
              <div className="flex justify-between text-amber-300 font-medium">
                <span>Leadership Furniture Pool (4%):</span>
                <span>₹{leadershipBonus.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {/* Highlight perk */}
          <div className="p-3 rounded-lg bg-navy-950/80 border border-gold/20 text-[11px] text-slate-300">
            <span className="font-semibold text-gold block mb-0.5">Tier Benefits:</span>
            {perkText}
          </div>

          <Link
            href="/register"
            className="block w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-center text-sm hover:brightness-110 transition-all shadow-lg shadow-gold/20"
          >
            Start Earning As a Distributor →
          </Link>
        </div>
      </div>
    </div>
  );
}
