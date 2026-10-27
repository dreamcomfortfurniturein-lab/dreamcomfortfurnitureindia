import Link from "next/link";

export const metadata = {
  title: "About Us | Dream Comfort Furniture India",
  description: "Crafting timeless solid Sheesham & CP Teak furniture directly from solar-kiln workshops to Indian homes.",
};

export default function AboutPage() {
  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Our Heritage & Craftsmanship</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            Solid Hardwood Artistry, Direct from Workshop
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dream Comfort Furniture India was founded by Pranay in Visakhapatnam with a singular mission: to bring authentic, heirloom-quality solid Sheesham and CP Teak furniture directly to Indian homes without inflated showroom markups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🌲</span>
            <h3 className="font-display font-bold text-lg text-sand-100">100% Solid CP Teak & Sheesham</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero particle board, plywood, or synthetic MDF. Genuine heartwood seasoned through 45-day solar kilns for permanent dimensional stability.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🔨</span>
            <h3 className="font-display font-bold text-lg text-sand-100">Master Carpenter Joinery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional mortise-and-tenon interlocking joints, hand-carved floral inlays, and precision German Blum hydraulic gas-lift hardware.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🛡️</span>
            <h3 className="font-display font-bold text-lg text-sand-100">10-Year Anti-Termite Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every timber piece undergoes vacuum pressure treatment with eco-friendly wood preservatives against borers and tropical humidity.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-gold/30 text-center space-y-6 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100">
            Experience Our Handcrafted Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Visit our Visakhapatnam Experience Center at Railway New Colony, or consult with our master artisans to custom build your living, dining, or bedroom suite.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow"
            >
              Browse Furniture Catalog →
            </Link>
            <Link
              href="/stores"
              className="px-6 py-3 rounded-xl border border-gold/40 text-sand-100 hover:border-gold font-semibold text-xs sm:text-sm transition-colors"
            >
              Showroom Location & Timings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
