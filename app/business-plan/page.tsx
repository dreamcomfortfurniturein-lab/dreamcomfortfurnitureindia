"use client";

import { useState } from "react";
import Link from "next/link";
import EarningsCalculator from "@/app/earnings-calculator";

export default function BusinessPlanPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const compensationTiers = [
    {
      title: "1. Retail Profit (20% – 30%)",
      desc: "Earn direct immediate margin by purchasing handcrafted furniture at factory distributor rates and delivering at Maximum Retail Price (MRP).",
      payout: "Instant / Immediate upon sale",
      highlight: "₹10,000 – ₹30,000 profit per luxury bedroom/living set",
    },
    {
      title: "2. Direct Referral Sponsor Bonus (10%)",
      desc: "Whenever you sponsor a new distributor who joins with an Essential or Luxury starter package, receive a direct sponsor commission.",
      payout: "Credited instantly to Distributor e-Wallet",
      highlight: "Flat ₹4,000 to ₹12,000 per sponsored business partner",
    },
    {
      title: "3. Dual-Team Binary Commission (10% – 12%)",
      desc: "Build a Left and Right distribution leg. Earn 10% to 12% matching volume on the balanced BV of your lesser-producing team, with overflow spillover.",
      payout: "Calculated weekly with auto-flush carryover on greater leg",
      highlight: "Up to ₹5,00,000 weekly binary cap for Crown Ambassadors",
    },
    {
      title: "4. Generational Leadership Matching Bonus",
      desc: "Earn 5% matching bonus on the total team binary earnings of distributors up to 5 generations deep in your personal enrollment tree.",
      payout: "Monthly Leadership Cycle",
      highlight: "Unlocks at Gold Executive & higher",
    },
    {
      title: "5. Dream Home & Luxury Car Allowance Pool",
      desc: "2% of the company's total nationwide furniture BV is distributed monthly among Diamond Directors and Crown Ambassadors for vehicle/home EMIs.",
      payout: "Monthly direct NEFT disbursement",
      highlight: "₹50,000/mo Luxury Car Fund + ₹1,00,000/mo Dream Villa Fund",
    },
  ];

  const ranks = [
    {
      rank: "Associate",
      personalBV: "2,000 BV",
      teamBV: "—",
      directs: "1 Active",
      binaryRate: "8%",
      matchingBonus: "—",
      rewards: "Wholesale Margin Access & Back-Office CRM",
    },
    {
      rank: "Silver Executive",
      personalBV: "5,000 BV",
      teamBV: "50,000 BV",
      directs: "2 Active",
      binaryRate: "10%",
      matchingBonus: "Gen 1 (5%)",
      rewards: "Silver Trophy & ₹10,000 Tech Gadget Grant",
    },
    {
      rank: "Gold Leader",
      personalBV: "10,000 BV",
      teamBV: "1,50,000 BV",
      directs: "4 Active",
      binaryRate: "11%",
      matchingBonus: "Gen 1-2 (5%)",
      rewards: "Goa 3N/4D Leadership Summit & ₹25,000 Cash",
    },
    {
      rank: "Diamond Director",
      personalBV: "20,000 BV",
      teamBV: "4,00,000 BV",
      directs: "6 Active",
      binaryRate: "12%",
      matchingBonus: "Gen 1-3 (5%, 4%, 3%)",
      rewards: "Dubai 5-Star International Tour + Luxury Car Fund",
    },
    {
      rank: "Crown Ambassador",
      personalBV: "35,000 BV",
      teamBV: "10,00,000 BV",
      directs: "10 Active",
      binaryRate: "12%",
      matchingBonus: "Gen 1-5 (Full Deep Match)",
      rewards: "BMW Luxury Sedan + ₹1,00,000/mo Royal Villa Allowance",
    },
  ];

  function handleDownloadBrochure() {
    // Generate simulated PDF brochure download
    const dummyPdfContent = "DREAM COMFORT FURNITURE INDIA - OFFICIAL DIRECT SELLING COMPENSATION PLAN 2026\nMinistry of Consumer Affairs Compliant\nVisit: https://dreamcomfort.in";
    const blob = new Blob([dummyPdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DreamComfort_MLM_Business_Plan_2026.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold">
            <span>👑 Official Direct Selling Compensation Model</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            The Dream Comfort <span className="gold-gradient-text">Leadership Business Plan</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Engineered specifically for the Indian luxury furniture market. Combine high-ticket retail commissions with a sustainable, hybrid binary-unilevel structure that pays generous weekly bonuses.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleDownloadBrochure}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-dark text-navy-900 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
            >
              <span>📄 {downloadSuccess ? "Brochure Downloaded!" : "Download Official Plan (PDF)"}</span>
            </button>
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl border border-gold/40 text-sand-100 font-semibold text-xs sm:text-sm hover:bg-navy-800 transition-colors"
            >
              Register as Distributor Today →
            </Link>
          </div>
        </div>

        {/* 5-Stream Compensation Breakdown */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Revenue Streams</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100 mt-1">
              5 Ways to Earn With Every Piece of Furniture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compensationTiers.map((tier, idx) => (
              <div
                key={tier.title}
                className="glass-card rounded-2xl p-6 border border-navy-700/80 hover:border-gold/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs mb-3 border border-gold/30">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-lg text-sand-100 mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 text-xs space-y-1">
                  <div className="text-emerald-400 font-semibold">
                    {tier.highlight}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Frequency: {tier.payout}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Rank Chart Table */}
        <div className="space-y-6" id="ranks">
          <div className="text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Career Roadmap</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100 mt-1">
              Leadership Rank Advancement & Rewards Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear milestone qualifications with zero demotion of achieved lifetime recognition titles.
            </p>
          </div>

          <div className="glass-card rounded-2xl border border-navy-700 overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-navy-950/80 border-b border-navy-700 text-gold font-display">
                  <th className="py-4 px-5 font-bold">Rank Title</th>
                  <th className="py-4 px-4 font-bold">Personal BV</th>
                  <th className="py-4 px-4 font-bold">Lesser Team BV</th>
                  <th className="py-4 px-4 font-bold">Direct Sponsors</th>
                  <th className="py-4 px-4 font-bold">Binary %</th>
                  <th className="py-4 px-5 font-bold">Elite Rewards & Allowances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {ranks.map((r, i) => (
                  <tr
                    key={r.rank}
                    className={`hover:bg-navy-800/40 transition-colors ${
                      i === ranks.length - 1 ? "bg-gold/5 font-semibold" : ""
                    }`}
                  >
                    <td className="py-4 px-5 text-sand-100 font-bold flex items-center gap-2">
                      <span className="text-gold">★</span>
                      <span>{r.rank}</span>
                    </td>
                    <td className="py-4 px-4">{r.personalBV}</td>
                    <td className="py-4 px-4 text-emerald-400 font-mono">{r.teamBV}</td>
                    <td className="py-4 px-4">{r.directs}</td>
                    <td className="py-4 px-4 font-bold text-gold">{r.binaryRate}</td>
                    <td className="py-4 px-5 text-sand-100 font-medium">
                      {r.rewards}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded Calculator */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Income Projection</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100 mt-1">
              Estimate Your Weekly & Monthly Commissions
            </h2>
          </div>
          <EarningsCalculator />
        </div>

        {/* Compliance & Code of Ethics Notice */}
        <div className="p-6 rounded-2xl bg-navy-950 border border-slate-700/80 text-xs text-slate-400 space-y-2">
          <h4 className="font-bold text-sand-100 text-sm flex items-center gap-2">
            <span>🛡️ Indian Direct Selling Compliance Assurance</span>
          </h4>
          <p>
            Dream Comfort Furniture India operates strictly in accordance with the Consumer Protection (Direct Selling) Rules, 2021 notified by the Government of India. We do NOT charge any enrollment fee or mandatory subscription. All commissions are purely generated from genuine commercial sales of certified furniture and home decor products. Distributors enjoy a 30-day buy-back cooling-off policy.
          </p>
        </div>
      </div>
    </main>
  );
}
