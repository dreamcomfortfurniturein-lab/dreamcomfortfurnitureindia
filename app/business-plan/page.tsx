"use client";

import { useState } from "react";
import Link from "next/link";

export default function CustomFurnitureServicesPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Visakhapatnam",
    projectType: "Full Home / Villa Furnishing",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your name and phone number.");
      return;
    }
    setSubmitted(true);

    const waMsg = `Hello Pranay, I am requesting custom furniture / trade pricing:
👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
✉️ Email: ${formData.email}
📍 City: ${formData.city}
📐 Project Type: ${formData.projectType}
${formData.notes ? `📝 Details: ${formData.notes}` : ""}`;

    window.open(`https://wa.me/919959427831?text=${encodeURIComponent(waMsg)}`, "_blank");
  }

  const customServices = [
    {
      icon: "📐",
      title: "Bespoke Room Architecture",
      desc: "Custom dimensions for beds, wardrobes, and modular kitchens designed to fit your room blueprint down to the millimeter.",
    },
    {
      icon: "🪵",
      title: "100% Solid Seasoned Teak & Sheesham",
      desc: "Zero particle board or synthetic MDF. Seasoned through 45-day solar kilns for permanent dimensional stability.",
    },
    {
      icon: "🎨",
      title: "Hand-Rubbed Stains & Fabrics",
      desc: "Choice of warm walnut, natural teak, honey gloss, or matte finishes paired with stain-resistant designer velvets.",
    },
    {
      icon: "🤝",
      title: "Direct Workshop Pricing",
      desc: "Save 40% to 50% compared to luxury retail showrooms because you deal directly with master craftsmen.",
    },
    {
      icon: "🛡️",
      title: "10-Year Anti-Termite Guarantee",
      desc: "Every piece undergoes 3-stage vacuum pressure treatment against wood borers and coastal moisture.",
    },
    {
      icon: "🚚",
      title: "White-Glove Pan-India Delivery",
      desc: "Trained carpenters deliver, assemble, and place your furniture in your room of choice anywhere in India.",
    },
  ];

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase px-3 py-1 rounded-full bg-gold/15 border border-gold/30">
            Workshop Direct • Bespoke Woodwork
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100 leading-tight">
            Custom Solid Wood Furniture for Homes, Villas & Architects
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Skip middleman showroom markups. Order tailored CP Teak and Sheesham suites crafted directly in our solar-kiln facility with white-glove installation across India.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="#custom-form"
              className="px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20"
            >
              Request Custom Quote →
            </a>
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-navy-950 border border-gold/30 text-sand-100 font-semibold text-xs sm:text-sm hover:border-gold transition-colors"
            >
              Browse Standard Catalog
            </Link>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customServices.map((service, i) => (
            <div
              key={i}
              className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all space-y-3"
            >
              <span className="text-3xl block">{service.icon}</span>
              <h3 className="font-display font-bold text-lg text-sand-100">{service.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works Steps */}
        <div className="glass-card p-8 rounded-3xl border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Simple 4-Step Process</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100 mt-1">
              How Custom Furniture Ordering Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-700 space-y-2">
              <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm border border-gold/40">
                1
              </span>
              <h4 className="font-bold text-sand-100 text-sm">Share Floor Plan / Idea</h4>
              <p className="text-slate-400">
                Send your room measurements, inspiration photos, or architect blueprints via WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-700 space-y-2">
              <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm border border-gold/40">
                2
              </span>
              <h4 className="font-bold text-sand-100 text-sm">Material & Quote Approval</h4>
              <p className="text-slate-400">
                Select teak wood stains, velvet/leatherette fabrics, and receive direct workshop quotation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-700 space-y-2">
              <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm border border-gold/40">
                3
              </span>
              <h4 className="font-bold text-sand-100 text-sm">Master Woodworking</h4>
              <p className="text-slate-400">
                Our master carpenters chisel mortise-and-tenon joints and apply 3-stage anti-termite treatment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-700 space-y-2">
              <span className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm border border-gold/40">
                4
              </span>
              <h4 className="font-bold text-sand-100 text-sm">Doorstep Installation</h4>
              <p className="text-slate-400">
                Delivered and assembled in your room with our 10-year official anti-termite warranty card.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Quote Request Form */}
        <div id="custom-form" className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl font-bold text-sand-100">
              Request a Custom Woodwork Quotation
            </h2>
            <p className="text-xs text-slate-400">
              Direct connection with Founder & Master Craftsman Pranay (+91 99594 27831).
            </p>
          </div>

          {submitted ? (
            <div className="glass-card p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-sand-100">
                Request Dispatched Successfully!
              </h3>
              <p className="text-xs text-slate-300">
                We have received your specifications and opened WhatsApp (+91 99594 27831) to assist you with sketches, timber samples, and estimates.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs inline-block"
                >
                  Return to Furniture Catalog →
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-gold/30 shadow-2xl space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Arun Varma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">Mobile Phone *</label>
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
                    placeholder="arun@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">City / State *</label>
                  <input
                    required
                    type="text"
                    placeholder="Visakhapatnam, Hyderabad, etc."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">Project Scope</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
                >
                  <option value="Full Home / Villa Furnishing">Full Home / Villa Furnishing</option>
                  <option value="Living Room Sofas & Center Tables">Living Room Sofas & Center Tables</option>
                  <option value="Teak Hydraulic Beds & Bedroom Sets">Teak Hydraulic Beds & Bedroom Sets</option>
                  <option value="Solid Dining Table & Chairs">Solid Dining Table & Chairs</option>
                  <option value="Architect / Interior Designer Collaboration">Architect / Interior Designer Collaboration</option>
                  <option value="Corporate / Office Desk Suite">Corporate / Office Desk Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">Furniture Dimensions or Notes</label>
                <textarea
                  rows={3}
                  placeholder="Share details like required length, seating capacity, wood stain preference..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-sand-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
              >
                <span>💬 Submit & Open WhatsApp Consultation</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
