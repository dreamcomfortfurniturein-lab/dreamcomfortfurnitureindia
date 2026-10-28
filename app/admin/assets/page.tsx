"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MANDATORY_CATEGORIES,
  MANDATORY_MATERIALS,
  MandatoryCategory,
  MandatoryMaterial,
  LayoutOrientation,
  detectMediaKind,
  MediaKind,
} from "@/lib/media-processor";

interface ProcessedMediaItem {
  id: string;
  searchQuery: string;
  category: MandatoryCategory;
  material: MandatoryMaterial;
  orientation: LayoutOrientation;
  mediaKind: MediaKind;
  provider: "Postimages" | "Cloudinary";
  hostedUrl: string;
  price?: number;
  timestamp: string;
}

export default function AssetManagerPage() {
  // 3-Tier Filter / Search State
  const [activeQuery, setActiveQuery] = useState("l sofa");
  const [activeCategory, setActiveCategory] = useState<MandatoryCategory>("Living Room");
  const [activeMaterial, setActiveMaterial] = useState<MandatoryMaterial>("Fabric");
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");

  // Upload Form State
  const [uploadQuery, setUploadQuery] = useState("l sofa");
  const [uploadCategory, setUploadCategory] = useState<MandatoryCategory>("Living Room");
  const [uploadMaterial, setUploadMaterial] = useState<MandatoryMaterial>("Fabric");
  const [uploadOrientation, setUploadOrientation] = useState<LayoutOrientation>("Horizontal");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Exact Confirmation State
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [confirmationHostedUrl, setConfirmationHostedUrl] = useState<string | null>(null);
  const [confirmationProvider, setConfirmationProvider] = useState<string | null>(null);

  // Repository Media Items (Strictly NO folder paths exposed)
  const [items, setItems] = useState<ProcessedMediaItem[]>([]);
  const [activeLightboxItem, setActiveLightboxItem] = useState<ProcessedMediaItem | null>(null);

  // Initial Seed Media with Provider Routing (Postimages for Images, Cloudinary for Videos)
  useEffect(() => {
    const initialItems: ProcessedMediaItem[] = [
      {
        id: "m_1",
        searchQuery: "l sofa",
        category: "Living Room",
        material: "Fabric",
        orientation: "Horizontal",
        mediaKind: "Image",
        provider: "Postimages",
        hostedUrl: "https://i.postimg.cc/85z1Qp9W/belgian-velvet-l-sofa.jpg",
        price: 68500,
        timestamp: "2026-10-28T10:00:00.000Z",
      },
      {
        id: "m_2",
        searchQuery: "l sofa",
        category: "Living Room",
        material: "Fabric",
        orientation: "Horizontal",
        mediaKind: "Video",
        provider: "Cloudinary",
        hostedUrl: "https://res.cloudinary.com/og57tmj8/video/upload/v1714000000/dcf_products/l_sofa_demo.mp4",
        price: 54900,
        timestamp: "2026-10-28T11:00:00.000Z",
      },
      {
        id: "m_3",
        searchQuery: "l sofa",
        category: "Living Room",
        material: "Fabric",
        orientation: "Vertical",
        mediaKind: "Image",
        provider: "Postimages",
        hostedUrl: "https://i.postimg.cc/6p2X4VnT/curved-sectional-l-sofa.jpg",
        price: 89000,
        timestamp: "2026-10-28T12:00:00.000Z",
      },
      {
        id: "m_4",
        searchQuery: "king bed",
        category: "Bedroom Sets",
        material: "Teak",
        orientation: "Horizontal",
        mediaKind: "Image",
        provider: "Postimages",
        hostedUrl: "https://i.postimg.cc/Kz8wV1wz/teak-hydraulic-king-bed.jpg",
        price: 58500,
        timestamp: "2026-10-28T13:00:00.000Z",
      },
      {
        id: "m_5",
        searchQuery: "executive chair",
        category: "Ergonomic Office",
        material: "Leatherette",
        orientation: "Vertical",
        mediaKind: "Video",
        provider: "Cloudinary",
        hostedUrl: "https://res.cloudinary.com/og57tmj8/video/upload/v1714000000/dcf_products/office_chair_recline.mp4",
        price: 18900,
        timestamp: "2026-10-28T14:00:00.000Z",
      },
    ];

    try {
      const saved = localStorage.getItem("dcf_processed_media_items_v3");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(initialItems);
      }
    } catch {
      setItems(initialItems);
    }
  }, []);

  function saveItemsState(newItems: ProcessedMediaItem[]) {
    setItems(newItems);
    try {
      localStorage.setItem("dcf_processed_media_items_v3", JSON.stringify(newItems));
    } catch {}
  }

  // Handle Upload & Processing through AI Assistant
  async function handleMediaUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setConfirmationMessage(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("searchQuery", uploadQuery.trim());
      formData.append("category", uploadCategory);
      formData.append("material", uploadMaterial);
      formData.append("orientation", uploadOrientation);

      if (uploadFile) {
        formData.append("file", uploadFile);
      } else if (uploadUrl.trim()) {
        formData.append("directUrl", uploadUrl.trim());
      } else {
        throw new Error("Please select a file to upload or enter a direct media URL.");
      }

      const res = await fetch("/api/admin/media-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process media upload.");
      }

      // Exact Confirmation Response
      setConfirmationMessage(data.message);
      setConfirmationHostedUrl(data.hostedUrl);
      setConfirmationProvider(data.provider);

      // Add to repository items list
      const newItem: ProcessedMediaItem = {
        id: "m_" + Date.now(),
        searchQuery: uploadQuery.trim(),
        category: uploadCategory,
        material: uploadMaterial,
        orientation: uploadOrientation,
        mediaKind: data.mediaKind,
        provider: data.provider,
        hostedUrl: data.hostedUrl,
        price: 49000,
        timestamp: new Date().toISOString(),
      };

      const updated = [newItem, ...items];
      saveItemsState(updated);

      // Reset inputs
      setUploadFile(null);
      setUploadUrl("");
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Filtered Items (Strictly without path leakage)
  const filteredItems = items
    .filter((item) => {
      const q = activeQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        item.searchQuery.toLowerCase().includes(q) ||
        (q === "l sofa" && item.searchQuery.toLowerCase().includes("sofa"));
      const matchesCat = item.category === activeCategory;
      const matchesMat = item.material === activeMaterial;
      return matchesQ && matchesCat && matchesMat;
    })
    .sort((a, b) => {
      const pA = a.price || 0;
      const pB = b.price || 0;
      return priceSort === "asc" ? pA - pB : pB - pA;
    });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 p-4 sm:p-8 font-sans selection:bg-[#d4af37] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-1">
              <span>Dream Comfort Furniture</span>
              <span>/</span>
              <span>AI Media Processing Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#92751f] text-slate-950 text-xl font-black">
                DC
              </span>
              Media Processing & Metadata Routing Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Strict 3-tier metadata tagging and provider routing (Postimages for Images, Cloudinary for Videos) with zero internal path exposure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/media-admin.html"
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 hover:text-white transition"
            >
              Standalone Media Studio ↗
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-slate-950 hover:bg-[#ebd178] shadow-lg shadow-[#d4af37]/25 transition"
            >
              ← Back to Admin
            </Link>
          </div>
        </header>

        {/* ====================================================================
            AI MEDIA UPLOAD & ROUTING CONSOLE
            ==================================================================== */}
        <section className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-sm">
                📤
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Upload & Route Media Asset
                </h2>
                <span className="text-xs text-slate-400">
                  Images auto-route to <strong className="text-sky-400">Postimages</strong> &bull; Videos auto-route to <strong className="text-purple-400">Cloudinary</strong>
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              Path Security Active (Zero Leakage)
            </span>
          </div>

          <form onSubmit={handleMediaUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Tier 1: Search Query Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Tier 1: Search Query *</span>
                  <span className="text-[11px] text-slate-500">e.g. &quot;l sofa&quot;</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadQuery}
                  onChange={(e) => setUploadQuery(e.target.value)}
                  placeholder="e.g. l sofa, dining table, study desk"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Tier 2: Category / Room Dropdown (5 Options) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Tier 2: Category / Room *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as MandatoryCategory)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  {MANDATORY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier 3: Material Dropdown (5 Options) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Tier 3: Material *
                </label>
                <select
                  value={uploadMaterial}
                  onChange={(e) => setUploadMaterial(e.target.value as MandatoryMaterial)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  {MANDATORY_MATERIALS.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Layout Orientation & File Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/5">
              
              {/* Layout Orientation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Layout Orientation Parameter *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      uploadOrientation === "Horizontal"
                        ? "bg-[#d4af37]/20 border-[#d4af37] text-white shadow-md shadow-[#d4af37]/10"
                        : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orientation"
                      value="Horizontal"
                      checked={uploadOrientation === "Horizontal"}
                      onChange={() => setUploadOrientation("Horizontal")}
                      className="hidden"
                    />
                    <span>🖼️ Horizontal (Landscape)</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      uploadOrientation === "Vertical"
                        ? "bg-[#d4af37]/20 border-[#d4af37] text-white shadow-md shadow-[#d4af37]/10"
                        : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orientation"
                      value="Vertical"
                      checked={uploadOrientation === "Vertical"}
                      onChange={() => setUploadOrientation("Vertical")}
                      className="hidden"
                    />
                    <span>📱 Vertical (Portrait)</span>
                  </label>
                </div>
              </div>

              {/* Media File or Direct URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Media File (Auto-Detects Image / Video)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-slate-950 hover:file:bg-[#ebd178] cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500 text-center">- OR direct link -</div>
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://... direct image or video link"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs">
                ⚠️ {uploadError}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-[#ebd178] text-slate-950 hover:brightness-110 transition shadow-xl shadow-[#d4af37]/25 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Processing & Routing Media...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Process & Route Media</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ==================================================================
              CONFIRMATION RESPONSE BANNER (EXACT FORMAT, NO PATH LEAKAGE)
              ================================================================== */}
          {confirmationMessage && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-emerald-100 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Upload & Metadata Routing Confirmed
                  </span>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    &quot;{confirmationMessage}&quot;
                  </p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-300 font-semibold">Hosted Provider:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-white font-mono font-bold">
                        {confirmationProvider}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-emerald-300 font-semibold">Hosted Media URL:</span>
                      <a
                        href={confirmationHostedUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 hover:text-white underline font-mono text-[11px] truncate max-w-xs sm:max-w-md"
                      >
                        {confirmationHostedUrl}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ====================================================================
            RETRIEVAL & FILTERING (STRICTLY NO PATH DISPLAY)
            ==================================================================== */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Catalog Asset Retrieval
              </h2>
              <span className="text-xs text-slate-400">
                Filter and browse catalog assets matching your active 3-tier selection.
              </span>
            </div>

            {/* Price Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Price Sort:</span>
              <div className="flex bg-slate-950 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setPriceSort("asc")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    priceSort === "asc"
                      ? "bg-[#d4af37] text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Low to High ↑
                </button>
                <button
                  onClick={() => setPriceSort("desc")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    priceSort === "desc"
                      ? "bg-[#d4af37] text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  High to Low ↓
                </button>
              </div>
            </div>
          </div>

          {/* 3-Tier Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Filter Query</label>
              <input
                type="text"
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                placeholder="Search item query..."
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Category / Room</label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as MandatoryCategory)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {MANDATORY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Material</label>
              <select
                value={activeMaterial}
                onChange={(e) => setActiveMaterial(e.target.value as MandatoryMaterial)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {MANDATORY_MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>
                Found <strong className="text-white">{filteredItems.length}</strong> matching item(s) for &quot;<strong>{activeQuery}</strong>&quot; in <span className="text-[#d4af37] font-semibold">{activeCategory}</span> ({activeMaterial})
              </span>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-950/80 border border-white/10 hover:border-[#d4af37]/60 rounded-2xl overflow-hidden shadow-lg transition flex flex-col"
                  >
                    {/* Media Preview Box */}
                    <div
                      onClick={() => setActiveLightboxItem(item)}
                      className="relative h-48 w-full bg-black cursor-pointer overflow-hidden"
                    >
                      {item.mediaKind === "Video" ? (
                        <>
                          <video
                            src={item.hostedUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            preload="metadata"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center font-bold shadow-lg">
                              ▶
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.hostedUrl}
                          alt={item.searchQuery}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback image if sample postimages url is mock
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      )}

                      {/* Provider & Orientation Badges */}
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.provider === "Cloudinary"
                              ? "bg-purple-600 text-white"
                              : "bg-sky-500 text-slate-950"
                          }`}
                        >
                          {item.provider}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-semibold border border-white/15">
                          {item.orientation}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 border border-[#d4af37]/40 text-[#d4af37] font-mono font-bold text-xs">
                        ₹{item.price?.toLocaleString("en-IN") || "49,000"}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white capitalize">
                            {item.searchQuery}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.material}
                          </span>
                        </div>
                        <p className="text-xs text-[#d4af37] font-medium mt-0.5">
                          {item.category}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <a
                          href={item.hostedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline font-mono truncate max-w-[150px]"
                        >
                          View Direct Link ↗
                        </a>
                        <button
                          onClick={() => setActiveLightboxItem(item)}
                          className="text-[#d4af37] hover:underline font-semibold"
                        >
                          Lightbox →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 text-slate-400 text-xs">
                No matching media found for current selection. Use the upload panel above to add new media.
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ====================================================================
          LIGHTBOX MODAL
          ==================================================================== */}
      {activeLightboxItem && (
        <div
          onClick={() => setActiveLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-white border-b border-white/10 pb-4"
          >
            <div>
              <h3 className="font-bold text-base sm:text-lg capitalize">
                {activeLightboxItem.searchQuery} ({activeLightboxItem.material})
              </h3>
              <p className="text-xs text-[#d4af37] font-medium">
                {activeLightboxItem.category} &bull; {activeLightboxItem.orientation} &bull; Hosted on {activeLightboxItem.provider}
              </p>
            </div>
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
            >
              ✕
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center p-4 max-h-[80vh]"
          >
            {activeLightboxItem.mediaKind === "Video" ? (
              <video
                src={activeLightboxItem.hostedUrl}
                controls
                autoPlay
                className="max-h-[75vh] max-w-[90vw] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={activeLightboxItem.hostedUrl}
                alt={activeLightboxItem.searchQuery}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            )}
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="text-center text-xs text-slate-400 border-t border-white/10 pt-3 flex items-center justify-center gap-4"
          >
            <a
              href={activeLightboxItem.hostedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:underline font-mono"
            >
              Open Original {activeLightboxItem.provider} URL ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
