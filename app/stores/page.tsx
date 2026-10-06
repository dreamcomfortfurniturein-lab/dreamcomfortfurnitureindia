import Link from "next/link";

export const metadata = {
  title: "Franchise & Experience Centers | DreamComfortFurnitureIndia",
  description: "Visit our direct selling franchise galleries and experience centers across India.",
};

export default function StoresPage() {
  const openStore = {
    city: "Visakhapatnam (Flagship Experience Center)",
    address: "Railway New Colony, Opposite HDFC Bank, Above ORA Motors Showroom, Visakhapatnam, Andhra Pradesh",
    phone1: "9959427831",
    phone2: "9347965863",
    timings: "10:00 AM – 9:00 PM (All 7 Days Open)",
    type: "Now Open • Flagship Showroom",
  };

  const upcomingCities = [
    { city: "Hyderabad", state: "Telangana" },
    { city: "Bengaluru", state: "Karnataka" },
    { city: "Delhi NCR", state: "Gurugram / Delhi" },
  ];

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Experience Centers & Showrooms</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            Visit DreamComfortFurnitureIndia
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience our genuine seasoned Sheesham and solid CP Teakwood collections in person. Inspect joinery quality, try our ergonomic mattresses and chairs, and consult with our design architects.
          </p>
        </div>

        {/* Flagship Showroom Highlight */}
        <div className="glass-card p-8 rounded-3xl border-2 border-gold/60 shadow-2xl bg-gradient-to-b from-navy-900/90 to-navy-950/95 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {openStore.type}
            </span>
            <span className="text-xs text-gold font-semibold">
              ✨ Master State Display & Studio
            </span>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sand-100">
              {openStore.city}
            </h2>
            <p className="text-sm text-slate-200 mt-2 flex items-start gap-2">
              <span className="text-gold text-base">📍</span>
              <span>{openStore.address}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700/60 text-xs">
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-medium">📞 Direct Helpline:</span>
              <div className="flex items-center gap-2 text-gold font-bold text-sm">
                <a href={`tel:${openStore.phone1}`} className="hover:underline">
                  +91 {openStore.phone1}
                </a>
                <span className="text-slate-500">/</span>
                <a href={`tel:${openStore.phone2}`} className="hover:underline">
                  +91 {openStore.phone2}
                </a>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-700 space-y-1">
              <span className="text-slate-400 block font-medium">🕒 Visiting Hours:</span>
              <span className="text-sand-100 font-bold text-sm block">
                {openStore.timings}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20visit%20the%20Dream%20Comfort%20Visakhapatnam%20showroom%20at%20Railway%20New%20Colony."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <span>💬 WhatsApp Showroom (+91 99594 27831)</span>
            </a>
            <a
              href={`tel:${openStore.phone1}`}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-dark text-navy-900 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
            >
              <span>📞 Call Showroom ({openStore.phone1})</span>
            </a>
          </div>
        </div>

        {/* Upcoming Cities Section - Clean 'Coming Soon' with NO fake addresses */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Expanding Across India</span>
            <h3 className="font-display font-bold text-2xl text-sand-100 mt-1">
              Upcoming Experience Centers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {upcomingCities.map((u) => (
              <div
                key={u.city}
                className="glass-card p-6 rounded-2xl border border-navy-700 bg-navy-950/70 text-center space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-bold uppercase tracking-wider">
                    Coming Soon
                  </span>
                  <h4 className="font-display font-bold text-xl text-sand-100 mt-3">
                    {u.city}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {u.state}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
                  Experience Center Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pure Furniture Experience Consultation Pitch */}
        <div className="glass-card p-8 rounded-2xl border border-gold/30 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-sand-100">
            Looking for Custom Woodwork or Interior Furnishing?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Schedule a personal gallery walkthrough with our master craftsmen or order bespoke solid wood furniture delivered to any pin code across India.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow"
            >
              Browse Catalog Online →
            </Link>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20schedule%20a%20private%20furniture%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/40 font-semibold text-xs sm:text-sm transition-colors"
            >
              💬 WhatsApp: 9959427831
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
