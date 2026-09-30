"use client";

import { useState } from "react";
import Link from "next/link";

type DownlineNode = {
  id: string;
  name: string;
  rank: string;
  leg: "Left" | "Right" | "Root";
  bv: number;
  status: "Active" | "Grace";
  joinedDate: string;
  children?: DownlineNode[];
};

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("HDFC Bank •••• 4892");
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<DownlineNode | null>(null);

  const referralLink = "https://dreamcomfort.in/register?ref=DC109283";

  // Mock Genealogy Tree Data
  const downlineTree: DownlineNode = {
    id: "DC109283",
    name: "Pranay (Founder & Director)",
    rank: "Crown Ambassador",
    leg: "Root",
    bv: 420000,
    status: "Active",
    joinedDate: "12 Oct 2025",
    children: [
      {
        id: "DC204918",
        name: "Rajeshwar Rao",
        rank: "Gold Leader",
        leg: "Left",
        bv: 245000,
        status: "Active",
        joinedDate: "18 Nov 2025",
        children: [
          {
            id: "DC381902",
            name: "Anand Verma",
            rank: "Silver Exec",
            leg: "Left",
            bv: 110000,
            status: "Active",
            joinedDate: "05 Dec 2025",
          },
          {
            id: "DC392011",
            name: "Pooja Hegde",
            rank: "Associate",
            leg: "Right",
            bv: 48000,
            status: "Active",
            joinedDate: "14 Jan 2026",
          },
        ],
      },
      {
        id: "DC294821",
        name: "Sunita & Ananya Sharma",
        rank: "Gold Leader",
        leg: "Right",
        bv: 175000,
        status: "Active",
        joinedDate: "28 Nov 2025",
        children: [
          {
            id: "DC401928",
            name: "Karan Patel",
            rank: "Silver Exec",
            leg: "Left",
            bv: 92000,
            status: "Active",
            joinedDate: "22 Dec 2025",
          },
          {
            id: "DC419200",
            name: "Meera Krishnan",
            rank: "Associate",
            leg: "Right",
            bv: 35000,
            status: "Grace",
            joinedDate: "08 Feb 2026",
          },
        ],
      },
    ],
  };

  const commissionHistory = [
    {
      id: "TXN-9021",
      date: "23 Sep 2026",
      type: "Pair Matching Bonus (Person A + Person B Matched)",
      amount: 3000,
      status: "Settled to Bank",
    },
    {
      id: "TXN-8944",
      date: "16 Sep 2026",
      type: "Direct Referral Bonus (₹15,000 ID Sponsor DC419200)",
      amount: 5000,
      status: "Settled to Bank",
    },
    {
      id: "TXN-8812",
      date: "09 Sep 2026",
      type: "Luxury Car Allowance Pool (Diamond)",
      amount: 50000,
      status: "Settled to Bank",
    },
    {
      id: "TXN-8701",
      date: "02 Sep 2026",
      type: "Retail Customer Order Margin (Maharaja Sofa)",
      amount: 13700,
      status: "Settled to Bank",
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) < 1000) {
      setWithdrawStatus("Minimum withdrawal amount is ₹1,000.");
      return;
    }
    setWithdrawStatus(`Payout of ₹${Number(withdrawAmount).toLocaleString("en-IN")} requested successfully to ${withdrawBank}! Funds will credit by Tuesday.`);
    setWithdrawAmount("");
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-700/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                ● Live Distributor Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: DC109283</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-sand-100 mt-1">
              Welcome back, Pranay
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Rank: <span className="text-gold font-bold">Crown Ambassador</span> | Left Leg: <span className="text-emerald-400">2,45,000 BV</span> | Right Leg: <span className="text-cyan-400">1,75,000 BV</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/products"
              className="px-4 py-2 rounded-lg border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors"
            >
              Order Furniture (Wholesale)
            </Link>
            <button
              onClick={() => {
                const elem = document.getElementById("wallet");
                elem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 rounded-lg gold-gradient-bg text-navy-900 text-xs font-bold hover:brightness-110 shadow"
            >
              Request Wallet Payout
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW WIDGETS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Earnings */}
          <div className="glass-card p-5 rounded-2xl border border-gold/30 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Earnings (Lifetime)
            </span>
            <div className="text-2xl sm:text-3xl font-bold gold-gradient-text font-display">
              ₹8,45,200
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              +₹96,100 this current month
            </p>
          </div>

          {/* Current Monthly BV */}
          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monthly Team Volume
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-sand-100 font-display">
              4,20,000 <span className="text-xs text-gold font-sans">BV</span>
            </div>
            <p className="text-[11px] text-cyan-400 font-medium">
              Balanced Matching: 1,75,000 BV
            </p>
          </div>

          {/* Direct Referral Count */}
          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Personally Sponsored
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-sand-100 font-display">
              8 <span className="text-xs text-slate-400 font-sans">Active Leads</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              4 in Left Team • 4 in Right Team
            </p>
          </div>

          {/* Active Downline Count */}
          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Downline Network
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-sand-100 font-display">
              142 <span className="text-xs text-slate-400 font-sans">Distributors</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              134 Active status (94.3%)
            </p>
          </div>
        </div>

        {/* 2. REFERRAL LINK GENERATOR WIDGET */}
        <div className="glass-card p-6 rounded-2xl border border-gold/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-bold border border-gold/30">
                1-Click Sponsor Referral Link
              </span>
              <h3 className="font-display text-lg font-bold text-sand-100">
                Grow Your Furniture Distribution Tree
              </h3>
              <p className="text-xs text-slate-300">
                Share this unique tracking link with interior designers, showroom owners, and entrepreneurs. Sponsoring ID is locked.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-xl w-full">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-navy-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-amber-200 font-mono outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-5 py-2.5 rounded-lg gold-gradient-bg text-navy-900 font-bold text-xs whitespace-nowrap hover:brightness-110 shadow transition-all"
              >
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
            </div>
          </div>
        </div>

        {/* 3. DOWNLINE GENEALOGY TREE */}
        <div className="glass-card p-6 rounded-2xl border border-navy-700 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Interactive Genealogy</span>
              <h3 className="font-display text-xl font-bold text-sand-100 mt-0.5">
                Binary & Unilevel Network Hierarchy
              </h3>
              <p className="text-xs text-slate-400">
                Click any distributor node to inspect their personal volume, rank tier, and active leg balances.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Member
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Grace Period
              </span>
            </div>
          </div>

          {/* Interactive Tree Graph Container */}
          <div className="p-6 bg-navy-950/80 rounded-xl border border-slate-800 overflow-x-auto min-w-[650px]">
            {/* Root Node */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode(downlineTree)}
                className={`p-4 rounded-xl border text-center transition-all w-60 shadow-lg ${
                  selectedNode?.id === downlineTree.id
                    ? "border-gold bg-gold/15"
                    : "border-gold/50 bg-navy-900 hover:border-gold"
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-gold block">Root Sponsor</span>
                <p className="font-bold text-sm text-sand-100">{downlineTree.name}</p>
                <p className="text-xs text-amber-300 font-semibold">{downlineTree.rank}</p>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Team BV: {downlineTree.bv.toLocaleString("en-IN")}
                </div>
              </button>

              {/* Connecting lines */}
              <div className="w-0.5 h-6 bg-slate-700" />
              <div className="w-1/2 h-0.5 bg-slate-700 relative" />

              {/* Tier 1 Level (Left & Right) */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-4">
                {downlineTree.children?.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    <button
                      onClick={() => setSelectedNode(child)}
                      className={`p-3.5 rounded-xl border text-center transition-all w-full max-w-xs shadow ${
                        selectedNode?.id === child.id
                          ? "border-gold bg-gold/15"
                          : "border-slate-700 bg-navy-900 hover:border-gold/60"
                      }`}
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-950 text-slate-300 border border-slate-700 inline-block mb-1">
                        {child.leg} Leg Node
                      </span>
                      <p className="font-semibold text-xs text-sand-100">{child.name}</p>
                      <p className="text-[11px] text-gold">{child.rank}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{child.bv.toLocaleString("en-IN")} BV</p>
                    </button>

                    {/* Tier 2 Sub-children */}
                    {child.children && (
                      <div className="flex flex-col items-center w-full mt-3">
                        <div className="w-0.5 h-4 bg-slate-700" />
                        <div className="grid grid-cols-2 gap-3 w-full">
                          {child.children.map((grand) => (
                            <button
                              key={grand.id}
                              onClick={() => setSelectedNode(grand)}
                              className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                                selectedNode?.id === grand.id
                                  ? "border-gold bg-gold/15"
                                  : "border-slate-800 bg-navy-900/90 hover:border-slate-600"
                              }`}
                            >
                              <span className="text-[9px] text-slate-400 block">{grand.leg} Leg</span>
                              <p className="font-medium text-[11px] text-sand-100 truncate">{grand.name}</p>
                              <p className="text-[10px] text-slate-300">{grand.rank}</p>
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                {grand.bv.toLocaleString("en-IN")} BV
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Details Inspection Drawer */}
          {selectedNode && (
            <div className="p-4 rounded-xl bg-navy-950 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold">Inspecting Downline Partner</span>
                <h4 className="font-bold text-sand-100 text-sm">{selectedNode.name} ({selectedNode.id})</h4>
                <p className="text-xs text-slate-400">
                  Joined on {selectedNode.joinedDate} • Status: <span className="text-emerald-400 font-semibold">{selectedNode.status}</span>
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Current Rank:</span>
                  <span className="font-bold text-gold">{selectedNode.rank}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Volume Contributed:</span>
                  <span className="font-bold text-emerald-400 font-mono">{selectedNode.bv.toLocaleString("en-IN")} BV</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. WALLET & COMMISSION HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="wallet">
          {/* Withdrawal Request Form */}
          <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-navy-700 space-y-4">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">E-Wallet Payout</span>
            <h3 className="font-display text-lg font-bold text-sand-100">
              Request Bank NEFT Transfer
            </h3>
            <p className="text-xs text-slate-400">
              Available withdrawable commission balance: <strong className="text-emerald-400">₹64,300</strong>
            </p>

            <form onSubmit={handleWithdraw} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Min ₹1,000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Linked KYC Verified Bank Account
                </label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-sand-100 outline-none focus:border-gold"
                >
                  <option value="HDFC Bank •••• 4892">HDFC Bank (A/C: •••• 4892, IFSC: HDFC0001201)</option>
                  <option value="ICICI Bank •••• 9104">ICICI Bank (A/C: •••• 9104, IFSC: ICIC0000491)</option>
                </select>
              </div>

              {withdrawStatus && (
                <p className="text-xs text-emerald-400 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                  {withdrawStatus}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow transition-all"
              >
                Submit Withdrawal Request →
              </button>
            </form>
          </div>

          {/* Recent Commission Log */}
          <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-navy-700 space-y-4">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Statement</span>
            <h3 className="font-display text-lg font-bold text-sand-100">
              Recent Commission Disbursements
            </h3>

            <div className="divide-y divide-navy-700/60 text-xs">
              {commissionHistory.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sand-100">{item.type}</p>
                    <p className="text-[11px] text-slate-400">{item.date} • Ref: {item.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold text-sm">+₹{item.amount.toLocaleString("en-IN")}</p>
                    <span className="text-[10px] text-emerald-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
