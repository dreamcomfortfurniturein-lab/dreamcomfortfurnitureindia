"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ASSET_CATEGORIES,
  ASSET_MATERIALS,
  AssetCategory,
  AssetMaterial,
  MediaAsset,
  RepositoryFolder,
  PriceSortOrder,
  execute3TierPipeline,
  DEFAULT_REPOSITORY_ASSETS,
  normalizeItemName,
} from "@/lib/asset-manager";

const ASSETS_STORAGE_KEY = "dcf_assets_repository_v1";
const FOLDERS_STORAGE_KEY = "dcf_folders_registry_v1";

export default function AssetManagerPage() {
  // 3-Tier Pipeline State
  const [searchQuery, setSearchQuery] = useState("l sofa");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>("Living Room");
  const [selectedMaterial, setSelectedMaterial] = useState<AssetMaterial>("Fabric");
  const [priceSort, setPriceSort] = useState<PriceSortOrder>("asc");

  // Repository Data State
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<RepositoryFolder[]>([]);
  const [autoCreatedAlert, setAutoCreatedAlert] = useState<string | null>(null);

  // Lightbox Modal State
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<MediaAsset | null>(null);

  // Quick Add Asset Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("45000");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"photo" | "video">("photo");
  const [newAspect, setNewAspect] = useState<"horizontal" | "vertical">("horizontal");

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const savedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
      const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);

      if (savedAssets) {
        setAssets(JSON.parse(savedAssets));
      } else {
        setAssets(DEFAULT_REPOSITORY_ASSETS);
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(DEFAULT_REPOSITORY_ASSETS));
      }

      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      }
    } catch {
      setAssets(DEFAULT_REPOSITORY_ASSETS);
    }
  }, []);

  // Save to localStorage whenever assets/folders change
  const saveAssetsState = (newAssets: MediaAsset[]) => {
    setAssets(newAssets);
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
    } catch {}
  };

  const saveFoldersState = (newFolders: RepositoryFolder[]) => {
    setFolders(newFolders);
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(newFolders));
    } catch {}
  };

  // Run the 3-Tier Pipeline dynamically
  const pipelineOutput = useMemo(() => {
    const { pipelineResult, updatedFolders, newFolderCreated } = execute3TierPipeline(
      searchQuery,
      selectedCategory,
      selectedMaterial,
      priceSort,
      assets,
      folders
    );

    return { pipelineResult, updatedFolders, newFolderCreated };
  }, [searchQuery, selectedCategory, selectedMaterial, priceSort, assets, folders]);

  // Handle auto-folder generation side-effect
  useEffect(() => {
    if (pipelineOutput.newFolderCreated) {
      saveFoldersState(pipelineOutput.updatedFolders);
      setAutoCreatedAlert(pipelineOutput.newFolderCreated.path);
    }
  }, [pipelineOutput.newFolderCreated]);

  // Handle Quick Upload to Current Folder
  function handleAddAssetToCurrentFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const targetFolderPath = pipelineOutput.pipelineResult.folderPath;
    const canonicalItem = normalizeItemName(searchQuery);

    const createdAsset: MediaAsset = {
      id: "ast_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      title: newTitle.trim(),
      price: Number(newPrice) || 0,
      url: newUrl.trim(),
      type: newType,
      aspectRatio: newAspect,
      category: selectedCategory,
      material: selectedMaterial,
      itemTag: canonicalItem,
      folderPath: targetFolderPath,
      createdAt: new Date().toISOString(),
    };

    const updated = [createdAsset, ...assets];
    saveAssetsState(updated);

    // Reset modal
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewUrl("");
  }

  const { pipelineResult } = pipelineOutput;

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 p-4 sm:p-8 font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-1">
              <span>E-Commerce Platform</span>
              <span>/</span>
              <span>Asset Search & Folder System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#92751f] text-slate-950 text-xl font-black">
                DC
              </span>
              Solid Wood Furniture & Office Asset Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Strict 3-Tier filtering pipeline with auto-categorization & auto-folder provisioning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/media-admin.html"
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
            >
              <span>🖼️ Open Standalone HTML Admin</span>
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
            1. STRICT 3-TIER FILTERING PIPELINE CONTROLS
            ==================================================================== */}
        <section className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
              Sequential 3-Tier Filtering Pipeline
            </span>
            <span className="text-xs text-[#d4af37] font-medium">
              Live Evaluation Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* TIER 1: Search Query Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Tier 1: Item Search Query</span>
                <span className="text-[11px] text-slate-500 font-normal">e.g. &quot;l sofa&quot;</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type item name (e.g., l sofa)..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* TIER 2: Category / Room Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Tier 2: Category / Room Selection
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AssetCategory)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition cursor-pointer"
              >
                {ASSET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* TIER 3: Material Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Tier 3: Material Selection
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value as AssetMaterial)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition cursor-pointer"
              >
                {ASSET_MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Directory Path Breadcrumb & Price Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
              <span className="text-slate-400 font-medium">Repository Folder:</span>
              <code className="px-3 py-1 rounded-lg bg-black/60 border border-[#d4af37]/40 text-[#d4af37] font-mono font-bold tracking-tight">
                {pipelineResult.folderPath}
              </code>
              {pipelineResult.folderAutoGenerated ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ★ Newly Auto-Generated
                </span>
              ) : pipelineResult.totalMatches > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                  ✓ Folder Active ({pipelineResult.totalMatches} Items)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  📁 Ready for Upload
                </span>
              )}
            </div>

            {/* Price Sorting Controls (Ascending / Descending) */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-400 font-medium">Organize by Price:</span>
              <div className="flex bg-slate-950 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setPriceSort("asc")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    priceSort === "asc"
                      ? "bg-[#d4af37] text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Price: Low to High ↑
                </button>
                <button
                  onClick={() => setPriceSort("desc")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    priceSort === "desc"
                      ? "bg-[#d4af37] text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Price: High to Low ↓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Auto-Creation Alert Banner (if auto-generated folder) */}
        {autoCreatedAlert && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 text-emerald-100 flex items-start justify-between gap-4 shadow-lg animate-fadeIn">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <strong className="block text-sm font-bold text-white">
                  Auto-Generated Dedicated Platform Folder:
                </strong>
                <code className="text-xs text-emerald-300 font-mono font-bold">
                  {autoCreatedAlert}
                </code>
                <p className="text-xs text-emerald-200/80 mt-1">
                  The searched item does not have existing media yet. A dedicated folder has been automatically registered in the repository so all future assets can be uploaded and indexed according to price.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoCreatedAlert(null)}
              className="text-xs text-emerald-400 hover:text-white font-bold p-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ====================================================================
            2. RESULTS SECTION: MATCHING ASSETS OR EMPTY AUTO-FOLDER STATE
            ==================================================================== */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Folder Assets:</span>
            <span className="text-sm font-normal text-slate-400">
              {pipelineResult.totalMatches} item{pipelineResult.totalMatches === 1 ? "" : "s"} found in{" "}
              <strong className="text-slate-200">{pipelineResult.folderPath}</strong>
            </span>
          </h2>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#ebd178] text-slate-950 transition flex items-center gap-2 shadow-lg shadow-[#d4af37]/20"
          >
            <span>+ Upload Asset to this Folder</span>
          </button>
        </div>

        {pipelineResult.matchedAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineResult.matchedAssets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-slate-900/70 border border-white/10 hover:border-[#d4af37]/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => setActiveLightboxAsset(asset)}
                  className="relative h-52 w-full bg-black cursor-pointer overflow-hidden"
                >
                  {asset.type === "video" ? (
                    <>
                      <video
                        src={asset.url}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        preload="metadata"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center text-lg shadow-xl group-hover:scale-110 transition">
                          ▶
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        asset.type === "video"
                          ? "bg-purple-600 text-white"
                          : "bg-sky-500 text-slate-950"
                      }`}
                    >
                      {asset.type}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-medium backdrop-blur-md">
                      {asset.aspectRatio === "vertical" ? "📱 9:16" : "🖼️ 16:9"}
                    </span>
                  </div>

                  {/* Price Tag Highlight */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 border border-[#d4af37]/40 text-[#d4af37] font-mono font-bold text-sm backdrop-blur-md">
                    ₹{asset.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {asset.description || "Solid wood handcrafted furniture asset."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[160px] font-mono">{asset.folderPath}</span>
                    <button
                      onClick={() => setActiveLightboxAsset(asset)}
                      className="text-[#d4af37] hover:underline font-semibold"
                    >
                      View Fullscreen →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when folder has no media yet */
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border-2 border-dashed border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-3xl mx-auto flex items-center justify-center">
              📁
            </div>
            <h3 className="text-lg font-bold text-white">
              Folder Provisioned: {pipelineResult.folderPath}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              No assets matching <strong className="text-slate-200">&quot;{searchQuery}&quot;</strong> are in this directory yet. You can upload the first photo or video now.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#ebd178] text-slate-950 transition shadow-lg shadow-[#d4af37]/25"
            >
              + Upload First Asset to this Folder
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL: FULLSCREEN LIGHTBOX
          ==================================================================== */}
      {activeLightboxAsset && (
        <div
          onClick={() => setActiveLightboxAsset(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
        >
          {/* Topbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-white border-b border-white/10 pb-4"
          >
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-3">
                <span>{activeLightboxAsset.title}</span>
                <span className="text-[#d4af37] font-mono text-sm">
                  ₹{activeLightboxAsset.price.toLocaleString("en-IN")}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {activeLightboxAsset.folderPath}
              </p>
            </div>
            <button
              onClick={() => setActiveLightboxAsset(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
            >
              ✕
            </button>
          </div>

          {/* Media Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center p-4 max-h-[82vh]"
          >
            {activeLightboxAsset.type === "video" ? (
              <video
                src={activeLightboxAsset.url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={activeLightboxAsset.url}
                alt={activeLightboxAsset.title}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              />
            )}
          </div>

          {/* Bottom Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-center text-xs text-slate-400 border-t border-white/10 pt-3"
          >
            {activeLightboxAsset.description || "Press Esc or click anywhere outside to close"}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ADD ASSET TO CURRENT FOLDER
          ==================================================================== */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Upload Asset to Folder</h3>
                <code className="text-xs text-[#d4af37] font-mono">
                  {pipelineResult.folderPath}
                </code>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAssetToCurrentFolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Sectional L-Sofa in Italian Fabric"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Media Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "photo" | "video")}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Direct Media URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-slate-950 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="newAspect"
                      checked={newAspect === "horizontal"}
                      onChange={() => setNewAspect("horizontal")}
                    />
                    <span>🖼️ Horizontal (16:9)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-slate-950 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="newAspect"
                      checked={newAspect === "vertical"}
                      onChange={() => setNewAspect("vertical")}
                    />
                    <span>📱 Vertical (9:16)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#d4af37] text-slate-950 hover:bg-[#ebd178] transition shadow-lg shadow-[#d4af37]/20"
                >
                  Save & Index to Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
