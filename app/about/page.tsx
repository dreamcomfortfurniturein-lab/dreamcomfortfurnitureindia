import Link from "next/link";

export const metadata = {
  title: "About Us | Dream Comfort Furniture India",
  description: "Crafting timeless solid wood furniture and empowering entrepreneurs across India.",
};

export default function AboutPage() {
  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Our Heritage & Mission</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            Craftsmanship Meets Financial Empowerment
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dream Comfort Furniture India was founded to democratize luxury living. We unite master woodworkers, sustainable forestry, and direct selling entrepreneurship under one visionary roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🌲</span>
            <h3 className="font-display font-bold text-lg text-sand-100">Ethical Sourcing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every log of Sheesham and Indian Teak is seasoned in solar kiln chambers with certified legal plantation provenance.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🔨</span>
            <h3 className="font-display font-bold text-lg text-sand-100">Master Artistry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional Rajasthani carving and brass inlay techniques combined with modern German precision joinery.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3 text-center">
            <span className="text-4xl block">🤝</span>
            <h3 className="font-display font-bold text-lg text-sand-100">Direct Entrepreneurship</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing thousands of Indian families with transparent, high-yield weekly incomes without upfront stocking risks.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-gold/30 text-center space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-100">
            Join the Movement as a Registered Distributor
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience the joy of furnishing India&apos;s finest homes while earning uncapped binary and leadership matching commissions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow"
            >
              Start Your Journey Now →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
