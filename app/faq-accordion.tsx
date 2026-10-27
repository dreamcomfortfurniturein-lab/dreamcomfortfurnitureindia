"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Custom Orders",
    question: "Do you offer customization for furniture dimensions and fabrics?",
    answer:
      "Yes, absolutely. Since every piece is handcrafted in our dedicated workshop, we can customize dimensions to your exact architectural floor plan. You can choose from over 45+ luxury upholstery fabrics—including Belgian stain-resistant velvets, breathable natural linens, and pure top-grain leathers—as well as select bespoke wood polish tones (Natural Teak, Royal Walnut, Smoked Teak, or Dark Haveli). Simply share your floor plan or architect's render with our team via WhatsApp.",
  },
  {
    category: "Materials & Quality",
    question: "What wood types do you use for your handcrafted furniture?",
    answer:
      "We strictly work with 100% genuine Grade-A Central Province (CP) Teakwood (Sagwan) and ethically harvested Rajasthan Sheesham (Indian Rosewood). We never use MDF, particle boards, or engineered core woods. Every timber log is solar kiln-seasoned to an optimal 8-12% moisture level to eliminate warping, cracking, or seasonal expansion in diverse Indian climates.",
  },
  {
    category: "Shipping & Delivery",
    question: "How does nationwide delivery and assembly work across India?",
    answer:
      "We provide safe, insured, white-glove delivery across 19,000+ pin codes in India. Your furniture is securely packed in 5-ply reinforced wooden crates with multi-layer high-density foam cushioning. Our specialized in-house carpentry team unpacks, positions, and fully assembles each piece inside your room of choice, and disposes of all packaging materials.",
  },
  {
    category: "Warranty & Returns",
    question: "What is your warranty and return policy?",
    answer:
      "All Dream Comfort solid wood furniture comes with an industry-leading 10-Year Anti-Termite & Structural Guarantee. We provide free doorstep inspection, repair, or replacement in the rare event of structural or borer issues. Furthermore, we offer a 7-day doorstep inspection policy upon delivery to ensure 100% satisfaction before final sign-off.",
  },
  {
    category: "Visits & Experience",
    question: "Can I inspect the wood, finishes, and craftsmanship in person?",
    answer:
      "Yes! You are welcome to visit our flagship Experience Center & Workshop in Visakhapatnam (Railway New Colony, Opp HDFC Bank). For homeowners across other states, we offer high-definition video walkthroughs of your furniture during production, and can dispatch a physical Wood & Fabric Swatch Kit directly to your doorstep.",
  },
  {
    category: "Payment & Financing",
    question: "What payment and EMI options do you support?",
    answer:
      "We support all Indian payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit cards (Visa, Mastercard, RuPay, Amex), and 0% No-Cost EMI options through leading banks (HDFC, ICICI, Axis, and Bajaj Finserv). For custom bespoke commissions, we accept a 30% production advance with balance upon video dispatch approval.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A3A2A] block mb-2">
          HELP & ASSISTANCE
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight">
          Queries & Buying Guide
        </h2>
        <p className="text-[#555555] text-sm sm:text-base mt-2.5">
          Everything you need to know about our solid wood craftsmanship, bespoke dimensions, and white-glove doorstep delivery.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border ${
                isOpen
                  ? "bg-white border-[#D4AF37] shadow-lg"
                  : "bg-white/80 hover:bg-white border-stone-200/90 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[#1A3A2A] text-[#D4AF37]"
                        : "bg-stone-100 text-[#555555]"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="font-display font-bold text-base sm:text-lg text-[#111111]">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 bg-[#1A3A2A] text-[#D4AF37]"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  ▼
                </div>
              </button>

              {isOpen && (
                <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-[#444444] leading-relaxed border-t border-stone-100">
                  <p>{faq.answer}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100/60 flex items-center justify-between text-xs text-stone-500">
                    <span className="uppercase tracking-wider font-semibold text-[10px] text-[#1A3A2A]">
                      Category: {faq.category}
                    </span>
                    <a
                      href="https://wa.me/919959427831"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <span>💬 Ask Master Artisan</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buying guide help card */}
      <div className="mt-12 p-6 rounded-2xl bg-[#1A3A2A]/5 border border-[#1A3A2A]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-display font-bold text-base text-[#111111]">
            Have an architectural blueprint or unique room dimensions?
          </h4>
          <p className="text-xs sm:text-sm text-[#555555] mt-0.5">
            Our interior wood specialists review CAD drawings and 3D renders with zero consultation fee.
          </p>
        </div>
        <a
          href="https://wa.me/919959427831?text=Hi%20Dream%20Comfort,%20I%20have%20an%20architectural%20blueprint%20for%20furniture."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-2.5 rounded-full bg-[#1A3A2A] text-[#FBFBFA] font-medium text-xs hover:bg-[#111812] transition-colors shadow"
        >
          WhatsApp Your Blueprint →
        </a>
      </div>
    </section>
  );
}
