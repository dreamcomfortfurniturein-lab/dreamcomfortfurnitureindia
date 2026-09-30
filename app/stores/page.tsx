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
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Nationwide Presence & Retail Outlets</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-sand-100">
            Experience Centers & Furniture Outlets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Touch and feel our genuine Sheesham, Teakwood grains, and ergonomic setups in person. Distributors and members can visit to inspect products and redeem their advance furniture credits.
          </p>
        </div>

        {/* 15,000 Retail Redemption Notice */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-gold/50 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              🎁 100% Retail Redemption (Choice of 1 Gift Category)
            </span>
            <h3 className="font-display font-bold text-xl text-sand-100">
              Have a ₹15,000 Registered ID?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your ₹15,000 ID fee can be unlocked as an exclusive gift voucher for any <strong>ONE</strong> of three choices: <strong>(1) Luxury Solid Wood Furniture</strong>, <strong>(2) Essential Home Needs & Appliances</strong> (Smart TVs, Inverter ACs, Refrigerators, Washing Machines, BLDC Fans & Gadgets), or <strong>(3) Turnkey Interior Design Services</strong> at our physical outlets.
            </p>
          </div>
          <a
            href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20visit%20a%20Dream%20Comfort%20store%20and%20redeem%20my%2015000%20credit."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <span>💬 Coordinate with Pranay (+91 99594 27831)</span>
          </a>
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
