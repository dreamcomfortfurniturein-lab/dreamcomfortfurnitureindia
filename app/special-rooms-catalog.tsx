"use client";

import { useState, useEffect } from "react";
import {
  CITIES,
  CityId,
  SPECIAL_ROOMS,
  MaterialRoomId,
  RoomItem,
} from "@/data/special-rooms-data";
import { useCart } from "@/lib/cart-context";

export default function SpecialRoomsCatalog() {
  const [selectedCity, setSelectedCity] = useState<CityId | null>("vizag");
  const [currentRoomId, setCurrentRoomId] = useState<MaterialRoomId>("teakwood");
  const [comparingRoomId, setComparingRoomId] = useState<MaterialRoomId | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const { addItem, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem("dcf_selected_city") as CityId | null;
      if (savedCity && CITIES[savedCity]) {
        setSelectedCity(savedCity);
      }
    } catch {
      // silent
    }
  }, []);

  const handleCitySelect = (city: CityId) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("dcf_selected_city", city);
    } catch {
      // silent
    }
  };

  const currentCityInfo = selectedCity ? CITIES[selectedCity] : null;
  const currentRoom = SPECIAL_ROOMS[currentRoomId];
  const compareRoom = comparingRoomId ? SPECIAL_ROOMS[comparingRoomId] : null;

  const handleAddToCart = (item: RoomItem) => {
    addItem({
      slug: item.id,
      name: item.name,
      price: item.price,
      memberPrice: Math.round(item.price * 0.8),
      image: item.image,
      material: item.materialGrade,
      bv: Math.round(item.price * 0.4),
      pv: Math.round(item.price / 300),
    });
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
      setIsCartDrawerOpen(true);
    }, 600);
  };

  return (
    <section id="special-rooms" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* 1. Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#1A3A2A] block mb-2">
            STRICT MATERIAL ISOLATION
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight">
            Special Rooms Catalog
          </h2>
          <p className="text-[#555555] text-sm sm:text-base mt-2 max-w-2xl">
            Products strictly segregated by material composition. Compare materials side-by-side and choose what best fits your regional climate and architecture.
          </p>
        </div>

        {/* Location selector toggle */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200/90 shadow-sm self-start md:self-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block px-2 mb-1.5">
            📍 Select Delivery Region:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CITIES) as CityId[]).map((cKey) => {
              const c = CITIES[cKey];
              const isSelected = selectedCity === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => handleCitySelect(cKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#1A3A2A] text-[#D4AF37] shadow-sm"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Regional Hub & Climate Advice Banner */}
      {currentCityInfo && (
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-white border border-[#D4AF37]/35 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A3A2A]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>
                Verified Hub: {currentCityInfo.name} ({currentCityInfo.region})
              </span>
              <span className="text-stone-400 font-normal">|</span>
              <span className="text-stone-600 font-semibold text-[11px]">
                {currentCityInfo.hubs}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
              <strong>Climate Guidance:</strong> {currentRoom.regionalAdvice[currentCityInfo.id]}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => {
                const nextRoom = currentRoomId === "teakwood" ? "mdf" : "teakwood";
                setComparingRoomId(nextRoom);
                setIsCompareOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-[#111111] text-xs font-bold border border-stone-300 transition-colors flex items-center gap-1.5"
            >
              <span>⚖️</span>
              <span>Compare Materials</span>
            </button>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden lg:inline">
              ⚡ {currentCityInfo.dispatchTime}
            </span>
          </div>
        </div>
      )}

      {/* 3. Special Rooms Material Navigation Tabs */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8">
        {(Object.keys(SPECIAL_ROOMS) as MaterialRoomId[]).map((rKey) => {
          const room = SPECIAL_ROOMS[rKey];
          const isSelected = currentRoomId === rKey;
          return (
            <button
              key={rKey}
              onClick={() => setCurrentRoomId(rKey)}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#1A3A2A] text-white border-[#D4AF37] shadow-lg -translate-y-0.5"
                  : "bg-white hover:bg-stone-50 text-[#333333] border-stone-200 shadow-sm"
              }`}
            >
              <span className="text-base">{room.icon}</span>
              <span>{room.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-[#D4AF37] text-[#111111]"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {room.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Room Banner Details */}
      <div className="p-6 rounded-3xl bg-[#111812] text-white mb-8 border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
            CURRENT SPECIAL ROOM
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>{currentRoom.icon}</span>
            <span>{currentRoom.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            {currentRoom.tagline} • Composition: {currentRoom.materialComposition}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase">Lifespan</span>
            <span className="font-bold text-[#D4AF37]">{currentRoom.lifespan}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase">Durability</span>
            <span className="font-bold text-white">{currentRoom.durabilityScore}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase">Cost Tier</span>
            <span className="font-bold text-amber-300">{currentRoom.costTier}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase">Maintenance</span>
            <span className="font-bold text-stone-200">{currentRoom.maintenanceLevel}</span>
          </div>
        </div>
      </div>

      {/* 5. Strictly Isolated Item Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {currentRoom.items.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1A3A2A]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/40 shadow-sm">
                {currentRoom.title}
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#111111] text-[10px] font-bold shadow-sm">
                {item.priceTier} Tier
              </span>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A3A2A] block">
                  Material Grade:
                </span>
                <span className="text-xs font-semibold text-stone-700 block mb-1">
                  {item.materialGrade}
                </span>

                <h4 className="font-display font-bold text-base text-[#111111] group-hover:text-[#1A3A2A] transition-colors leading-snug">
                  {item.name}
                </h4>

                {/* Local Climate Advantage Tag for Selected City */}
                {selectedCity && (
                  <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                    <span className="font-bold text-[#1A3A2A] block text-[11px] mb-0.5">
                      📍 {CITIES[selectedCity].name} Climate Benefit:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {item.climateNotes[selectedCity]}
                    </p>
                  </div>
                )}

                {/* Key Specs */}
                <div className="mt-3 space-y-1">
                  {item.specifications.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                      <span className="text-[#D4AF37] text-xs leading-none">✦</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Direct Price:
                  </span>
                  <span className="text-lg font-black text-[#111111]">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/919959427831?text=Hi%20Pranay,%20I%20am%20interested%20in%20${encodeURIComponent(
                      item.name
                    )}%20from%20the%20${encodeURIComponent(currentRoom.title)}%20for%20${
                      selectedCity ? CITIES[selectedCity].name : "my home"
                    }.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Inquire via WhatsApp"
                  >
                    💬
                  </a>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addedItemId === item.id}
                    className="px-4 py-2 rounded-full bg-[#1A3A2A] hover:bg-[#111812] text-[#FBFBFA] text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    {addedItemId === item.id ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Side-by-Side Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-[#1A3A2A] uppercase tracking-wider">
                  CROSS-ROOM COMPARISON
                </span>
                <h3 className="font-display font-black text-2xl text-[#111111]">
                  Compare Materials Side-by-Side
                </h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Room selection for comparison */}
            <div className="py-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-stone-600">Compare with:</span>
              {(Object.keys(SPECIAL_ROOMS) as MaterialRoomId[])
                .filter((r) => r !== currentRoomId)
                .map((rKey) => (
                  <button
                    key={rKey}
                    onClick={() => setComparingRoomId(rKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      comparingRoomId === rKey
                        ? "bg-[#1A3A2A] text-[#D4AF37] border-[#D4AF37]"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {SPECIAL_ROOMS[rKey].title}
                  </button>
                ))}
            </div>

            {/* Comparison Table */}
            {compareRoom && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-200 bg-stone-50">
                      <th className="p-3 font-bold text-stone-600">Metric</th>
                      <th className="p-3 font-bold text-[#1A3A2A] bg-emerald-50/50">
                        {currentRoom.icon} {currentRoom.title} (Current)
                      </th>
                      <th className="p-3 font-bold text-[#1A3A2A] bg-amber-50/50">
                        {compareRoom.icon} {compareRoom.title}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="p-3 font-bold text-stone-600">Cost Tier</td>
                      <td className="p-3 font-bold text-stone-800">{currentRoom.costTier}</td>
                      <td className="p-3 font-bold text-stone-800">{compareRoom.costTier}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-600">Lifespan</td>
                      <td className="p-3">{currentRoom.lifespan}</td>
                      <td className="p-3">{compareRoom.lifespan}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-600">Durability Score</td>
                      <td className="p-3 font-semibold text-emerald-800">{currentRoom.durabilityScore}</td>
                      <td className="p-3 font-semibold text-emerald-800">{compareRoom.durabilityScore}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-600">Water Resistance</td>
                      <td className="p-3">{currentRoom.waterResistance}</td>
                      <td className="p-3">{compareRoom.waterResistance}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-600">Maintenance</td>
                      <td className="p-3">{currentRoom.maintenanceLevel}</td>
                      <td className="p-3">{compareRoom.maintenanceLevel}</td>
                    </tr>
                    {selectedCity && (
                      <tr className="bg-stone-50">
                        <td className="p-3 font-bold text-stone-700">
                          📍 {CITIES[selectedCity].name} Climate Fit
                        </td>
                        <td className="p-3 text-xs leading-relaxed">
                          {currentRoom.regionalAdvice[selectedCity]}
                        </td>
                        <td className="p-3 text-xs leading-relaxed">
                          {compareRoom.regionalAdvice[selectedCity]}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsCompareOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#1A3A2A] text-white font-bold text-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
