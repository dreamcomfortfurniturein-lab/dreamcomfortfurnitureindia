"use client";

import { useState } from "react";
import Link from "next/link";
import EarningsCalculator from "@/app/earnings-calculator";
import GiftRedemptionSelector from "@/app/gift-redemption-selector";

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
      title: "2. Direct Referral Bonus (₹5,000 / ID)",
      desc: "When a new member joins with a ₹15,000 package through your direct referral, you immediately receive a flat ₹5,000 direct commission.",
      payout: "Credited instantly to Distributor e-Wallet / Bank NEFT",
      highlight: "Flat ₹5,000 cash bonus for every ₹15,000 ID registered",
    },
    {
      title: "3. Dual-Team Matching Pairing Bonus (₹3,000 / Pair)",
      desc: "When both Person A (Left Leg) and Person B (Right Leg) join and their figures match, you receive an additional ₹3,000 pairing bonus.",
      payout: "Calculated weekly with auto-flush carryover on greater leg",
      highlight: "₹3,000 per matched pair (Person A + Person B)",
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
      rank: "Star Associate",
      packageReq: "Active ₹15,000 ID",
      pairs: "1 Matched Pair (A + B)",
      directs: "2 Directs (₹10,000 Bonus)",
      pairingIncome: "₹3,000",
      rewards: "Bio-Magnetic Kit + Official IBO Welcome Pin & CRM Access",
      badgeColor: "text-slate-300",
    },
    {
      rank: "Bronze Star Leader",
      packageReq: "Active ₹15,000 ID",
      pairs: "5 Matched Pairs",
      directs: "4 Directs (₹20,000 Bonus)",
      pairingIncome: "₹15,000",
      rewards: "Smart Kitchen Suite / Android Tablet + Bronze Trophy",
      badgeColor: "text-amber-500",
    },
    {
      rank: "Silver Executive",
      packageReq: "Active ₹15,000 ID",
      pairs: "15 Matched Pairs",
      directs: "6 Directs (₹30,000 Bonus)",
      pairingIncome: "₹45,000",
      rewards: "50-inch 4K Smart TV / Luxury Sofa Voucher + Goa 3N/4D Flight Tour",
      badgeColor: "text-slate-200",
    },
    {
      rank: "Gold Director",
      packageReq: "Active ₹15,000 ID",
      pairs: "40 Matched Pairs",
      directs: "8 Directs (₹40,000 Bonus)",
      pairingIncome: "₹1,20,000",
      rewards: "Thailand / Malaysia International Flight Tour + 1.5 Ton Inverter AC",
      badgeColor: "text-yellow-400",
    },
    {
      rank: "Diamond Director",
      packageReq: "Active ₹15,000 ID",
      pairs: "100 Matched Pairs",
      directs: "12 Directs (₹60,000 Bonus)",
      pairingIncome: "₹3,00,000",
      rewards: "Dubai 5-Star Luxury Couple Tour + Royal Teak Master Suite + ₹50k Car Fund",
      badgeColor: "text-cyan-400",
    },
    {
      rank: "Blue Diamond",
      packageReq: "Active ₹15,000 ID",
      pairs: "250 Matched Pairs",
      directs: "15 Directs (₹75,000 Bonus)",
      pairingIncome: "₹7,50,000",
      rewards: "Kia Seltos / Hyundai Creta SUV Downpayment + European Luxury Tour",
      badgeColor: "text-blue-400",
    },
    {
      rank: "Crown Ambassador",
      packageReq: "Active ₹15,000 ID",
      pairs: "600+ Matched Pairs",
      directs: "20 Directs (₹1,00,000 Bonus)",
      pairingIncome: "₹18,00,000+",
      rewards: "Mercedes-Benz / BMW Luxury Car + ₹1,00,000/mo Dream Villa Home Allowance",
      badgeColor: "text-amber-300",
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
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20know%20more%20about%20the%2015000%20Hybrid%20Plan%20of%20Action."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>💬 Contact Pranay (9959427831)</span>
            </a>
          </div>
        </div>

        {/* PROMINENT ₹15,000 HYBRID MODEL & PLAN OF ACTION SHOWCASE */}
        <div id="hybrid-model" className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-gold/60 shadow-2xl bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold border border-gold/40 uppercase tracking-widest">
              Core Hybrid Mechanism
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-sand-100">
              The ₹15,000 ID <span className="gold-gradient-text">Hybrid Advance Retail Model</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Founded & managed by <strong>Pranay</strong> (+91 99594 27831). We have removed all risk associated with conventional direct selling. Every single rupee of your registration fee is anchored in physical wellness products and 100% redeemable furniture value.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-navy-900/80 border border-gold/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-xl border border-gold/40">
                ₹15k
              </div>
              <h3 className="font-display font-bold text-lg text-sand-100">1. ID Registration Cost</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                One-time registration of ₹15,000 establishes your legal Independent Business Owner (IBO) position, back-office access, and dual-team binary placement in our national network.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/80 border border-emerald-500/40 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/40">
                🧲
              </div>
              <h3 className="font-display font-bold text-lg text-sand-100">2. Bio-Magnetic Kit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every member who registers an ID immediately receives a premium physical <strong>Bio-Magnetic Wellness & Sleep Therapy Set</strong>. Provides everyday circulation support, muscular relaxation, and restorative sleep.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/80 border border-gold/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-xl border border-gold/40">
                🛋️
              </div>
              <h3 className="font-display font-bold text-lg text-sand-100">3. 100% Retail Redemption</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your ₹15,000 ID fee is <strong>100% fully redeemable</strong> as a single exclusive gift choice for <strong>Solid Wood Furniture</strong>, <strong>Essential Home Needs & Appliances (TV, AC, Fridge, Washing Machine, Fans)</strong>, OR <strong>Turnkey Interior Design</strong> at Pranay&apos;s outlets.
              </p>
            </div>
          </div>

          {/* Interactive Gift Box Choice */}
          <div className="pt-4 border-t border-slate-800">
            <GiftRedemptionSelector />
          </div>

          {/* Strategic Plan of Action */}
          <div className="bg-navy-950 rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step-by-Step Execution</span>
              <h3 className="font-display text-2xl font-bold text-sand-100 mt-1">
                Distributor Plan of Action: How to Win with ₹15,000 ID
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-gold">PHASE 1</span>
                <h4 className="font-bold text-sm text-sand-100">Connect & Register</h4>
                <p className="text-xs text-slate-400">
                  Call Pranay at 9959427831 to register your ₹15,000 ID. Receive your distributor credentials and back-office tracking portal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400">PHASE 2</span>
                <h4 className="font-bold text-sm text-sand-100">Receive Wellness Kit</h4>
                <p className="text-xs text-slate-400">
                  Take delivery of the physical Bio-Magnetic Kit. Experience the health benefits firsthand or demonstrate to friends and family.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-gold">PHASE 3</span>
                <h4 className="font-bold text-sm text-sand-100">Redeem on Furniture</h4>
                <p className="text-xs text-slate-400">
                  Visit our physical furniture stores. Deduct your full ₹15,000 fee when purchasing sofas, beds, dining, or interior design projects.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400">PHASE 4</span>
                <h4 className="font-bold text-sm text-sand-100">Scale Pairing Bonuses</h4>
                <p className="text-xs text-slate-400">
                  Earn <strong>₹5,000 Direct Referral Bonus</strong> on every ₹15,000 ID + <strong>₹3,000 Matching Bonus</strong> when Person A & Person B match on your Left and Right legs!
                </p>
              </div>
            </div>

            {/* Direct Connect Callout */}
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <span className="text-gold font-bold text-sm block">Ready to discuss your registration or showroom visit?</span>
                Speak directly with Founder Pranay for personalized onboarding and team placements.
              </div>
              <div className="flex gap-2">
                <a
                  href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20register%20my%2015000%20ID."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap"
                >
                  💬 WhatsApp: 9959427831
                </a>
                <a
                  href="tel:9959427831"
                  className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-dark text-navy-900 font-bold text-xs whitespace-nowrap"
                >
                  📞 Call Pranay
                </a>
              </div>
            </div>
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
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-navy-950/80 border-b border-navy-700 text-gold font-display">
                  <th className="py-4 px-5 font-bold">Rank Title</th>
                  <th className="py-4 px-4 font-bold">Qualification</th>
                  <th className="py-4 px-4 font-bold">Matched Pairs (A+B)</th>
                  <th className="py-4 px-4 font-bold">Direct Sponsors</th>
                  <th className="py-4 px-4 font-bold">Pair Matching Income</th>
                  <th className="py-4 px-5 font-bold">Elite Rewards & Luxury Allowances</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60 text-slate-300">
                {ranks.map((r, i) => (
                  <tr
                    key={r.rank}
                    className={`hover:bg-navy-800/40 transition-colors ${
                      i === ranks.length - 1 ? "bg-gold/10 font-semibold border-t-2 border-gold/40" : ""
                    }`}
                  >
                    <td className="py-4 px-5 text-sand-100 font-bold flex items-center gap-2">
                      <span className={r.badgeColor || "text-gold"}>★</span>
                      <span className="font-semibold text-sand-100">{r.rank}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-300">
                      <span className="px-2.5 py-1 rounded-md bg-gold/15 text-gold border border-gold/30">
                        {r.packageReq}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-sand-100">
                      {r.pairs}
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">
                      {r.directs}
                    </td>
                    <td className="py-4 px-4 font-bold text-gold font-mono text-sm">
                      {r.pairingIncome}
                    </td>
                    <td className="py-4 px-5 text-sand-100 font-medium">
                      {r.rewards}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-950/70 border border-gold/20 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold">⚡ Rule Reminder:</span>
              <span>Direct Referral = <strong className="text-sand-100">₹5,000</strong> per ID | Pair Matching (A + B) = <strong className="text-gold">₹3,000</strong> per pair</span>
            </div>
            <div className="text-slate-400 text-xs">
              All ranks cumulative lifetime volume & zero demotions • Contact Pranay: <span className="text-gold font-semibold">+91 99594 27831</span>
            </div>
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
