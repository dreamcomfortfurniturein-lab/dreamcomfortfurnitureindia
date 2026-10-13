"use client";

import React, { useState } from "react";

export interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  rank: string;
  status: "Active" | "Pending" | "Suspended";
  bv: number;
  pv: number;
  joinedDate: string;
  permissions: string[];
}

interface DistributorManagementSectionProps {
  distributors: Distributor[];
  onUpdateDistributors: (updated: Distributor[]) => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

const AVAILABLE_PERMISSIONS = [
  "Full Network Access",
  "Direct Selling Leader",
  "Team Downline View",
  "Weekly Payouts",
  "Retail Margins",
  "Showroom Showcase Access",
  "Bonus Commission Claims",
];

const AVAILABLE_RANKS = [
  "Crown Ambassador",
  "Diamond Leader",
  "Gold Leader",
  "Silver Exec",
  "Bronze Advisor",
  "Associate",
];

export default function DistributorManagementSection({
  distributors,
  onUpdateDistributors,
  onShowToast,
}: DistributorManagementSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Pending" | "Suspended">("All");

  // Modals state
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState<Distributor | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState<Partial<Distributor>>({
    name: "",
    email: "",
    phone: "",
    rank: "Associate",
    status: "Pending",
    bv: 0,
    pv: 0,
    permissions: ["Retail Margins"],
  });

  // Filtered list
  const filteredDistributors = distributors.filter((dist) => {
    const matchesSearch =
      dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "All" || dist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = distributors.filter((d) => d.status === "Active").length;
  const pendingCount = distributors.filter((d) => d.status === "Pending").length;
  const suspendedCount = distributors.filter((d) => d.status === "Suspended").length;

  // 1. Approve Action
  function handleApprove(id: string) {
    const targetDist = distributors.find((d) => d.id === id || (d.email && d.email.toLowerCase() === id.toLowerCase()));
    const updated = distributors.map((d) => {
      if (d.id === id || (d.email && d.email.toLowerCase() === id.toLowerCase())) {
        const perms = d.permissions.includes("Full Network Access")
          ? d.permissions
          : [...d.permissions.filter((p) => !p.includes("Pending")), "Full Network Access", "Direct Selling Leader", "Weekly Payouts"];
        return { ...d, status: "Active" as const, permissions: perms };
      }
      return d;
    });
    onUpdateDistributors(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dcf_auth_change"));
    }

    // Persist approval to server API so partner access works across devices immediately
    try {
      fetch("/api/admin/distributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          email: targetDist?.email,
          status: "Active",
        }),
      });
    } catch (e) {
      console.warn("Server sync error:", e);
    }

    onShowToast(`Distributor ${targetDist?.name || id} (${targetDist?.email || id}) successfully approved and granted Network Access!`, "success");
  }

  // 2. Suspend Action
  function handleSuspend(id: string) {
    const targetDist = distributors.find((d) => d.id === id || (d.email && d.email.toLowerCase() === id.toLowerCase()));
    const updated = distributors.map((d) => {
      if (d.id === id || (d.email && d.email.toLowerCase() === id.toLowerCase())) {
        return {
          ...d,
          status: "Suspended" as const,
          permissions: ["Suspended - Audit Required"],
        };
      }
      return d;
    });
    onUpdateDistributors(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dcf_auth_change"));
    }

    // Persist suspension to server API
    try {
      fetch("/api/admin/distributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          email: targetDist?.email,
          status: "Suspended",
        }),
      });
    } catch (e) {
      console.warn("Server sync error:", e);
    }

    onShowToast(`Distributor ${targetDist?.name || id} has been suspended. Operational workflows locked.`, "error");
  }

  // 3. Open Modify Modal
  function openModifyModal(dist: Distributor) {
    setSelectedDistributor(dist);
    setEditForm({ ...dist });
    setIsModifyModalOpen(true);
  }

  // Save Modify Action
  function handleSaveModify(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;

    const updated = distributors.map((d) => (d.id === editForm.id ? editForm : d));
    onUpdateDistributors(updated);
    setIsModifyModalOpen(false);
    onShowToast(`Distributor ${editForm.id} profile updated successfully.`, "success");
  }

  // 4. Open Permissions Modal
  function openPermissionsModal(dist: Distributor) {
    setSelectedDistributor(dist);
    setEditPermissions([...dist.permissions]);
    setIsPermissionsModalOpen(true);
  }

  // Toggle permission
  function togglePermission(perm: string) {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  }

  // Save Permissions
  function handleSavePermissions() {
    if (!selectedDistributor) return;

    const updated = distributors.map((d) =>
      d.id === selectedDistributor.id ? { ...d, permissions: editPermissions } : d
    );
    onUpdateDistributors(updated);
    setIsPermissionsModalOpen(false);
    onShowToast(`Permissions updated for distributor ${selectedDistributor.id}.`, "success");
  }

  // 5. Open Delete Modal
  function openDeleteModal(dist: Distributor) {
    setSelectedDistributor(dist);
    setIsDeleteModalOpen(true);
  }

  // Confirm Delete
  function handleConfirmDelete() {
    if (!selectedDistributor) return;

    const updated = distributors.filter((d) => d.id !== selectedDistributor.id);
    onUpdateDistributors(updated);
    setIsDeleteModalOpen(false);
    onShowToast(`Distributor ${selectedDistributor.id} permanently removed from registry.`, "info");
  }

  // 6. Create New Distributor
  function handleCreateDistributor(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name || !createForm.email) {
      onShowToast("Name and email are required.", "error");
      return;
    }

    const newId = `DC${Math.floor(100000 + Math.random() * 900000)}`;
    const newDist: Distributor = {
      id: newId,
      name: createForm.name || "New Distributor",
      email: createForm.email || "",
      phone: createForm.phone || "+91 99999 00000",
      rank: createForm.rank || "Associate",
      status: (createForm.status as "Active" | "Pending") || "Pending",
      bv: Number(createForm.bv) || 0,
      pv: Number(createForm.pv) || 0,
      joinedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      permissions: createForm.permissions || ["Retail Margins"],
    };

    onUpdateDistributors([newDist, ...distributors]);
    setIsCreateModalOpen(false);
    setCreateForm({
      name: "",
      email: "",
      phone: "",
      rank: "Associate",
      status: "Pending",
      bv: 0,
      pv: 0,
      permissions: ["Retail Margins"],
    });
    onShowToast(`Distributor ${newId} registered successfully.`, "success");
  }

  return (
    <section className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-gold/20 shadow-xl bg-navy-900/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💼</span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                Distributor Network Management
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
                Tier 2 Portal Control
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sand-300/80 mt-1">
              Master Admin authority over registered direct-selling distributors, operational status, genealogy rights, and role permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="gold-gradient-bg text-navy-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 flex items-center gap-2 transition-all"
            >
              <span>+ Register Distributor</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-gold/15">
            <span className="text-[11px] text-sand-300/70 uppercase tracking-wider block font-medium">
              Total Registered
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              {distributors.length}
            </div>
            <span className="text-[10px] text-gold mt-1 block">Full Distributor Registry</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-emerald-500/20">
            <span className="text-[11px] text-emerald-400/80 uppercase tracking-wider block font-medium">
              Active Leaders
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {activeCount}
            </div>
            <span className="text-[10px] text-emerald-400/70 mt-1 block">Full Portal Operational</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-amber-500/20">
            <span className="text-[11px] text-amber-400/80 uppercase tracking-wider block font-medium">
              Pending Approval
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
              {pendingCount}
            </div>
            <span className="text-[10px] text-amber-400/70 mt-1 block">Awaiting Verification</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-rose-500/20">
            <span className="text-[11px] text-rose-400/80 uppercase tracking-wider block font-medium">
              Suspended
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono mt-1">
              {suspendedCount}
            </div>
            <span className="text-[10px] text-rose-400/70 mt-1 block">Access Restricted</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-navy-850 p-4 rounded-xl border border-gold/15">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, email, or phone..."
            className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold"
          />
          <span className="absolute left-3 top-2.5 text-xs text-sand-300/60">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-sand-300/60 hover:text-sand-100"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["All", "Active", "Pending", "Suspended"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === filter
                  ? "bg-gold text-navy-900 font-bold shadow-md shadow-gold/20"
                  : "bg-navy-800 text-sand-300 hover:text-sand-100 border border-gold/10"
              }`}
            >
              {filter}
              <span className="ml-1 text-[10px] opacity-75">
                (
                {filter === "All"
                  ? distributors.length
                  : filter === "Active"
                  ? activeCount
                  : filter === "Pending"
                  ? pendingCount
                  : suspendedCount}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Distributors Registry Table */}
      <div className="glass-card rounded-2xl border border-gold/20 overflow-hidden shadow-2xl bg-navy-900/70">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-sand-200">
            <thead className="bg-navy-950 text-[11px] uppercase tracking-wider text-sand-300/70 border-b border-gold/20">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Distributor Info</th>
                <th className="py-3.5 px-4 font-semibold">Rank & Volume</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Permissions</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredDistributors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sand-300/60">
                    <p className="text-sm">No distributors found matching filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredDistributors.map((dist) => (
                  <tr key={dist.id} className="hover:bg-navy-800/40 transition-colors">
                    {/* 1. Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-xs shrink-0 border border-gold/40">
                          {dist.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sand-50 flex items-center gap-1.5">
                            <span>{dist.name}</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-navy-800 text-gold border border-gold/30">
                              {dist.id}
                            </span>
                          </div>
                          <div className="text-xs text-sand-300/70 font-mono mt-0.5">{dist.email}</div>
                          <div className="text-[11px] text-sand-300/50 mt-0.5">{dist.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Rank & Volume */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gold-accent">{dist.rank}</div>
                      <div className="text-xs text-sand-300/80 font-mono mt-0.5">
                        {dist.bv.toLocaleString()} BV • {dist.pv} PV
                      </div>
                      <div className="text-[11px] text-sand-300/50">Joined {dist.joinedDate}</div>
                    </td>

                    {/* 3. Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          dist.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : dist.status === "Pending"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {dist.status}
                      </span>
                    </td>

                    {/* 4. Permissions */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {dist.permissions.slice(0, 2).map((perm, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-sand-200 border border-sand-300/15 whitespace-nowrap"
                          >
                            {perm}
                          </span>
                        ))}
                        {dist.permissions.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-gold border border-gold/30 font-mono">
                            +{dist.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Admin Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedDistributor(dist);
                            setIsDetailsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-sand-200 border border-gold/20 text-xs transition-colors"
                          title="View Full Profile"
                        >
                          Details
                        </button>

                        {/* Approve (if not active) */}
                        {dist.status !== "Active" && (
                          <button
                            onClick={() => handleApprove(dist.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                            title="Approve Distributor"
                          >
                            Approve
                          </button>
                        )}

                        {/* Suspend (if active) */}
                        {dist.status === "Active" && (
                          <button
                            onClick={() => handleSuspend(dist.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs transition-colors"
                            title="Suspend Account"
                          >
                            Suspend
                          </button>
                        )}

                        {/* Modify */}
                        <button
                          onClick={() => openModifyModal(dist)}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-gold border border-gold/30 text-xs transition-colors"
                          title="Modify Information"
                        >
                          Modify
                        </button>

                        {/* Assign Permissions */}
                        <button
                          onClick={() => openPermissionsModal(dist)}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-gold/20 text-sand-200 hover:text-gold border border-gold/20 text-xs transition-colors"
                          title="Configure Permissions"
                        >
                          Permissions
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDeleteModal(dist)}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs transition-colors border border-rose-800/40"
                          title="Delete Record"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW DETAILS */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && selectedDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-gold/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">Distributor Dossier</h3>
                <span className="text-xs text-gold font-mono">{selectedDistributor.id}</span>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-navy-850">
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Full Name</span>
                  <strong className="text-sand-100">{selectedDistributor.name}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Rank</span>
                  <strong className="text-gold">{selectedDistributor.rank}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Email</span>
                  <span className="text-sand-200 font-mono text-xs">{selectedDistributor.email}</span>
                </div>
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Phone</span>
                  <span className="text-sand-200 font-mono text-xs">{selectedDistributor.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Joined Date</span>
                  <span className="text-sand-200">{selectedDistributor.joinedDate}</span>
                </div>
                <div>
                  <span className="text-[11px] text-sand-300/70 block">Volume Standing</span>
                  <span className="text-emerald-400 font-mono">
                    {selectedDistributor.bv.toLocaleString()} BV ({selectedDistributor.pv} PV)
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-sand-300/80 block mb-1.5 font-medium">
                  Assigned Operational Permissions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistributor.permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-navy-800 text-gold border border-gold/30 text-xs"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gold/15">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs hover:bg-navy-750"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MODIFY DISTRIBUTOR */}
      {/* ========================================================================= */}
      {isModifyModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveModify}
            className="bg-navy-900 border border-gold/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  Modify Distributor Profile
                </h3>
                <span className="text-xs text-gold font-mono">{editForm.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModifyModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Rank Tier</label>
                  <select
                    value={editForm.rank}
                    onChange={(e) => setEditForm({ ...editForm, rank: e.target.value })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  >
                    {AVAILABLE_RANKS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as "Active" | "Pending" | "Suspended",
                      })
                    }
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">BV (Volume)</label>
                  <input
                    type="number"
                    value={editForm.bv}
                    onChange={(e) => setEditForm({ ...editForm, bv: Number(e.target.value) })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">PV (Personal)</label>
                  <input
                    type="number"
                    value={editForm.pv}
                    onChange={(e) => setEditForm({ ...editForm, pv: Number(e.target.value) })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setIsModifyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN PERMISSIONS */}
      {/* ========================================================================= */}
      {isPermissionsModalOpen && selectedDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-gold/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">Assign Permissions</h3>
                <span className="text-xs text-gold">
                  {selectedDistributor.name} ({selectedDistributor.id})
                </span>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-sand-300/70">
              Admin authority grant: Toggle specific operational capabilities permitted for this distributor account.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isSelected = editPermissions.includes(perm);
                return (
                  <label
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gold/15 border-gold text-sand-50 font-medium"
                        : "bg-navy-950/60 border-gold/15 text-sand-300 hover:bg-navy-800"
                    }`}
                  >
                    <span>{perm}</span>
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                        isSelected ? "bg-gold text-navy-900 border-gold font-bold" : "border-sand-300/30"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Update Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && selectedDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-sand-50">Delete Distributor Record?</h4>
            <p className="text-xs text-sand-300/80">
              Are you sure you want to remove <strong className="text-sand-100">{selectedDistributor.name}</strong> (
              <span className="font-mono text-gold">{selectedDistributor.id}</span>)? This action is permanent.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-sand-300/20 text-sand-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REGISTER NEW DISTRIBUTOR */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateDistributor}
            className="bg-navy-900 border border-gold/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  Register New Distributor
                </h3>
                <span className="text-xs text-sand-300/70">Onboard directly into Tier 2 Portal</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    required
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+91 98480 00000"
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Rank Tier</label>
                  <select
                    value={createForm.rank}
                    onChange={(e) => setCreateForm({ ...createForm, rank: e.target.value })}
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  >
                    {AVAILABLE_RANKS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sand-300/80 text-xs mb-1 font-medium">Initial Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        status: e.target.value as "Active" | "Pending",
                      })
                    }
                    className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Active">Active (Immediate)</option>
                    <option value="Pending">Pending (Verification)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
