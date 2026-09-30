"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    panNumber: "",
    aadhaarNumber: "",
    sponsorId: "DC109283",
    placementLeg: "Auto-Balance",
    starterPackage: "hybrid-15k",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [agreedCompliance, setAgreedCompliance] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const packages = [
    {
      id: "hybrid-15k",
      name: "Flagship Hybrid Advance Retail ID (Recommended)",
      price: 15000,
      bv: 7500,
      pv: 75,
      features: [
        "Physical Bio-Magnetic Wellness & Sleep Therapy Kit included",
        "100% ₹15,000 fully redeemable as 1 Gift Choice: Furniture, Home Needs (TV, AC, Fridge, Washing Machine, Fans), OR Interior Design",
        "Active Independent Distributor ID + Back-Office Portal",
        "₹5,000 Direct Referral Bonus + ₹3,000 Pairing Bonus",
        "Personal Guidance & Placement by Founder Pranay (9959427831)",
      ],
      recommended: true,
    },
    {
      id: "essential",
      name: "Essential Home Furniture Kit",
      price: 18500,
      bv: 9250,
      pv: 95,
      features: [
        "1 Solid Sheesham Coffee Table or Study Unit",
        "Lifetime Distributor Wholesale Portal Access",
        "Official 3D AR Living Room Visualizer App",
        "Direct Sponsor Link & Back-Office CRM",
      ],
    },
    {
      id: "luxury",
      name: "Royal Teakwood Signature Set",
      price: 54000,
      bv: 27000,
      pv: 270,
      features: [
        "Choice of King Teak Bed OR 6-Seater Dining Table",
        "Fast-Track Silver Executive Qualification",
        "10-Year Termite & Structure Warranty Certificate",
        "Priority White-Glove Dispatch & Sample Wood Swatch Kit",
      ],
    },
    {
      id: "freereg",
      name: "Direct Selling Member (Zero Kit)",
      price: 0,
      bv: 0,
      pv: 0,
      features: [
        "Direct Selling Guidelines 2021 Compliant Free Join",
        "Retail Customer Sharing Rights",
        "Accumulate BV within 30 days to activate binary match",
      ],
    },
  ];

  function handleSendOtp() {
    if (!formData.phone || formData.phone.length < 10) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setOtpSent(true);
  }

  function handleVerifyOtp() {
    if (otpCode === "1234" || otpCode.length >= 4) {
      setOtpVerified(true);
    } else {
      alert("Enter 4-digit test OTP (e.g. 1234)");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your mobile number with OTP first.");
      return;
    }
    if (!agreedCompliance) {
      alert("Please accept the Direct Selling Guidelines Code of Conduct.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8">
        <div className="max-w-xl mx-auto glass-card rounded-2xl p-8 border border-gold/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold border border-gold/30">
            KYC Verification Submitted
          </span>
          <h1 className="font-display text-3xl font-bold text-sand-100">
            Welcome to Dream Comfort, {formData.fullName}!
          </h1>
          <div className="p-4 bg-navy-950 rounded-xl border border-slate-700 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Distributor ID:</span>
              <span className="text-gold font-bold font-mono">DC{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sponsor ID:</span>
              <span className="text-sand-100 font-mono">{formData.sponsorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Starter Package:</span>
              <span className="text-emerald-400 font-medium capitalize">{formData.starterPackage} Pack</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">KYC Status (PAN & Aadhaar):</span>
              <span className="text-amber-300 font-semibold">Under Direct Verification</span>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            A confirmation SMS with your back-office login credentials has been sent to +91 {formData.phone}.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow"
            >
              Go to Distributor Dashboard →
            </Link>
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl border border-slate-600 text-xs font-medium hover:bg-navy-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">
            Distributor Onboarding Flow
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-sand-100">
            Independent Business Owner (IBO) Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            100% compliant with Indian Direct Selling Rules 2021. Provide mandatory KYC details to activate commission payouts.
          </p>
        </div>

        {/* Highlighted Banner for ₹15,000 Hybrid Registration */}
        <div className="glass-card p-5 rounded-2xl border border-gold/50 bg-gradient-to-r from-navy-950 via-teak-dark/40 to-navy-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-2xl border border-gold/40 shrink-0">
              💎
            </div>
            <div>
              <h4 className="font-display font-bold text-sm sm:text-base text-sand-100">
                Registering for the ₹15,000 Hybrid ID?
              </h4>
              <p className="text-xs text-slate-300">
                Receive the physical Bio-Magnetic Wellness Kit + 100% ₹15,000 retail credit for future furniture shopping.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20filling%20the%20registration%20form%20for%20the%2015000%20ID%20and%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>💬 Founder Pranay: +91 99594 27831</span>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Sponsor Information */}
          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-4">
            <h3 className="font-display font-bold text-base text-sand-100 flex items-center gap-2">
              <span className="text-gold">01</span>
              <span>Sponsor & Team Placement</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sponsor Distributor Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.sponsorId}
                  onChange={(e) => setFormData({ ...formData, sponsorId: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-amber-300 font-mono outline-none focus:border-gold"
                  placeholder="e.g. DC109283"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  ✓ Verified Sponsor: Vikramaditya Varma (Diamond Director)
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Binary Tree Placement Leg
                </label>
                <select
                  value={formData.placementLeg}
                  onChange={(e) => setFormData({ ...formData, placementLeg: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                >
                  <option value="Auto-Balance">Auto-Balance (Recommended for max team spillover)</option>
                  <option value="Left Leg">Left Distribution Leg</option>
                  <option value="Right Leg">Right Distribution Leg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & KYC Details */}
          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-4">
            <h3 className="font-display font-bold text-base text-sand-100 flex items-center gap-2">
              <span className="text-gold">02</span>
              <span>Personal & Government KYC Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Legal Name (as on PAN card)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                />
              </div>

              {/* Mobile Phone with OTP */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mobile Number (for OTP & Payout SMS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2 rounded-lg bg-navy-800 border border-gold/40 text-gold text-xs font-semibold hover:bg-navy-700 whitespace-nowrap"
                  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>

                {otpSent && !otpVerified && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter OTP (e.g. 1234)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-navy-950 border border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-sand-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      Verify
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    ✓ Mobile number verified successfully
                  </span>
                )}
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 font-mono outline-none focus:border-gold uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Mandatory for TDS deduction & income tax credit
                </span>
              </div>

              {/* Aadhaar Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Aadhaar Number (12-digit UID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="•••• •••• ••••"
                  maxLength={14}
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 font-mono outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Starter Package Selection */}
          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-4">
            <h3 className="font-display font-bold text-base text-sand-100 flex items-center gap-2">
              <span className="text-gold">03</span>
              <span>Choose Your Starter Business Package</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <label
                  key={pkg.id}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.starterPackage === pkg.id
                      ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                      : "border-slate-800 bg-navy-950 hover:border-slate-600"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="radio"
                        name="starterPackage"
                        value={pkg.id}
                        checked={formData.starterPackage === pkg.id}
                        onChange={() => setFormData({ ...formData, starterPackage: pkg.id })}
                        className="accent-amber-500"
                      />
                      {pkg.bv > 0 && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                          {pkg.bv} BV
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-sand-100 mb-1">{pkg.name}</h4>
                    <p className="text-lg font-bold text-gold mb-3">
                      {pkg.price === 0 ? "₹0 (Free Join)" : `₹${pkg.price.toLocaleString("en-IN")}`}
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-gold">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Direct Selling Compliance Agreement Checkbox */}
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-700/80 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedCompliance}
                onChange={(e) => setAgreedCompliance(e.target.checked)}
                className="mt-1 accent-amber-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby declare that I am 18+ years of age, an Indian resident, and agree to the 
                <strong> Direct Selling Code of Conduct</strong> and <strong>Distributor Agreement</strong>. 
                I understand that compensation is purely based on the sale of legitimate solid wood furniture and no recruiting fee is charged.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl gold-gradient-bg text-navy-900 font-bold text-base hover:brightness-110 shadow-xl shadow-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Distributor Registration & Activate Back-Office</span>
            <span>→</span>
          </button>
        </form>
      </div>
    </main>
  );
}
