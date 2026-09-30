"use client";

import { useState } from "react";

type GiftCategory = "furniture" | "homeneeds" | "interior";

export default function GiftRedemptionSelector() {
  const [openedGift, setOpenedGift] = useState<GiftCategory | null>("furniture");

  const gifts = [
    {
      id: "furniture" as GiftCategory,
      title: "Luxury Solid Wood Furniture",
      tag: "Option 1: Furniture Products",
      icon: "🛋️",
      accentColor: "border-gold from-gold/20 via-navy-950 to-navy-900",
      badgeBg: "bg-gold text-navy-900",
      description:
        "Redeem your full ₹15,000 credit against Handcrafted Sheesham & Teak Maharaja Sofa Sets, Hydraulic Storage King Beds, or Luxury 6-8 Seater Dining Tables at our outlets.",
      perks: [
        "100% ₹15,000 deducted directly from outlet invoice",
        "Grade-A Seasoned CP Teak & Sheesham wood",
        "10-Year anti-termite structure warranty included",
        "White-glove doorstep delivery & assembly",
      ],
      whatsappMsg:
        "Hi Pranay, I want to open the ₹15,000 Furniture Products Gift option for my ID.",
    },
    {
      id: "homeneeds" as GiftCategory,
      title: "Essential Home Needs & Smart Appliances",
      tag: "Option 2: Home Needs & Appliances",
      icon: "📺",
      accentColor: "border-emerald-400 from-emerald-500/20 via-navy-950 to-navy-900",
      badgeBg: "bg-emerald-500 text-white",
      description:
        "Apply your entire ₹15,000 credit toward essential household electronics & appliances: 4K Smart TVs, Split Inverter ACs, Frost-Free Refrigerators, Fully Automatic Washing Machines, Energy-Saving BLDC Ceiling Fans, Water Purifiers & Microwave Ovens.",
      perks: [
        "📺 Smart 4K Ultra-HD TVs & Home Theater Entertainment",
        "❄️ Energy-Efficient 5-Star Split ACs & Air Coolers",
        "🧊 Double-Door Refrigerators & Deep Freezers",
        "🧺 Front/Top-Load Fully Automatic Washing Machines",
        "🌀 Premium BLDC Energy-Saver Fans & Kitchen Appliances",
        "🛡️ Full 100% ₹15,000 voucher deduction with manufacturer warranty",
      ],
      whatsappMsg:
        "Hi Pranay, I want to open the ₹15,000 Essential Home Needs & Appliances Gift option (TV, AC, Fridge, Washing Machine, Fans).",
    },
    {
      id: "interior" as GiftCategory,
      title: "Turnkey Interior Design Services",
      tag: "Option 3: Interior Designs",
      icon: "📐",
      accentColor: "border-cyan-400 from-cyan-500/20 via-navy-950 to-navy-900",
      badgeBg: "bg-cyan-500 text-navy-950",
      description:
        "Redeem your ₹15,000 credit toward modular kitchen design, custom bedroom wardrobe woodwork, false ceiling execution, or 3D residential interior planning.",
      perks: [
        "₹15,000 voucher credited directly into interior project billing",
        "Modular acrylic kitchens with Blum German fittings",
        "Custom 3D interior renders & space planning by architects",
        "Dedicated site supervision & milestone-based warranty",
      ],
      whatsappMsg:
        "Hi Pranay, I want to open the ₹15,000 Interior Design Gift option for my ID.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
          <span>🎁 Exclusive ID Redemption Privilege</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-sand-100">
          The ₹15,000 <span className="gold-gradient-text">Triple Gift Box</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Your ₹15,000 ID fee can be unlocked for any <strong>ONE</strong> of the three exclusive retail gifts below. Select your preferred gift to open and claim it!
        </p>
      </div>

      {/* 3 Gift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gifts.map((gift) => {
          const isOpen = openedGift === gift.id;

          return (
            <div
              key={gift.id}
              onClick={() => setOpenedGift(gift.id)}
              className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 relative overflow-hidden select-none ${
                isOpen
                  ? `${gift.accentColor} bg-gradient-to-b shadow-2xl scale-[1.02] border-gold ring-2 ring-gold/40`
                  : "border-slate-800 bg-navy-950/80 hover:border-slate-700 opacity-75 hover:opacity-100"
              }`}
            >
              {/* Top Ribbon */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${gift.badgeBg}`}>
                  {gift.tag}
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                    isOpen
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                      : "bg-navy-900 text-slate-400 border-slate-700"
                  }`}
                >
                  {isOpen ? "🔓 Gift Opened" : "🎁 Tap to Open"}
                </span>
              </div>

              {/* Gift Icon & Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl filter drop-shadow">{gift.icon}</span>
                  <div>
                    <h4 className="font-display font-bold text-lg text-sand-100 leading-tight">
                      {gift.title}
                    </h4>
                    <span className="text-xs font-mono font-bold text-gold">
                      ₹15,000 Full Value Voucher
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {gift.description}
                </p>

                {/* Unlocked Gift Content */}
                <div className={`pt-3 border-t border-slate-700/60 transition-all ${isOpen ? "block" : "hidden sm:block opacity-60"}`}>
                  <span className="text-[10px] uppercase font-bold text-gold tracking-wider block mb-2">
                    Included in this gift:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {gift.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-gold font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status footer button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                {isOpen ? (
                  <div className="space-y-2">
                    <div className="w-full py-2.5 rounded-xl bg-gold text-navy-900 font-bold text-center text-xs shadow-md">
                      ✓ This Gift is Active & Selected
                    </div>
                    <a
                      href={`https://wa.me/919959427831?text=${encodeURIComponent(gift.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center text-[11px] transition-colors"
                    >
                      💬 Claim This Gift via Pranay (9959427831)
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors"
                  >
                    Open this Gift instead →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Single Gift Rule Notice */}
      <div className="p-4 rounded-xl bg-navy-950/90 border border-gold/30 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <span>
            <strong>Single Redemption Rule:</strong> Each ₹15,000 ID can be redeemed for <strong>only one</strong> category (Furniture Products, Home Needs, OR Turnkey Interior Designs) at our stores to prevent duplicate credit claims.
          </span>
        </div>
        <span className="text-amber-300 font-bold whitespace-nowrap">
          100% Value Back Guarantee
        </span>
      </div>
    </div>
  );
}
