import Link from "next/link";
import products from "@/data/products.json";
import settings from "@/data/settings.json";
import TestimonialShowcase from "./testimonial-showcase";
import FrontSplitHero from "./front-split-hero";
import TopAnnouncementBanner from "./top-announcement-banner";

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

  return (
    <main className="bg-navy-900 text-sand-100">
      {/* WELCOME ONBOARDING GUIDE BANNER (DYNAMIC USER STATE) */}
      <TopAnnouncementBanner />

      {/* 1. HERO SECTION: SPLIT VIDEO (LEFT) & POSTER (RIGHT) */}
      <section className="relative overflow-hidden border-b border-gold/20 pt-6 pb-12 sm:pt-8 sm:pb-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FrontSplitHero
            videos={settings.heroVideos}
            landscapeVideos={settings.heroLandscape?.videos}
            landscapePoster={settings.heroLandscape?.poster}
            verticalVideos={settings.heroVertical?.videos}
            verticalPoster={settings.heroVertical?.poster}
          />
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

      {/* 3. ARTISANAL FURNITURE VALUES & PROMISE */}
      <section className="py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              The DreamComfortFurnitureIndia Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
              Why Discerning Homeowners Choose Us
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Every dining table, sofa suite, and bed is handcrafted by master carpenters using seasoned hardwood and German fittings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all hover:-translate-y-1.5 shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teak/30 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                🪵
              </div>
              <h3 className="font-display text-lg font-bold text-sand-100 mb-2">
                100% Solid CP Teak & Sheesham
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Zero particle board or synthetic MDF. Genuine heartwood seasoned through solar kilns for permanent dimensional stability.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all hover:-translate-y-1.5 shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teak/30 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="font-display text-lg font-bold text-sand-100 mb-2">
                10-Year Anti-Termite Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every piece undergoes vacuum pressure treatment with eco-friendly wood preservatives against borers and moisture.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all hover:-translate-y-1.5 shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teak/30 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                🚚
              </div>
              <h3 className="font-display text-lg font-bold text-sand-100 mb-2">
                White-Glove Pan-India Delivery
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Multi-layer protective bubble & corrugated packaging. Expert in-house carpenters deliver and assemble in your room of choice.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-navy-700 hover:border-gold/40 transition-all hover:-translate-y-1.5 shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teak/30 border border-gold/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                📐
              </div>
              <h3 className="font-display text-lg font-bold text-sand-100 mb-2">
                Custom Tailored Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Custom wood stains, designer fabrics, velvet finishes, and bespoke room dimensions made to your exact architectural blueprints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP PRODUCTS SHOWCASE */}
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
                        <span className="text-xs text-slate-400 block text-[10px]">Price:</span>
                        <span className="text-base font-bold text-sand-100">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">100% Solid Wood</span>
                        <span className="text-[11px] text-slate-400">
                          10-Yr Guarantee
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
                        Explore More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & CLIENT STORIES */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">
            Client Experiences
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-100 mt-2">
            Stories from Luxury Indian Homes
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Hear from families and architects who trusted DreamComfortFurnitureIndia for their handcrafted living, dining, and bedroom spaces.
          </p>
        </div>

        <TestimonialShowcase />
      </section>

      {/* 7. BOTTOM LUXURY FURNITURE CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-teak-dark to-navy-950 border-t border-gold/30">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-sand-100">
            Ready to Furnish Your Dream Home?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Experience our solid wood collections at our Visakhapatnam Experience Center, or consult with our master artisans for bespoke custom woodwork across India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-xl shadow-gold/25"
            >
              Explore Furniture Catalog →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20interested%20in%20custom%20solid%20wood%20furniture%20from%20Dream%20Comfort."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp Showroom (+91 99594 27831)</span>
            </a>
            <Link
              href="/stores"
              className="px-8 py-3.5 rounded-xl bg-navy-900/90 border border-gold/40 text-sand-100 font-semibold text-sm sm:text-base hover:border-gold transition-all"
            >
              Showroom Location & Timings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}