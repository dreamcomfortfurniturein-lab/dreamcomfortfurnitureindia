"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface CustomerOffer {
  id: string;
  title: string;
  discount: string;
  code: string;
  category: string;
  badge: string;
  description: string;
  validUntil: string;
  minOrder: number;
  active: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  activeOffersClaimed: string[];
  status: string;
}

interface CustomerOffersSectionProps {
  offers: CustomerOffer[];
  customers: CustomerRecord[];
  onUpdateOffers: (updated: CustomerOffer[]) => void;
  onUpdateCustomers?: (updated: CustomerRecord[]) => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

const OFFER_CATEGORIES = [
  "All Categories",
  "Living Room",
  "Bedroom Sets",
  "Handcrafted Solid Teak",
  "Dining Suites",
  "Ergonomic Office",
  "Royal Recliners",
];

export default function CustomerOffersSection({
  offers,
  customers,
  onUpdateOffers,
  onShowToast,
}: CustomerOffersSectionProps) {
  const [subTab, setSubTab] = useState<"offers" | "customers">("offers");
  const [searchQuery, setSearchQuery] = useState("");

  // Offer modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState<CustomerOffer>({
    id: "",
    title: "",
    discount: "",
    code: "",
    category: "Living Room",
    badge: "Limited Time Flash Sale",
    description: "",
    validUntil: "30 Nov 2026",
    minOrder: 35000,
    active: true,
  });

  const [deleteConfirmOfferId, setDeleteConfirmOfferId] = useState<string | null>(null);

  // Filter offers
  const filteredOffers = offers.filter(
    (o) =>
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle active/pause offer
  function handleToggleOfferActive(id: string) {
    const updated = offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o));
    onUpdateOffers(updated);
    try {
      localStorage.setItem("dcf_customer_offers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    const target = updated.find((o) => o.id === id);
    onShowToast(
      `Offer "${target?.title}" is now ${target?.active ? "Active on Customer Portal" : "Paused"}.`,
      "info"
    );
  }

  // Open create modal
  function openCreateOfferModal() {
    setEditingOfferId(null);
    setOfferForm({
      id: `OFFER-${Date.now().toString().slice(-4)}`,
      title: "",
      discount: "20% OFF",
      code: "LUXURY20",
      category: "Living Room",
      badge: "Exclusive Festive Offer",
      description: "Applies to hand-crafted solid teak living room sofas and armchairs.",
      validUntil: "30 Nov 2026",
      minOrder: 40000,
      active: true,
    });
    setIsOfferModalOpen(true);
  }

  // Open edit modal
  function openEditOfferModal(offer: CustomerOffer) {
    setEditingOfferId(offer.id);
    setOfferForm({ ...offer });
    setIsOfferModalOpen(true);
  }

  // Save offer (Create or Update)
  function handleSaveOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!offerForm.title || !offerForm.code || !offerForm.discount) {
      onShowToast("Title, coupon code, and discount amount are required.", "error");
      return;
    }

    let updated: CustomerOffer[];
    if (editingOfferId) {
      updated = offers.map((o) => (o.id === editingOfferId ? offerForm : o));
      onShowToast(`Offer "${offerForm.title}" updated and published to Customer Portal.`, "success");
    } else {
      updated = [offerForm, ...offers];
      onShowToast(`New offer "${offerForm.title}" published directly to Customer Portal!`, "success");
    }

    onUpdateOffers(updated);
    try {
      localStorage.setItem("dcf_customer_offers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsOfferModalOpen(false);
  }

  // Delete offer
  function handleDeleteOffer(id: string) {
    const updated = offers.filter((o) => o.id !== id);
    onUpdateOffers(updated);
    try {
      localStorage.setItem("dcf_customer_offers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setDeleteConfirmOfferId(null);
    onShowToast("Promotional offer removed from customer portal.", "info");
  }

  return (
    <section className="space-y-6">
      {/* Top Banner Overview */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-gold/20 shadow-xl bg-navy-900/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                Customer & Offers Management
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
                Tier 1 Portal Integration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sand-300/80 mt-1">
              Issue promotional coupons and manage verified customer portfolios. All active vouchers publish directly to the live Customer Portal (
              <span className="text-gold font-mono">/customer</span>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/customer"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-navy-800 text-gold border border-gold/30 hover:border-gold text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>🛍️ Live Customer Portal →</span>
            </Link>

            <button
              onClick={openCreateOfferModal}
              className="gold-gradient-bg text-navy-900 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 flex items-center gap-1.5 transition-all"
            >
              <span>+ Issue New Offer</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-3 mt-6 border-b border-gold/15 pb-2">
          <button
            onClick={() => setSubTab("offers")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subTab === "offers"
                ? "bg-gold text-navy-900 shadow-md shadow-gold/20"
                : "text-sand-300 hover:text-sand-100 bg-navy-800/60"
            }`}
          >
            <span>🎟️ Promotional Offers ({offers.length})</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                subTab === "offers" ? "bg-navy-900 text-gold" : "bg-navy-700 text-sand-300"
              }`}
            >
              {offers.filter((o) => o.active).length} Active
            </span>
          </button>

          <button
            onClick={() => setSubTab("customers")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subTab === "customers"
                ? "bg-gold text-navy-900 shadow-md shadow-gold/20"
                : "text-sand-300 hover:text-sand-100 bg-navy-800/60"
            }`}
          >
            <span>👥 Customer Registry ({customers.length})</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            subTab === "offers"
              ? "Search offers by title, code, or category..."
              : "Search customers by name, email, phone, city..."
          }
          className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold"
        />
        <span className="absolute left-3 top-2.5 text-xs text-sand-300/60">🔍</span>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: PROMOTIONAL OFFERS LIST */}
      {/* ========================================================================= */}
      {subTab === "offers" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  offer.active
                    ? "border-gold/30 bg-navy-900/80 hover:border-gold shadow-lg"
                    : "border-sand-300/10 bg-navy-950/60 opacity-70"
                }`}
              >
                <div>
                  {/* Badge & Active Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 truncate">
                      {offer.badge}
                    </span>
                    <button
                      onClick={() => handleToggleOfferActive(offer.id)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                        offer.active
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300"
                          : "bg-sand-500/10 text-sand-400 border-sand-500/20 hover:bg-emerald-500/20 hover:text-emerald-300"
                      }`}
                      title={offer.active ? "Click to Pause" : "Click to Activate"}
                    >
                      {offer.active ? "● Published Live" : "○ Paused"}
                    </button>
                  </div>

                  {/* Title & Discount */}
                  <h3 className="font-display font-bold text-base text-sand-50 leading-snug">
                    {offer.title}
                  </h3>
                  <div className="text-xl font-extrabold text-gold-accent font-serif mt-1">
                    {offer.discount}
                  </div>

                  {/* Code Block */}
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-gold/20 font-mono">
                    <span className="text-xs text-sand-300/80">Coupon Code:</span>
                    <strong className="text-sm text-gold tracking-widest">{offer.code}</strong>
                  </div>

                  <p className="text-xs text-sand-300/70 mt-2.5 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gold/10 text-[11px] text-sand-300/60 space-y-1">
                    <div>
                      Category: <span className="text-sand-200">{offer.category}</span>
                    </div>
                    <div>
                      Min Order:{" "}
                      <span className="text-sand-200 font-mono">₹{offer.minOrder.toLocaleString()}</span> •
                      Valid Till: <span className="text-sand-200">{offer.validUntil}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gold/15">
                  <div className="text-[10px] text-sand-300/50 font-mono">{offer.id}</div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditOfferModal(offer)}
                      className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-gold border border-gold/30 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmOfferId(offer.id)}
                      className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs"
                      title="Delete Offer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: CUSTOMER REGISTRY TABLE */}
      {/* ========================================================================= */}
      {subTab === "customers" && (
        <div className="glass-card rounded-2xl border border-gold/20 overflow-hidden shadow-2xl bg-navy-900/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-sand-200">
              <thead className="bg-navy-950 text-[11px] uppercase tracking-wider text-sand-300/70 border-b border-gold/20">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                  <th className="py-3.5 px-4 font-semibold">Tier & Location</th>
                  <th className="py-3.5 px-4 font-semibold">Order History</th>
                  <th className="py-3.5 px-4 font-semibold">Claimed Vouchers</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-sand-50">{cust.name}</div>
                      <div className="text-xs text-sand-300/70 font-mono">{cust.email}</div>
                      <div className="text-[11px] text-sand-300/50 font-mono">{cust.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
                        {cust.tier} Member
                      </span>
                      <div className="text-[11px] text-sand-300/70 mt-1">{cust.city}</div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <div className="text-sand-100 font-bold">
                        ₹{cust.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-sand-300/60">
                        {cust.totalOrders} order(s) • Last {cust.lastOrderDate}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {cust.activeOffersClaimed.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cust.activeOffersClaimed.map((code, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-gold border border-gold/30 font-mono"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sand-300/40 text-xs">No active vouchers applied</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE OR EDIT PROMOTIONAL OFFER */}
      {/* ========================================================================= */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveOffer}
            className="bg-navy-900 border border-gold/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  {editingOfferId ? "Edit Promotional Offer" : "Issue New Promotional Offer"}
                </h3>
                <span className="text-xs text-gold">Publishes directly to Customer Portal</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">Offer Title *</label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. Diwali Royal Living Room Edit"
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Discount Value *</label>
                  <input
                    type="text"
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    placeholder="e.g. 25% OFF or ₹10,000 Flat"
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Coupon Code *</label>
                  <input
                    type="text"
                    value={offerForm.code}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                    }
                    placeholder="e.g. FESTIVE25"
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Category</label>
                  <select
                    value={offerForm.category}
                    onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  >
                    {OFFER_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Badge Highlight</label>
                  <input
                    type="text"
                    value={offerForm.badge}
                    onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                    placeholder="e.g. Limited Time Flash Sale"
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">Offer Description</label>
                <textarea
                  rows={2}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Detail terms, free delivery, or eligible furniture styles..."
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Min Order (₹)</label>
                  <input
                    type="number"
                    value={offerForm.minOrder}
                    onChange={(e) => setOfferForm({ ...offerForm, minOrder: Number(e.target.value) })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Valid Until</label>
                  <input
                    type="text"
                    value={offerForm.validUntil}
                    onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                    placeholder="30 Nov 2026"
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="active_checkbox"
                  checked={offerForm.active}
                  onChange={(e) => setOfferForm({ ...offerForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-gold focus:ring-gold bg-navy-950"
                />
                <label htmlFor="active_checkbox" className="text-xs text-sand-200 cursor-pointer">
                  Publish immediately to Customer Portal
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                {editingOfferId ? "Update & Sync" : "Publish Offer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmOfferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-sand-50">Delete Promotional Offer?</h4>
            <p className="text-xs text-sand-300/80">
              This coupon will be immediately withdrawn from the Customer Portal. Shoppers will no longer be able to claim it.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOfferId(null)}
                className="px-4 py-2 rounded-xl border border-sand-300/20 text-sand-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOffer(deleteConfirmOfferId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
