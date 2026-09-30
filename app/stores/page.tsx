import Link from "next/link";

export const metadata = {
  title: "Franchise & Experience Centers | Dream Comfort Furniture India",
  description: "Visit our direct selling franchise galleries and experience centers across India.",
};

export default function StoresPage() {
  const stores = [
    {
      city: "Visakhapatnam (Flagship Gallery)",
      address: "Plot 42, APIIC Industrial Park, Auto Nagar, Visakhapatnam, AP - 530012",
      phone: "+91 89123 45678",
      timings: "10:00 AM – 8:30 PM (All 7 Days)",
      type: "Master State Experience Hub",
    },
    {
      city: "Hyderabad (Banjara Hills)",
      address: "Road No. 12, Near MLA Colony, Banjara Hills, Hyderabad, TS - 500034",
      phone: "+91 40 9876 5432",
      timings: "10:30 AM – 9:00 PM (All 7 Days)",
      type: "Luxury Showroom & Distributor Center",
    },
    {
      city: "Bengaluru (Indiranagar)",
      address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA - 560038",
      phone: "+91 80 4123 7890",
      timings: "10:00 AM – 8:30 PM",
      type: "Franchise Experience Center",
    },
    {
      city: "Delhi NCR (Gurugram)",
      address: "Golf Course Road, Sector 54, Gurugram, HR - 122002",
      phone: "+91 124 456 7890",
      timings: "10:00 AM – 8:00 PM",
      type: "North India Regional Hub",
    },
  ];

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Nationwide Presence</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            Experience Centers & Franchise Galleries
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Touch and feel our genuine Sheesham, Teakwood grains, and ergonomic setups in person. Distributors can bring prospective clients for live demonstrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((s) => (
            <div key={s.city} className="glass-card p-6 rounded-2xl border border-navy-700 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30">
                {s.type}
              </span>
              <h3 className="font-display font-bold text-lg text-sand-100">{s.city}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">📍 {s.address}</p>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-700/60">
                <p>📞 Phone: <span className="text-sand-100">{s.phone}</span></p>
                <p>🕒 Hours: <span className="text-sand-100">{s.timings}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* Franchise Opportunity Pitch */}
        <div className="glass-card p-8 rounded-2xl border border-gold/30 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-sand-100">
            Want to Open a Dream Comfort City Franchise?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            High ROI FOCO (Franchise Owned, Company Operated) model with guaranteed display margin, local distributor catchment, and full interior branding support.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow"
            >
              Apply for Franchise Rights →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
