"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Peela Pranay Tej",
    role: "Managing Director & Founder • Visakhapatnam",
    earnings: "₹6,50,000 / month",
    reward: "Nationwide Furniture Network Visionary",
    quote:
      "At Dream Comfort Furniture, our mission is simple: provide homeowners with genuine, lifetime seasoned teak & sheesham furniture directly from the factory, while unlocking life-changing financial freedom for our distributor partners.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    furnitureImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sunita & Ananya Sharma",
    role: "Diamond Directors • Delhi NCR",
    earnings: "₹2,60,000 / month",
    reward: "Dubai Leadership Retreat Achiever",
    quote:
      "We started sharing Dream Comfort solid teak bedroom packages within our interior design circle. Within 8 months, our binary network grew to over 420 active partners across North India.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    furnitureImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vikramaditya Varma",
    role: "Gold Executive • Visakhapatnam",
    earnings: "₹1,15,000 / month",
    reward: "Home Furniture Makeover Grant",
    quote:
      "The factory-direct pricing without distributor inventory risk allows anyone to start. The customer gets 100% genuine seasoned teak, and we earn transparent, weekly bank payouts.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    furnitureImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80",
  },
];

export default function TestimonialShowcase() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[currentIdx];

  return (
    <div className="relative glass-card rounded-2xl border border-gold/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Testimonial Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/40">
              Verified Distributor Story
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span>●</span> Verified Weekly Payout
            </span>
          </div>

          <p className="text-lg sm:text-xl font-display text-sand-100 italic leading-relaxed">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-700/60">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gold"
            />
            <div>
              <h4 className="font-bold text-sand-100 font-display text-base sm:text-lg">
                {current.name}
              </h4>
              <p className="text-xs text-gold font-medium">{current.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-sand-100 bg-navy-950 px-2 py-0.5 rounded border border-slate-700">
                  {current.earnings}
                </span>
                <span className="text-[11px] text-amber-300">
                  🏆 {current.reward}
                </span>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 pt-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIdx ? "w-8 bg-gold" : "w-2 bg-slate-600 hover:bg-slate-400"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Transformation / Furniture Showcase Photo */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-gold/30 shadow-xl group">
            <img
              src={current.furnitureImage}
              alt="Installed Luxury Furniture"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-navy-900/80 backdrop-blur-sm border border-gold/20 text-xs">
              <span className="text-gold font-semibold block text-[11px]">Real Client Living Room Installation</span>
              <span className="text-slate-300 text-[10px]">Supplied via Dream Comfort Direct Sales Franchise Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
