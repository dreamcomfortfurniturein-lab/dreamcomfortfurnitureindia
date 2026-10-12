"use client";

import React, { useState } from "react";

export interface Assistant {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedScope: string;
  canApprove: boolean;
  status: "Active" | "Suspended";
  addedDate: string;
}

interface AssistantDelegationSectionProps {
  assistants: Assistant[];
  onUpdateAssistants: (updated: Assistant[]) => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

const MAX_ASSISTANTS = 5;

const PRESET_ROLES = [
  { role: "Catalog & Product Reviewer", scope: "Catalog Management & Product Listing" },
  { role: "Customer Offers Coordinator", scope: "Customer Inquiries & Promotional Vouchers" },
  { role: "Showroom Media Curator", scope: "Media Assets & Videos Showcase" },
  { role: "Order Fulfillment Clerk", scope: "Order Milestones & WhatsApp Inquiries" },
  { role: "Distributor Support Liaison", scope: "Distributor Verification Assistance" },
];

export default function AssistantDelegationSection({
  assistants,
  onUpdateAssistants,
  onShowToast,
}: AssistantDelegationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState(PRESET_ROLES[0].role);
  const [formScope, setFormScope] = useState(PRESET_ROLES[0].scope);

  const isLimitReached = assistants.length >= MAX_ASSISTANTS;

  // Handle Delegate Submission with Strict Rule Enforcement
  function handleDelegateSubmit(e: React.FormEvent) {
    e.preventDefault();

    // STRICT ENFORCEMENT: Reject any request to create a 6th assistant
    if (assistants.length >= MAX_ASSISTANTS) {
      onShowToast(
        `SYSTEM ENFORCEMENT REJECTION: Authority Limit Reached (${MAX_ASSISTANTS}/${MAX_ASSISTANTS}). Requests to create a 6th assistant are strictly blocked by system governance.`,
        "error"
      );
      setIsModalOpen(false);
      return;
    }

    if (!formName.trim() || !formEmail.trim()) {
      onShowToast("Assistant name and email are required.", "error");
      return;
    }

    // Check duplicate email
    if (assistants.some((a) => a.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      onShowToast("An assistant with this email is already registered.", "error");
      return;
    }

    const newId = `AST-0${assistants.length + 1}`;
    const newAssistant: Assistant = {
      id: newId,
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      assignedScope: formScope,
      canApprove: false, // STRICT ENFORCEMENT: Never grant top-level master admin privileges
      status: "Active",
      addedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [...assistants, newAssistant];
    onUpdateAssistants(updated);
    try {
      localStorage.setItem("dcf_admin_assistants", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setIsModalOpen(false);
    setFormName("");
    setFormEmail("");
    onShowToast(
      `Assistant ${newAssistant.name} (${newId}) delegated successfully. Slot ${updated.length}/${MAX_ASSISTANTS} assigned.`,
      "success"
    );
  }

  // Toggle Assistant Status (Active / Suspended)
  function handleToggleStatus(id: string) {
    const updated = assistants.map((a) => {
      if (a.id === id) {
        const nextStatus = a.status === "Active" ? ("Suspended" as const) : ("Active" as const);
        return { ...a, status: nextStatus };
      }
      return a;
    });
    onUpdateAssistants(updated);
    try {
      localStorage.setItem("dcf_admin_assistants", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    const target = updated.find((a) => a.id === id);
    onShowToast(`Assistant ${target?.name} status changed to ${target?.status}.`, "info");
  }

  // Revoke Assistant (Frees up slot)
  function handleRevokeAssistant(id: string) {
    const updated = assistants.filter((a) => a.id !== id);
    onUpdateAssistants(updated);
    try {
      localStorage.setItem("dcf_admin_assistants", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setDeleteConfirmId(null);
    onShowToast(
      `Assistant ${id} revoked. Available delegation slots: ${MAX_ASSISTANTS - updated.length} of ${MAX_ASSISTANTS}.`,
      "info"
    );
  }

  // Apply Master Admin Override
  function handleExecuteMasterOverride() {
    setIsOverrideModalOpen(false);
    onShowToast(
      "Master Admin Override Executed: All pending assistant actions verified and aligned with Master Admin credentials.",
      "success"
    );
  }

  return (
    <section className="space-y-6">
      {/* Top Banner & Authority Limit Meter */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-gold/20 shadow-xl bg-navy-900/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                Assistant Delegation (Admin Sub-Users)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
                Max 5 Limit Enforced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sand-300/80 mt-1">
              The Master Admin has sole authority to delegate access to up to five (5) Sub-Assistants for assigned operational tasks. Master Admin retains final approval/override rights across all actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-navy-800 text-gold border border-gold/30 hover:border-gold text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>⚡ Master Override Panel</span>
            </button>

            <button
              onClick={() => {
                if (isLimitReached) {
                  onShowToast(
                    `SYSTEM REJECTION: Maximum threshold of ${MAX_ASSISTANTS} sub-assistants reached. Adding a 6th assistant is strictly prohibited.`,
                    "error"
                  );
                  return;
                }
                setIsModalOpen(true);
              }}
              className={`font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-1.5 transition-all ${
                isLimitReached
                  ? "bg-rose-950/80 text-rose-300 border border-rose-700/50 cursor-not-allowed"
                  : "gold-gradient-bg text-navy-900 hover:brightness-110 shadow-gold/20"
              }`}
            >
              <span>{isLimitReached ? "🚫 Limit Reached (5/5)" : "+ Delegate Sub-Assistant"}</span>
            </button>
          </div>
        </div>

        {/* Limit Meter Bar */}
        <div className="mt-6 p-4 rounded-xl bg-navy-850 border border-gold/15 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-sand-300/80 font-medium">Delegation Quota:</span>
              <strong className="text-sand-100 font-mono">
                {assistants.length} of {MAX_ASSISTANTS} Active Slots
              </strong>
            </div>
            <div className="text-right">
              {isLimitReached ? (
                <span className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                  <span>🔒</span>
                  <span>Quota Full (0 Slots Available)</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold text-[11px]">
                  ✓ {MAX_ASSISTANTS - assistants.length} Slot(s) Available
                </span>
              )}
            </div>
          </div>

          {/* Meter progress bar */}
          <div className="w-full h-2.5 rounded-full bg-navy-950 overflow-hidden flex border border-gold/20">
            {Array.from({ length: MAX_ASSISTANTS }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 border-r border-navy-900 last:border-r-0 transition-all ${
                  idx < assistants.length
                    ? idx === 4
                      ? "bg-rose-500"
                      : "bg-gold"
                    : "bg-navy-800"
                }`}
                title={`Slot ${idx + 1}`}
              />
            ))}
          </div>

          {isLimitReached && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mt-2">
              <span>⚠️</span>
              <span>
                <strong>System Governance Rule:</strong> Maximum capacity of 5 sub-assistants reached. Revoke an existing assistant to delegate a new team member.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Assistants Registry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              assistant.status === "Active"
                ? "border-gold/30 bg-navy-900/80 shadow-lg"
                : "border-rose-500/20 bg-navy-950/60 opacity-75"
            }`}
          >
            <div className="space-y-3">
              {/* Header with Slot & Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 font-bold">
                  {assistant.id}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    assistant.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  ● {assistant.status}
                </span>
              </div>

              {/* Name & Role */}
              <div>
                <h3 className="font-display font-bold text-base text-sand-50">{assistant.name}</h3>
                <div className="text-xs text-gold-accent font-medium mt-0.5">{assistant.role}</div>
                <div className="text-xs text-sand-300/70 font-mono mt-0.5 truncate">
                  {assistant.email}
                </div>
              </div>

              {/* Assigned Scope */}
              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-gold/15 text-xs space-y-1">
                <span className="text-[10px] text-sand-300/60 uppercase tracking-wider block">
                  Assigned Operational Scope:
                </span>
                <strong className="text-sand-100 block">{assistant.assignedScope}</strong>
              </div>

              {/* Security Privileges Tag */}
              <div className="p-2 rounded-lg bg-navy-800/80 border border-sand-300/10 text-[11px] text-sand-300/70 space-y-1">
                <div className="flex items-center gap-1.5 text-sand-300">
                  <span className="text-amber-400">🔒</span>
                  <span>Master Admin Privileges: <strong className="text-rose-400">DENIED</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-sand-300">
                  <span className="text-emerald-400">⚖️</span>
                  <span>Master Admin Override: <strong className="text-emerald-400">ACTIVE</strong></span>
                </div>
                <div className="text-[10px] text-sand-300/50">Delegated on {assistant.addedDate}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gold/15">
              <button
                onClick={() => handleToggleStatus(assistant.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  assistant.status === "Active"
                    ? "bg-rose-950/40 text-rose-300 border-rose-700/40 hover:bg-rose-900/60"
                    : "bg-emerald-950/40 text-emerald-300 border-emerald-700/40 hover:bg-emerald-900/60"
                }`}
              >
                {assistant.status === "Active" ? "Suspend Access" : "Activate"}
              </button>

              <button
                onClick={() => setDeleteConfirmId(assistant.id)}
                className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-rose-950 text-sand-300 hover:text-rose-300 border border-sand-300/20 text-xs transition-colors"
                title="Revoke Delegation"
              >
                Revoke Slot 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DELEGATE NEW ASSISTANT */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleDelegateSubmit}
            className="bg-navy-900 border border-gold/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  Delegate Sub-Assistant
                </h3>
                <span className="text-xs text-gold">
                  Slot {assistants.length + 1} of {MAX_ASSISTANTS} Maximum
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs text-sand-200 space-y-1">
              <strong className="text-gold block">⚖️ System Core Governance Notice:</strong>
              <p className="text-sand-300/80 text-[11px] leading-relaxed">
                Sub-assistants can only perform assigned operational duties on behalf of the Master Admin. Top-level Master Admin credentials remain strictly limited to ONE account (<span className="text-gold font-mono">dreamcomfortfurniture.in@gmail.com</span>). The Admin holds final approval/override rights for all assistant activities.
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">
                  Assistant Full Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Shalini Deshmukh"
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">
                  Assistant Email *
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="shalini.asst@dreamcomfortfurnitureindia.com"
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">Role Preset</label>
                <select
                  value={formRole}
                  onChange={(e) => {
                    const selRole = e.target.value;
                    setFormRole(selRole);
                    const matched = PRESET_ROLES.find((r) => r.role === selRole);
                    if (matched) setFormScope(matched.scope);
                  }}
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                >
                  {PRESET_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">
                  Assigned Operational Scope
                </label>
                <input
                  type="text"
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  placeholder="e.g. Catalog & Media Management"
                  required
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-sand-100 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>
                  <strong>Master Admin Authority:</strong> Restricted. Assistant cannot modify admin master credentials or bypass admin overrides.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Confirm Delegation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MASTER ADMIN OVERRIDE PANEL */}
      {/* ========================================================================= */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-gold/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-sand-50">
                  ⚡ Master Admin Final Override Panel
                </h3>
                <span className="text-xs text-gold">Supreme Operational Governance</span>
              </div>
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-sand-300/80 text-xs leading-relaxed">
                As the Master Admin (<span className="text-gold font-mono">dreamcomfortfurniture.in@gmail.com</span>), you have unconditional final authority to override, reverse, or approve any operational action performed by delegated assistants.
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-navy-950 border border-gold/15 flex items-center justify-between">
                  <div>
                    <span className="text-sand-100 font-semibold block">Enforce Master Audit Pass</span>
                    <span className="text-[11px] text-sand-300/60">
                      Re-validate all pending distributor approvals and catalog edits
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-gold/15 flex items-center justify-between">
                  <div>
                    <span className="text-sand-100 font-semibold block">Suspend All Assistant Actions</span>
                    <span className="text-[11px] text-sand-300/60">
                      Instantly lock sub-assistant modifications in emergency mode
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = assistants.map((a) => ({ ...a, status: "Suspended" as const }));
                      onUpdateAssistants(updated);
                      try {
                        localStorage.setItem("dcf_admin_assistants", JSON.stringify(updated));
                      } catch (e) {
                        console.error(e);
                      }
                      setIsOverrideModalOpen(false);
                      onShowToast("Emergency Override: All assistants have been suspended.", "error");
                    }}
                    className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 text-xs"
                  >
                    Lock All
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gold/15">
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-sand-200 text-xs"
              >
                Close
              </button>
              <button
                onClick={handleExecuteMasterOverride}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Execute Master Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REVOKE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-sand-50">Revoke Assistant Delegation?</h4>
            <p className="text-xs text-sand-300/80">
              Are you sure you want to revoke <strong className="text-gold font-mono">{deleteConfirmId}</strong>? This will immediately terminate their delegated access and free up a slot in your quota.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-sand-300/20 text-sand-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeAssistant(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
