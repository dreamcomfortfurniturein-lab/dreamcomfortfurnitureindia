"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Visakhapatnam",
    furnitureNeed: "Full Home / Villa Furnishing",
    timeline: "Within 1 Month",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setSubmitted(true);

    const waMsg = `Hi Pranay, I am requesting a furniture consultation:
👤 Name: ${formData.fullName}
📞 Phone: ${formData.phone}
✉️ Email: ${formData.email}
📍 City: ${formData.city}
🛋️ Requirement: ${formData.furnitureNeed}
⏰ Timeline: ${formData.timeline}
${formData.notes ? `📝 Notes: ${formData.notes}` : ""}`;

    window.open(`https://wa.me/919959427831?text=${encodeURIComponent(waMsg)}`, "_blank");
  }

  if (submitted) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8">
        <div className="max-w-xl mx-auto glass-card rounded-2xl p-8 border border-gold/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold border border-gold/30">
            Consultation Request Received!
          </span>
          <h1 className="font-display text-3xl font-bold text-sand-100">
            Thank You, {formData.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Our master craftsman & founder Pranay has received your request. We will connect with you via WhatsApp/call (+91 {formData.phone}) to share custom designs, wood swatches, and direct workshop quotations.
          </p>

          <div className="p-4 bg-navy-950 rounded-xl border border-slate-700 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Your Welcome Voucher Code:</span>
              <span className="text-gold font-bold font-mono text-sm">WELCOME25 (25% OFF)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wood Quality Assurance:</span>
              <span className="text-emerald-400 font-medium">100% Solid Seasoned CP Teak & Sheesham</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Warranty:</span>
              <span className="text-sand-100">10-Year Anti-Termite Guarantee</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow"
            >
              Explore Furniture Catalog →
            </Link>
            <a
              href="https://wa.me/919959427831"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <span>💬 Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">
            Personalized Master Woodwork
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-sand-100">
            Book a Free Furniture Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Furnishing a flat, bungalow, or commercial space? Consult directly with our master artisans for tailored dimensions, wood swatches, and workshop-direct pricing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 rounded-2xl border border-gold/30 shadow-2xl space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">Your Full Name *</label>
              <input
                required
                type="text"
                placeholder="Rahul Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">Mobile Phone (WhatsApp) *</label>
              <input
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">City / Region *</label>
              <input
                required
                type="text"
                placeholder="Visakhapatnam, Hyderabad, Bengaluru..."
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">Furniture You Need</label>
              <select
                value={formData.furnitureNeed}
                onChange={(e) => setFormData({ ...formData, furnitureNeed: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              >
                <option value="Full Home / Villa Furnishing">Full Home / Villa Furnishing</option>
                <option value="Living Room Sofas & Center Tables">Living Room Sofas & Center Tables</option>
                <option value="Handcrafted Teak Bedroom Sets">Handcrafted Teak Bedroom Sets</option>
                <option value="Solid Dining Suites">Solid Dining Suites</option>
                <option value="Modular Kitchens & Wardrobes">Modular Kitchens & Wardrobes</option>
                <option value="Ergonomic Office Desks">Ergonomic Office Desks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sand-200 mb-1">Expected Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
              >
                <option value="Immediate (Within 1-2 Weeks)">Immediate (Within 1-2 Weeks)</option>
                <option value="Within 1 Month">Within 1 Month</option>
                <option value="1-3 Months (House Under Construction)">1-3 Months (House Under Construction)</option>
                <option value="Planning / Exploring Ideas">Planning / Exploring Ideas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-200 mb-1">Specific Requirements or Room Measurements</label>
            <textarea
              rows={3}
              placeholder="E.g. 7-seater L-shape sofa in velvet, 6x6.5 ft king bed in honey teak finish with hydraulic storage..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-gold/20 text-xs text-slate-300 space-y-1">
            <span className="text-gold font-semibold block">🎁 Complimentary Perks Included:</span>
            <p className="text-[11px] text-slate-400">
              ✓ Free 25% Welcome Discount Code (WELCOME25) • Free Sample Wood Swatch Kit • Direct Workshop Pricing Without Middlemen.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <span>✨ Submit & Connect With Master Artisan via WhatsApp</span>
          </button>
        </form>
      </div>
    </main>
  );
}
