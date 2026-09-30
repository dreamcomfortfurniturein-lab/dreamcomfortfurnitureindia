import Link from "next/link";
import products from "@/data/products.json";
import EarningsCalculator from "./earnings-calculator";
import TestimonialShowcase from "./testimonial-showcase";
import GiftRedemptionSelector from "./gift-redemption-selector";

export default function Home() {
  const featured = products.slice(0, 4);

  const categories = [
    {
      name: "Living Room",
      desc: "Royal Sheesham & Velvet Sofas",
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      count: "18 Models",
      link: "/products?category=Living Room",
    },
    {
      name: "Bedroom Sets",
      desc: "Solid Teak & Hydraulic Storage Beds",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
      count: "14 Models",
      link: "/products?category=Bedroom Sets",
    },
    {
      name: "Modular Kitchens",
      desc: "Acrylic & Marine Grade Cabinetry",
      img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      count: "Custom Layouts",
      link: "/products?category=Modular Kitchens",
    },
    {
      name: "Ergonomic Office",
      desc: "Executive Desk Suites & Ergonomic Chairs",
      img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
      count: "Corporate Grade",
      link: "/products?category=Ergonomic Office",
    },
    {
      name: "Handcrafted Solid Teak",
      desc: "Heritage Inlaid Dining Tables & Haveli Sets",
      img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80",
      count: "100% Seasoned CP Teak",
      link: "/products?category=Handcrafted Solid Teak",
    },
  ];

  const mlmHighlights = [
    {
      icon: "🪵",
      title: "Quality Assurance",
      desc: "100% seasoned Sheesham and CP Teak wood with 10-year anti-termite guarantee and German hardware fittings.",
    },
    {
      icon: "🏭",
      title: "Direct-From-Factory Pricing",
      desc: "Bypass multiple middlemen, wholesalers, and retail markups to offer premium luxury at unbeatable factory rates.",
    },
    {
      icon: "📦",
      title: "Zero Inventory Risk",
      desc: "As an Independent Distributor, you never buy bulk stock. We warehouse, package, and doorstep-deliver nationwide.",
    },
    {
      icon: "💳",
      title: "Weekly Commission Payouts",
      desc: "Direct bank transfer every Tuesday. Transparent tracking of Retail margins, Binary matches, and Leadership pools.",
    },
  ];

  return (
    <main className="bg-navy-900 text-sand-100">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-gold/20 py-20 lg:py-28">
        {/* Luxury Background Image with Darker High-Contrast Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=90"
            alt="Modern Indian Luxury Living Room with Teakwood Furniture and Gold Accents"
            className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 scale-105 transform animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-950/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-navy-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-950/90 border border-gold/60 text-gold text-xs font-semibold backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span>India&apos;s Leading Direct Selling Furniture Enterprise</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-md leading-tight">
              Luxury Comfort for Your Home.{" "}
              <span className="text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)] block">
                Financial Freedom for Your Life.
              </span>
            </h1>

            <p className="text-slate-100 text-base sm:text-xl max-w-2xl font-normal leading-relaxed drop-shadow">
              India&apos;s premier direct selling brand offering solid wood handcrafted furniture, 
              ergonomic luxury office solutions, and lucrative business opportunities with zero inventory risk.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/products"
                className="px-8 py-4 rounded-xl gold-gradient-bg text-navy-900 font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-gold/25 flex items-center justify-center gap-2 group"
              >
                <span>Explore Furniture Catalog</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/business-plan"
                className="px-8 py-4 rounded-xl bg-navy-800/90 hover:bg-navy-700/90 border border-gold/40 text-sand-100 font-semibold text-base hover:border-gold transition-all backdrop-blur-md flex items-center justify-center gap-2"
              >
                <span>Join MLM Business Network</span>
                <span className="text-gold font-bold">✨</span>
              </Link>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-8 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-center sm:text-left max-w-xl">
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-display text-gold">100%</p>
                <p className="text-xs text-slate-400">Solid Teak & Sheesham</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-display text-gold">25%+</p>
                <p className="text-xs text-slate-400">Direct Partner Margins</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-display text-gold">12,500+</p>
                <p className="text-xs text-slate-400">Happy Homes Furnished</p>
              </div>
            </div>
          </div>

          {/* Quick Opportunity Card - ₹15,000 Hybrid Model */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="glass-card rounded-2xl p-6 border-2 border-gold/50 shadow-2xl space-y-4 relative overflow-hidden bg-gradient-to-b from-navy-900/90 to-navy-950/95">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1">
                  ⭐ Flagship Hybrid ID
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                  100% Value Backed
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-sand-100">
                  ₹15,000 ID Registration
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  Bio-Magnetic Kit + 100% Retail Furniture Redemption
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2 bg-navy-950/80 p-2.5 rounded-lg border border-slate-700/80">
                  <span className="text-emerald-400 font-bold text-sm">🧲</span>
                  <div>
                    <strong className="text-sand-100">Instant Wellness Benefit:</strong>
                    <p className="text-[11px] text-slate-400">Receive physical Bio-Magnetic Kit (sleep & circulation therapy system).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-navy-950/80 p-2.5 rounded-lg border border-slate-700/80">
                  <span className="text-gold font-bold text-sm">🛋️</span>
                  <div>
                    <strong className="text-sand-100">Full Retail Redemption:</strong>
                    <p className="text-[11px] text-slate-400">₹15,000 fully redeemable against luxury furniture & interior decor at physical outlets.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-navy-950/90 rounded-xl border border-gold/30 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Registration ID Fee:</span>
                  <span className="text-gold font-extrabold text-sm font-mono">₹15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Store Furniture Credit:</span>
                  <span className="text-emerald-400 font-bold">₹15,000 (100%)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/business-plan#hybrid-model"
                  className="block w-full py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-navy-900 text-center text-xs font-bold transition-all shadow-md"
                >
                  Explore Plan of Action →
                </Link>
                <a
                  href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20register%20the%2015000%20ID%20for%20the%20Bio-Magnetic%20Kit%20and%20Furniture%20Credit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-center text-xs font-semibold transition-all border border-emerald-500/40"
                >
                  💬 Register via Pranay (9959427831)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED FURNITURE CATEGORIES */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              Curated Indian Craftsmanship
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
              Explore Our Signature Collections
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-semibold text-gold hover:text-gold-light flex items-center gap-1.5"
          >
            <span>View Complete Store Catalog</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="group rounded-2xl overflow-hidden bg-navy-950/90 border border-slate-700/80 hover:border-gold transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-900">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-md bg-navy-950/95 border border-gold/40 shadow-md">
                  {cat.count}
                </span>
              </div>

              {/* Dedicated Text Box - 100% Crisp & High Contrast */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-navy-900 to-navy-950 border-t border-slate-800">
                <div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Collection</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2.5 SPECIAL HYBRID ADVANCE RETAIL & WELLNESS MODEL */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto" id="hybrid-model">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border-2 border-gold/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
              ⭐ Breakthrough Business Innovation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sand-100">
              The ₹15,000 <span className="gold-gradient-text">Hybrid Advance Retail Model</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Zero-Risk Direct Selling backed by 100% Tangible Value. Your registration is not an expenditure—it is an advance furniture investment with instant wellness therapy.
            </p>
          </div>

          {/* 3 Step Plan of Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-10">
            {/* Step 1 */}
            <div className="glass-card p-6 rounded-2xl border border-gold/30 bg-navy-950/80 hover:border-gold transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-gold/20 text-gold border border-gold/40 flex items-center justify-center font-bold text-base font-display">
                    01
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-900 text-gold text-[11px] font-bold border border-gold/30">
                    Step 1: Registration
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-sand-100 mb-2">
                  Register ID for ₹15,000
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join Dream Comfort Furniture with an official member ID cost of ₹15,000. Immediately activate your independent distributor business position.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-semibold">
                ✓ Instant ID activation & back-office CRM portal
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-navy-950/80 hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-base font-display">
                    02
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-900 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                    Step 2: Instant Wellness
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-sand-100 mb-2">
                  Receive Bio-Magnetic Kit
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every registered member gets a physical, high-grade Bio-Magnetic Wellness & Sleep Therapy Set delivered to their hands. Improves blood flow, oxygenation, and restful sleep.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                ✓ Tangible physical health benefit from Day 1
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 rounded-2xl border border-gold/30 bg-navy-950/80 hover:border-gold transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-gold/20 text-gold border border-gold/40 flex items-center justify-center font-bold text-base font-display">
                    03
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-900 text-gold text-[11px] font-bold border border-gold/30">
                    Step 3: 100% Redemption
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-sand-100 mb-2">
                  100% ₹15,000 Retail Credit
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your complete ₹15,000 ID fee is 100% redeemable as a single exclusive gift choice for <strong>Furniture</strong>, <strong>Home Needs & Appliances (TV, AC, Fridge, Washing Machine, Fans)</strong>, or <strong>Interior Designs</strong> at Pranay&apos;s physical outlets!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                ✓ Zero risk: You lose ₹0, get wellness kit + 100% retail product value
              </div>
            </div>
          </div>

          {/* Interactive Gift Box: Furniture Products, Home Needs, Interior Designs (Only one opened) */}
          <div className="pt-4 pb-8 border-t border-slate-800">
            <GiftRedemptionSelector />
          </div>

          {/* Action Callout Bar */}
          <div className="bg-navy-950/90 border border-gold/40 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h4 className="font-display text-xl font-bold text-sand-100">
                Want to Activate Your ₹15,000 ID or Visit our Outlets?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Directly connect with <strong>Founder Pranay</strong> for registration guidance, outlet locations, and kit dispatch.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href="https://wa.me/919959427831?text=Hello%20Pranay,%20I%20am%20interested%20in%20joining%20the%2015000%20Hybrid%20Model%20for%20the%20Bio-Magnetic%20Kit%20and%20Furniture%20Credit."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>💬 WhatsApp Pranay: +91 99594 27831</span>
              </a>
              <a
                href="tel:9959427831"
                className="px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-navy-900 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
              >
                <span>📞 Call Pranay (9959427831)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE DIRECT SELLING ADVANTAGE */}
      <section className="py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              Why Partner With Us?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
              The Dream Comfort Direct Selling Advantage
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Unlike small consumer goods, high-ticket solid wood furniture delivers unmatched BV volume, fast rank advancements, and massive recurring rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mlmHighlights.map((item) => (
              <div
                key={item.title}
                className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all hover:-translate-y-1.5 shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teak/30 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-sand-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MLM EARNINGS CALCULATOR WIDGET */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto" id="calculator">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">
            Calculate Your Potential
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
            Interactive Commission & Rank Calculator
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            See how your monthly income scales as your personal furniture orders and distributor downline team grow.
          </p>
        </div>

        <EarningsCalculator />
      </section>

      {/* 5. TOP PRODUCTS SHOWCASE WITH BV/PV */}
      <section className="py-20 bg-navy-950/60 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-gold tracking-widest uppercase">
                Featured Best Sellers
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
                Handcrafted Solid Wood Masterpieces
              </h2>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl border border-gold/40 text-gold font-semibold text-xs hover:bg-gold/10 transition-colors"
            >
              Browse All Furniture (8+ Models) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <div
                key={p.slug}
                className="glass-card rounded-2xl border border-navy-700/80 hover:border-gold/40 overflow-hidden flex flex-col transition-all group"
              >
                <div className="relative aspect-[4/3] bg-navy-900 overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-gold text-navy-900 shadow">
                    {p.badge || "Featured"}
                  </span>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-navy-950/80 border border-gold/30 text-[10px] text-emerald-400 font-mono">
                    {p.bv} BV
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gold tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="font-display font-bold text-sm text-sand-100 mt-1 line-clamp-1 group-hover:text-gold transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/60">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block text-[10px]">Retail Price:</span>
                        <span className="text-base font-bold text-sand-100">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">Distributor Rate:</span>
                        <span className="text-sm font-bold text-gold">
                          ₹{p.memberPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="py-2 text-center rounded-lg border border-slate-600 text-xs font-semibold text-slate-300 hover:bg-navy-700"
                      >
                        View Details
                      </Link>
                      <Link
                        href="/products"
                        className="py-2 text-center rounded-lg gold-gradient-bg text-navy-900 text-xs font-bold hover:brightness-110 shadow"
                      >
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEMBER TESTIMONIALS & TOP EARNERS SHOWCASE */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">
            Proven Leadership Success
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
            Distributor Stories & Luxury Rewards
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Real people across India building lifelong wealth and furnishing royal homes through Dream Comfort Furniture.
          </p>
        </div>

        <TestimonialShowcase />
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-teak-dark to-navy-950 border-t border-gold/30">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-sand-100">
            Ready to Furnish Your Dreams & Build Wealth?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of independent business owners across India today. Zero inventory holding, 
            factory-direct warranties, and weekly direct bank payouts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-xl shadow-gold/25"
            >
              Register ₹15,000 Hybrid ID Now →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20interested%20in%20the%2015000%20Hybrid%20Model%20with%20Bio-Magnetic%20Kit%20and%20Furniture%20Credit."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Chat with Pranay on WhatsApp (+91 99594 27831)</span>
            </a>
            <Link
              href="/business-plan#hybrid-model"
              className="px-8 py-3.5 rounded-xl bg-navy-900/90 border border-gold/40 text-sand-100 font-semibold text-sm sm:text-base hover:border-gold transition-all"
            >
              View Plan of Action
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}