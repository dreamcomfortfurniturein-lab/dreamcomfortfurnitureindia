"use client";

import Link from "next/link";

export default function CraftsmanshipAbout() {
  const galleryItems = [
    {
      title: "Artisan Hand-Carving & Brass Inlay",
      desc: "Traditional Indian motifs chiseled by 3rd-generation woodworkers into solid CP Teakwood with solid brass inlays.",
      image: "/craftsmanship-woodworking.jpg",
      tag: "Handcrafted Heritage",
    },
    {
      title: "Kiln-Seasoned Hardwood Stability",
      desc: "Vacuum-pressure treated and solar-kiln dried to 8-12% moisture content to prevent seasonal cracking or warping.",
      image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80",
      tag: "100% Solid Timber",
    },
    {
      title: "Architectural Belgian Velvet & Linens",
      desc: "High-rub-count stain-resistant velvets, breathable natural linens, and double-piped tailored seams.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      tag: "Bespoke Upholstery",
    },
  ];

  const pillars = [
    {
      icon: "🪵",
      title: "100% Solid Heartwood",
      desc: "We strictly never use MDF, particle boards, or hollow honeycombs. Only pure, seasoned Indian Teak and Sheesham.",
    },
    {
      icon: "🛡️",
      title: "10-Year Termite Warranty",
      desc: "Deep vacuum borate salt infusion shields every furniture piece against insects, borers, and climate degradation.",
    },
    {
      icon: "🚚",
      title: "White-Glove Pan-India Delivery",
      desc: "Packed in 5-ply reinforced wooden crates. Our carpenter team brings it inside, unboxes, and places it in your room.",
    },
    {
      icon: "📐",
      title: "Bespoke Architectural Customization",
      desc: "Custom dimensions, fabric swatch matching, and tailor-made wood stains based on your architect's interior layout.",
    },
  ];

  return (
    <section id="craftsmanship" className="w-full bg-[#1A3A2A] text-[#FBFBFA] py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative architectural background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
            FURNITURE GALLERY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#FBFBFA] tracking-tight">
            The Dream Comfort Craftsmanship
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
            Where generations of Indian woodworking mastery unite with clean contemporary architectural minimalism.
          </p>
        </div>

        {/* Gallery Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 sm:mb-24">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden bg-[#111812] border border-[#D4AF37]/25 shadow-2xl flex flex-col hover:border-[#D4AF37]/60 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1A3A2A]/90 backdrop-blur-md text-[#D4AF37] text-[11px] font-bold border border-[#D4AF37]/40 shadow-md">
                  {item.tag}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#F7E7A9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
                  <span>Artisan Detail</span>
                  <span>✦</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* About Our Story Section */}
        <div className="rounded-3xl bg-[#111812]/90 border border-[#D4AF37]/30 p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                ABOUT OUR STORY
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Crafted in India, Built to Outlive Generations
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Founded with a resolute commitment to authentic Indian craftsmanship,{" "}
                <strong className="text-white">Dream Comfort Furniture India</strong> bridges the gap between raw forest timber and refined interior architecture.
              </p>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Unlike modern mass retailers who rely on fragile particle-board veneers, our workshop in Visakhapatnam employs master woodcarvers who hand-shape solid Central Province (CP) Teak and Rajasthan Sheesham. Every single joint is carved using traditional mortise-and-tenon joints, delivering heirloom strength that endures through decades of family living.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  Read Our Heritage Story →
                </Link>
                <Link
                  href="/stores"
                  className="px-6 py-3 rounded-full border border-stone-600 hover:border-[#D4AF37] text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  Visit Experience Centers
                </Link>
              </div>
            </div>

            {/* 4 Story Pillars */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#1A3A2A]/70 border border-[#D4AF37]/20 shadow-md"
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <h4 className="font-display font-bold text-sm text-white mb-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
