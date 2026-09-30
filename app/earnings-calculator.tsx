"use client";

import { useState } from "react";
import Link from "next/link";

export default function EarningsCalculator() {
  // Official Compensation Model Rules:
  // 1. Direct Referral Bonus: When a member joins with ₹15,000 package through direct referral -> ₹5,000
  // 2. Matching Pairing Bonus: When Person A and Person B join (one on each leg) and match -> ₹3,000 pairing bonus
  // 3. Retail Furniture Sales: 20% margin on direct furniture sales

  const [directReferrals, setDirectReferrals] = useState<number>(4); // Direct ₹15,000 referrals sponsored
  const [matchingPairs, setMatchingPairs] = useState<number>(6); // Binary matched pairs (Person A Left + Person B Right)
  const [personalFurnitureSales, setPersonalFurnitureSales] = useState<number>(45000); // retail furniture volume in INR

  const DIRECT_BONUS_PER_ID = 5000; // Flat ₹5,000 per direct referral
  const PAIR_MATCHING_BONUS = 3000; // Flat ₹3,000 per matched pair (Left Leg + Right Leg)

  // 1. Direct Referral Bonus (₹5,000 per direct ₹15,000 ID)
  const totalDirectBonus = directReferrals * DIRECT_BONUS_PER_ID;

  // 2. Binary Matching Pairing Bonus (₹3,000 per matched pair of Person A + Person B)
  const totalMatchingBonus = matchingPairs * PAIR_MATCHING_BONUS;

  // 3. Retail Margin on Personal Furniture Orders (20%)
  const retailFurnitureMargin = Math.round(personalFurnitureSales * 0.20);

  // 4. Leadership & Luxury Allowance Pool (Unlocks at 10+ matching pairs)
  const leadershipBonus = matchingPairs >= 10 ? Math.round(matchingPairs * 1500) : 0;

  // Total Earnings
  const totalMonthlyEarnings = totalDirectBonus + totalMatchingBonus + retailFurnitureMargin + leadershipBonus;
  const projectedWeeklyEarnings = Math.round(totalMonthlyEarnings / 4);
  const projectedAnnualEarnings = totalMonthlyEarnings * 12;

  // Total tangible value of furniture credits generated
  const accumulatedFurnitureCredits = directReferrals * 15000;

  // Rank determination based on matching pairs
  let currentRank = "Independent Associate";
  let rankBadgeColor = "text-slate-300 border-slate-600 bg-slate-800";
  let perkText = "₹5,000 Direct Bonus + ₹3,000 Pair Matching + 20% Retail Margin";

  if (matchingPairs >= 25 && directReferrals >= 8) {
    currentRank = "Crown Ambassador";
    rankBadgeColor = "text-amber-300 border-amber-500 bg-amber-950/60";
    perkText = "Luxury Car Allowance (₹50,000/mo) + Royal Villa Pool + Unlimited Pairing";
  } else if (matchingPairs >= 15 && directReferrals >= 6) {
    currentRank = "Diamond Director";
    rankBadgeColor = "text-cyan-300 border-cyan-500 bg-cyan-950/60";
    perkText = "International Dubai Summit + Home Furniture Allowance + ₹3,000/Pair Unlimited";
  } else if (matchingPairs >= 8 && directReferrals >= 4) {
    currentRank = "Gold Leader";
    rankBadgeColor = "text-yellow-300 border-yellow-500 bg-yellow-950/60";
    perkText = "Goa Leadership Retreat + ₹3,000/Pair Matching + Leadership Cash Grant";
  } else if (matchingPairs >= 3) {
    currentRank = "Silver Executive";
    rankBadgeColor = "text-gray-300 border-gray-400 bg-gray-800/80";
    perkText = "Silver Recognition Pin + Fast-Track Pairing Bonuses";
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-gold/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-navy-950/90 via-navy-900/90 to-navy-950/90">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header with ₹15,000 ID Compensation Rules */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gold/15 text-gold text-2xl border border-gold/30">
            📊
          </span>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider mb-1">
              ✨ Official ₹15,000 ID Compensation Model
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-sand-100">
              Interactive MLM Earnings Simulator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Estimate your weekly & monthly income from direct referrals (₹5,000/ID), matching pairs (₹3,000/Pair), and furniture sales.
            </p>
          </div>
        </div>

        {/* Core Rules Callout Card */}
        <div className="bg-navy-950 px-4 py-2.5 rounded-xl border border-gold/40 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="text-center border-r border-slate-800 pr-3">
            <span className="text-[10px] uppercase text-emerald-400 font-bold block">Direct Referral</span>
            <span className="text-sm font-extrabold text-gold font-mono">₹5,000 / ID</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase text-amber-300 font-bold block">Matching Pair</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">₹3,000 / Pair</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Direct Referral Bonus (₹5,000 per ₹15,000 ID) */}
          <div className="space-y-2 bg-navy-900/80 p-4 sm:p-5 rounded-2xl border border-gold/30 shadow-inner">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">01</span>
                <span className="text-sand-100 font-semibold">Direct ₹15,000 Member Referrals:</span>
              </div>
              <span className="font-bold text-gold text-base font-mono">
                {directReferrals} Members → ₹{totalDirectBonus.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              When a new member joins with a <strong>₹15,000 package</strong> through your direct referral, you receive <strong>₹5,000</strong> instant referral bonus.
            </p>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={directReferrals}
              onChange={(e) => setDirectReferrals(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1 Referral (₹5,000)</span>
              <span>12 Referrals (₹60,000)</span>
              <span>25 Referrals (₹1,25,000)</span>
            </div>
          </div>

          {/* Slider 2: Matching Pairing Bonus (₹3,000 per Matched Pair) */}
          <div className="space-y-2 bg-navy-900/80 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 shadow-inner">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">02</span>
                <span className="text-sand-100 font-semibold">Binary Matching Pairs (Person A + Person B):</span>
              </div>
              <span className="font-bold text-emerald-400 text-base font-mono">
                {matchingPairs} Pairs → ₹{totalMatchingBonus.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              When both Person A (Left Leg) and Person B (Right Leg) join and their figures match, you receive an additional <strong>₹3,000 pairing bonus</strong>.
            </p>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={matchingPairs}
              onChange={(e) => setMatchingPairs(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1 Pair (₹3,000)</span>
              <span>25 Pairs (₹75,000)</span>
              <span>50 Pairs (₹1,50,000)</span>
            </div>
          </div>

          {/* Slider 3: Personal Furniture Sales Volume */}
          <div className="space-y-2 bg-navy-900/80 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-inner">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-navy-700 text-slate-300 text-xs font-bold flex items-center justify-center">03</span>
                <span className="text-slate-300 font-semibold">Direct Furniture Sales / Outlet Redemptions:</span>
              </div>
              <span className="font-bold text-amber-300 text-base font-mono">
                ₹{personalFurnitureSales.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Earn 20% direct profit on retail furniture sales and customer showroom orders.
            </p>
            <input
              type="range"
              min={15000}
              max={300000}
              step={5000}
              value={personalFurnitureSales}
              onChange={(e) => setPersonalFurnitureSales(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₹15,000 (Starter)</span>
              <span>₹1,50,000 (Pro)</span>
              <span>₹3,00,000+ (Master Showroom)</span>
            </div>
          </div>
        </div>

        {/* Projected Payout Summary Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-7 rounded-3xl border-2 border-gold/50 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Achieved Leadership Rank</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${rankBadgeColor}`}>
              👑 {currentRank}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-xs text-slate-400">Estimated Monthly Earnings</p>
              <span className="text-xs font-bold text-emerald-400 font-mono">≈ ₹{projectedWeeklyEarnings.toLocaleString("en-IN")} / week</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold gold-gradient-text font-display">
              ₹{totalMonthlyEarnings.toLocaleString("en-IN")}
              <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ month</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1.5 font-medium flex items-center gap-1.5">
              <span>🚀</span>
              <span>₹{projectedAnnualEarnings.toLocaleString("en-IN")} Projected Annual Direct Payout</span>
            </p>
          </div>

          {/* Detailed Earnings Breakdown connected to ₹15,000 ID */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
            <div className="flex justify-between items-center text-slate-300 bg-navy-900/70 p-2.5 rounded-xl border border-gold/30">
              <div>
                <span className="text-sand-100 font-semibold block">Direct Referral Bonus:</span>
                <span className="text-[10px] text-amber-300 font-mono">{directReferrals} IDs × ₹5,000</span>
              </div>
              <span className="font-bold text-gold text-sm font-mono">₹{totalDirectBonus.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300 bg-navy-900/70 p-2.5 rounded-xl border border-emerald-500/30">
              <div>
                <span className="text-sand-100 font-semibold block">Pair Matching Bonus (A + B Leg):</span>
                <span className="text-[10px] text-emerald-400 font-mono">{matchingPairs} Pairs × ₹3,000</span>
              </div>
              <span className="font-bold text-emerald-400 text-sm font-mono">₹{totalMatchingBonus.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300 bg-navy-900/70 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-sand-100 font-semibold block">Retail Furniture Profit (20%):</span>
                <span className="text-[10px] text-slate-400 font-mono">On ₹{personalFurnitureSales.toLocaleString("en-IN")} sales</span>
              </div>
              <span className="font-bold text-sand-100 text-sm font-mono">₹{retailFurnitureMargin.toLocaleString("en-IN")}</span>
            </div>

            {leadershipBonus > 0 && (
              <div className="flex justify-between items-center text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                <div>
                  <span className="font-semibold block">Leadership Royalty Pool:</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Bonus for {matchingPairs} active pairs</span>
                </div>
                <span className="font-bold text-sm font-mono">₹{leadershipBonus.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {/* Hybrid Model Guarantee Card */}
          <div className="p-3.5 rounded-xl bg-navy-950 border border-emerald-500/40 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>🛡️ 100% Value Backing & Security:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every member receives a physical <strong>Bio-Magnetic Kit</strong> immediately upon joining, plus a <strong>100% ₹15,000 furniture credit</strong> for our physical outlets. Total member credit value: <strong>₹{accumulatedFurnitureCredits.toLocaleString("en-IN")}</strong>.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <Link
              href="/register"
              className="block w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-center text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg shadow-gold/20"
            >
              Register ₹15,000 ID & Earn ₹5k / Referral →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20interested%20in%20the%2015000%20ID%20plan%20(₹5,000%20Direct%20Referral%20+%20₹3,000%20Matching%20Bonus)."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center text-xs transition-all shadow"
            >
              💬 WhatsApp Founder Pranay: +91 99594 27831
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
