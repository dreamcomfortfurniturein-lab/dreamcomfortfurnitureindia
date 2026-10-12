"use client";

import React from "react";
import Link from "next/link";

interface SystemCoreSecurityBannerProps {
  currentRole: string;
  adminEmail: string;
  assistantCount: number;
  maxAssistants: number;
  onMasterOverride?: () => void;
}

export default function SystemCoreSecurityBanner({
  currentRole,
  adminEmail,
  assistantCount,
  maxAssistants,
  onMasterOverride,
}: SystemCoreSecurityBannerProps) {
  const isMasterAdmin = currentRole === "master_admin" || adminEmail === "dreamcomfortfurniture.in@gmail.com";

  return (
    <div className="glass-card rounded-2xl border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-4 sm:p-5 shadow-2xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Left: Security Governance Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-[11px] font-bold uppercase tracking-wider">
              <span>🛡️</span>
              <span>System Core Manager Active</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-navy-800 text-sand-300 border border-sand-300/20 text-[11px] font-mono">
              3-Tier Architecture Enforced
            </span>
            {isMasterAdmin ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                👑 Single Master Admin (Supreme Authority)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                👤 Delegated Sub-Assistant (Operational Scope Only)
              </span>
            )}
          </div>

          <div className="text-xs text-sand-300/80 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Authenticated: <strong className="text-sand-100 font-mono">{adminEmail}</strong>
            </span>
            <span>•</span>
            <span>
              Delegated Assistants:{" "}
              <strong className={assistantCount >= maxAssistants ? "text-rose-400" : "text-gold"}>
                {assistantCount} / {maxAssistants} Max
              </strong>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Final Decision-Making: Master Admin Only</span>
          </div>
        </div>

        {/* Right: Quick Portals Switch & Enforcement Links */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/customer"
            target="_blank"
            className="text-xs px-3 py-1.5 rounded-xl bg-navy-800/90 hover:bg-navy-750 text-sand-200 border border-gold/20 hover:border-gold transition-all flex items-center gap-1.5"
            title="Inspect Customer Portal as seen by shoppers"
          >
            <span>🛍️</span>
            <span>Customer Portal</span>
            <span className="text-[10px] text-emerald-400">● Live</span>
          </Link>

          <Link
            href="/dashboard"
            target="_blank"
            className="text-xs px-3 py-1.5 rounded-xl bg-navy-800/90 hover:bg-navy-750 text-sand-200 border border-gold/20 hover:border-gold transition-all flex items-center gap-1.5"
            title="Inspect Distributor MLM Portal"
          >
            <span>💼</span>
            <span>Distributor Portal</span>
            <span className="text-[10px] text-emerald-400">● Live</span>
          </Link>

          {onMasterOverride && (
            <button
              onClick={onMasterOverride}
              className="text-xs px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 transition-all font-semibold flex items-center gap-1"
              title="Apply Master Admin override across all system logs"
            >
              <span>⚡</span>
              <span>Master Override</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
