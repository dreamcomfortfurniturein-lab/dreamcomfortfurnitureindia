import Link from "next/link";
import products from "@/data/products.json";
import EarningsCalculator from "./earnings-calculator";
import TestimonialShowcase from "./testimonial-showcase";

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

          {/* Quick Opportunity Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="glass-card rounded-2xl p-6 border border-gold/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Exclusive Starter Pack
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  High BV Yield
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-sand-100">
                Independent Distributor Starter Kit
              </h3>
              <p className="text-xs text-slate-300">
                Includes sample wood catalog, high-res 3D digital room planner app access, distributor ID, and immediate wholesale member pricing.
              </p>
              <div className="p-3 bg-navy-900/80 rounded-xl border border-slate-700 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Membership Fee:</span>
                  <span className="text-emerald-400 font-bold">Zero ₹ (Purchase Only)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commission Payout:</span>
                  <span className="text-gold font-bold">Weekly via NEFT</span>
                </div>
              </div>
              <Link
                href="/register"
                className="block w-full py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-navy-900 text-center text-xs font-bold transition-all shadow-md"
              >
                Register & KYC Instantly →
              </Link>
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
              Register As Distributor Now →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Peela%20Pranay%20Tej,%20I%20am%20interested%20in%20Dream%20Comfort%20Furniture%20and%20the%20business%20opportunity."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Chat with Peela Pranay Tej on WhatsApp (+91 99594 27831)</span>
            </a>
            <Link
              href="/business-plan"
              className="px-8 py-3.5 rounded-xl bg-navy-900/90 border border-gold/40 text-sand-100 font-semibold text-sm sm:text-base hover:border-gold transition-all"
            >
              Read Compensation Plan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}