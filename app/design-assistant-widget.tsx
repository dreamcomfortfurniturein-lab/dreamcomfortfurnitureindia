"use client";

import { useState, useEffect } from "react";
import {
  ANTIQUITY_CITIES,
  AntiquityCity,
} from "@/data/antiquity-showcase-data";

export default function DesignAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<AntiquityCity | null>(null);
  const [botMessage, setBotMessage] = useState<string>("");
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("dcf_antiquity_city") as AntiquityCity | null;
      if (savedCity && ANTIQUITY_CITIES[savedCity]) {
        setSelectedCity(savedCity);
        updateBotMessage(savedCity);
      }
    } catch {
      // silent
    }
  }, []);

  const updateBotMessage = (city: AntiquityCity) => {
    if (city === "Visakhapatnam") {
      setBotMessage(
        "Welcome! The website has launched with the **Visakhapatnam RK Beach View** hero header. Scroll down to explore our exclusive coastal teak furniture, vintage wooden chests, and maritime antiquities."
      );
    } else if (city === "Vijayawada") {
      setBotMessage(
        "Preferences updated! The site now opens with the **Kanaka Durga Temple** view, followed by our hand-carved temple furniture and brass-embossed antique collections."
      );
    } else if (city === "Hyderabad") {
      setBotMessage(
        "Your view is set! Opening with the iconic **Charminar** landmark image, transitioning into our royal Nizam-style rosewood furniture and heritage decor catalog."
      );
    }
  };

  const handleSelectCity = (city: AntiquityCity) => {
    setSelectedCity(city);
    updateBotMessage(city);
    try {
      localStorage.setItem("dcf_antiquity_city", city);
    } catch {
      // silent
    }
    // Also dispatch custom event for smooth page sync
    window.dispatchEvent(new CustomEvent("dcf_city_change", { detail: city }));
  };

  const currentConfig = selectedCity ? ANTIQUITY_CITIES[selectedCity] : null;

  return (
    <>
      {/* Floating Antiquity Bot Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#111812] text-white border-2 border-[#D4AF37] shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        title="Open Antiquity Bot Personalization Assistant"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
        <span className="text-lg">🏛️</span>
        <span className="font-display font-bold text-xs sm:text-sm tracking-wide">
          {isOpen ? "Close Antiquity Bot" : "Antiquity Bot"}
        </span>
      </button>

      {/* Antiquity Bot Interactive Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[460px] max-h-[85vh] bg-[#0E1410] text-[#FBFBFA] rounded-3xl shadow-2xl border-2 border-[#D4AF37]/50 flex flex-col overflow-hidden animate-fadeIn font-sans">
          {/* Header */}
          <div className="bg-[#1A3A2A] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#111812] border border-[#D4AF37]/60 flex items-center justify-center font-bold text-sm text-[#D4AF37]">
                🏛️
              </div>
              <div>
                <h3 className="font-display font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>Antiquity Bot</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-sans font-semibold">
                    Dynamic Concierge
                  </span>
                </h3>
                <span className="text-[10px] text-stone-300 block">
                  Landmark Hero & Localized Furniture Showcase
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white text-lg font-bold px-2 py-0.5 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Interactive Chat Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-stone-200">
            {/* Status Header */}
            <div className="p-3 rounded-2xl bg-black/60 border border-stone-800 space-y-1 font-mono text-[11px]">
              <div>
                <strong className="text-stone-400">📍 Active City:</strong>{" "}
                <span className="font-bold text-[#D4AF37]">
                  {selectedCity || "Awaiting Selection"}
                </span>
              </div>
              <div>
                <strong className="text-stone-400">🏛️ Landmark View:</strong>{" "}
                <span className="font-bold text-white">
                  {currentConfig ? currentConfig.landmark : "Panoramic City Showcase"}
                </span>
              </div>
            </div>

            {/* City Selection Buttons (Always Available for Instant Transitions) */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Select Your Regional Architecture View:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(ANTIQUITY_CITIES) as AntiquityCity[]).map((cName) => {
                  const isSelected = selectedCity === cName;
                  return (
                    <button
                      key={cName}
                      onClick={() => handleSelectCity(cName)}
                      className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all text-center border ${
                        isSelected
                          ? "bg-[#D4AF37] text-[#111111] border-[#D4AF37] shadow-lg scale-102"
                          : "bg-stone-900/90 text-stone-300 border-stone-800 hover:border-stone-600 hover:text-white"
                      }`}
                    >
                      {cName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If City is Selected -> Emit Standardized Antiquity Bot Content */}
            {selectedCity && currentConfig ? (
              <div className="space-y-3.5 pt-1">
                {/* Bot Response Message */}
                <div className="p-3.5 rounded-2xl bg-[#1A3A2A]/40 border border-[#D4AF37]/30 text-stone-200 leading-relaxed text-xs">
                  <span className="font-bold text-[#D4AF37] block mb-1">
                    🤖 Antiquity Bot:
                  </span>
                  <p>{botMessage}</p>
                </div>

                {/* Step 1 & Step 2 Summary Card */}
                <div className="p-3.5 rounded-2xl bg-black/70 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-stone-800">
                    <span className="font-bold text-[#D4AF37]">
                      Step 1: Opening Hero Landmark
                    </span>
                    <span className="text-stone-400 font-mono text-[10px]">
                      {currentConfig.landmark}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-stone-800">
                    <span className="font-bold text-emerald-400">
                      Step 2: Antiquity Showcase
                    </span>
                    <span className="text-stone-300 text-[10px] font-semibold">
                      {currentConfig.catalogTitle}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1 text-stone-300 pt-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Featured Regional Items:
                    </span>
                    {currentConfig.featuredItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-[11px]">
                        <span>• {item.name}</span>
                        <span className="font-mono text-stone-400 text-[10px]">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical JSON Output Schema Accordion / Display */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-mono text-[11px] flex items-center justify-between transition-colors"
                  >
                    <span>Technical JSON Output Schema</span>
                    <span>{showJson ? "▲ Hide" : "▼ View JSON Payload"}</span>
                  </button>

                  {showJson && (
                    <pre className="mt-2 p-3 rounded-xl bg-black/90 text-emerald-400 font-mono text-[10px] overflow-x-auto leading-relaxed border border-stone-800">
                      {JSON.stringify(currentConfig.jsonPayload, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Quick Action Navigation */}
                <div className="pt-1 space-y-1.5">
                  <a
                    href="#antiquity-experience"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 px-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#B38F24] text-[#111111] font-bold text-xs transition-colors text-center block shadow"
                  >
                    View Full-Screen Landmark & Collection →
                  </a>

                  <a
                    href={`https://wa.me/919959427831?text=Hi%20Pranay,%20Antiquity%20Bot%20recommended%20the%20${selectedCity}%20Heritage%20Collection%20for%20my%20home.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors text-center block"
                  >
                    💬 WhatsApp Heritage Specialist (+91 99594 27831)
                  </a>
                </div>
              </div>
            ) : (
              /* Awaiting Selection Greeting */
              <div className="p-4 rounded-2xl bg-[#1A3A2A]/20 border border-[#D4AF37]/30 text-center space-y-2">
                <span className="text-2xl">🏛️</span>
                <p className="text-xs text-stone-300">
                  Select your city above to immediately configure your landmark hero opening view and explore regional antiquities.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
