"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCurrentAuthUser,
  getActiveSessionMode,
  setActiveSessionMode,
  submitPartnerAccessRequest,
  generatePartnerNotificationUrls,
  ADMIN_WHATSAPP_NUMBER,
  ADMIN_EMAIL_ADDRESS,
  DCFAuthUser,
} from "@/lib/auth-session";

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
  const router = useRouter();
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerPhone, setPartnerPhone] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [notificationUrls, setNotificationUrls] = useState<any>(null);

  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("HDFC Bank •••• 4892");
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<DownlineNode | null>(null);

  const referralLink = "https://dreamcomfortfurnitureindia.com/register?ref=DC109283";

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
        joinedDate: "20 Dec 2025",
        children: [
          {
            id: "DC401928",
            name: "Karthik Reddy",
            rank: "Associate",
            leg: "Left",
            bv: 85000,
            status: "Active",
            joinedDate: "28 Jan 2026",
          },
          {
            id: "DC491823",
            name: "Dr. Srinivas Rao",
            rank: "Associate",
            leg: "Right",
            bv: 90000,
            status: "Active",
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

  useEffect(() => {
    const user = getCurrentAuthUser();
    setAuthUser(user);
    setLoading(false);

    // RULE 4.1: If user is an approved distributor or Super Admin, activate Distributor session
    if (user?.role === "distributor" || user?.role === "super_admin") {
      setActiveSessionMode("distributor");
    }
  }, []);

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

  // Handle exiting distributor session to customer perspective
  function handleExitToCustomerView() {
    setActiveSessionMode("customer");
    router.push("/customer");
  }

  // Handle partner access request submission (Sends Email & WhatsApp Alert)
  async function handleSubmitAccessRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!authUser) return;
    const phone = partnerPhone.trim() || "+91 9347965863";

    submitPartnerAccessRequest(authUser.email, authUser.name, phone);

    const urls = generatePartnerNotificationUrls({
      name: authUser.name,
      email: authUser.email,
      phone,
      notes: "Submitted via Distributor Portal (/dashboard)",
    });

    setNotificationUrls(urls);
    setRequestSubmitted(true);
    setAuthUser(getCurrentAuthUser());

    // Send backend notification
    try {
      await fetch("/api/partner-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authUser.name,
          email: authUser.email,
          phone,
          notes: "Partner Portal Access Request from /dashboard",
        }),
      });
    } catch {
      // offline fallback
    }

    // Automatically trigger WhatsApp alert to 9347965863
    try {
      window.open(urls.whatsappUrl, "_blank");
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // =========================================================================
  // GATE 1: AUTHENTICATION CHECK (GOOGLE SSO ONLY)
  // =========================================================================
  if (!authUser) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-gold/30 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-2xl border border-gold/40">
            💼
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-50">
            Distributor Portal Access
          </h1>
          <p className="text-xs text-sand-300/80 leading-relaxed">
            Google Single Sign-On (SSO) is required to access the distributor back-office and operational MLM network.
          </p>
          <Link
            href="/login"
            className="block w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all text-center"
          >
            Sign In with Google Account →
          </Link>
        </div>
      </main>
    );
  }

  const isSuperAdmin = authUser.role === "super_admin";
  const isApprovedPartner = authUser.role === "distributor" || isSuperAdmin;
  const isPending = authUser.partnerStatus === "pending" || requestSubmitted;

  // =========================================================================
  // GATE 2: ADMIN APPROVAL INTERCEPTION FOR STANDARD CUSTOMERS
  // =========================================================================
  if (!isApprovedPartner) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center selection:bg-gold selection:text-navy-900">
        <div className="max-w-lg w-full glass-card p-8 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl bg-navy-900/90">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center text-2xl border border-amber-500/40">
            {isPending ? "⏳" : "🔒"}
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Role Access Control: Customer Status
            </span>
            <h1 className="font-display text-2xl font-bold text-sand-50">
              {isPending
                ? "Partner Request Awaiting Admin Approval"
                : "Distributor Portal Approval Required"}
            </h1>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Your Google identity (<span className="text-gold font-mono">{authUser.email}</span>) holds the default <strong>Customer</strong> role. Operational MLM features require explicit approval from the Master Admin (<span className="text-gold font-mono">dreamcomfortfurniture.in@gmail.com</span>).
            </p>
          </div>

          {isPending ? (
            <div className="p-5 rounded-2xl bg-navy-950 border border-amber-500/40 text-left text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <span>✓</span>
                <span>Approval Request Dispatched to Master Admin</span>
              </div>
              <p className="text-[11px] text-sand-300/80 leading-relaxed">
                Mandatory Admin Approval is required. The Partner Portal will remain strictly locked until the Master Admin reviews and approves your account.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-amber-500/20 text-[11px]">
                <div className="flex items-center justify-between text-sand-300">
                  <span className="flex items-center gap-1">✉️ Email Dispatched:</span>
                  <span className="font-mono text-gold">{ADMIN_EMAIL_ADDRESS}</span>
                </div>
                <div className="flex items-center justify-between text-sand-300">
                  <span className="flex items-center gap-1">💬 WhatsApp Alert:</span>
                  <span className="font-mono text-emerald-400">+91 9347965863</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hello Admin, I have requested Partner Portal access for ${authUser.name} (${authUser.email}). Please verify and approve.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold text-center hover:bg-emerald-500 hover:text-navy-900 transition-all"
                >
                  💬 Open WhatsApp (+91 9347965863)
                </a>
                <a
                  href={`mailto:${ADMIN_EMAIL_ADDRESS}?subject=${encodeURIComponent(`Partner Access Request: ${authUser.name}`)}&body=${encodeURIComponent(`Hello Admin,\n\nI have requested access to the Partner Portal.\nName: ${authUser.name}\nEmail: ${authUser.email}\n\nPlease approve in Admin Dashboard.`)}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-navy-900 text-gold border border-gold/40 font-semibold text-center hover:bg-gold hover:text-navy-900 transition-all"
                >
                  ✉️ Open Email
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitAccessRequest} className="space-y-3 text-left">
              <div>
                <label className="block text-sand-300/80 text-xs mb-1 font-medium">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  placeholder="+91 99594 27831"
                  className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-2 text-xs text-sand-100 font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-lg shadow-gold/20 transition-all text-center"
              >
                Submit Partner Access Request →
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-gold/15 flex items-center justify-between text-xs">
            <Link href="/customer" className="text-sand-300 hover:text-gold transition-colors">
              ← Return to Customer Portal
            </Link>
            <Link href="/" className="text-sand-300 hover:text-gold transition-colors">
              Visit Storefront →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // GATE 3: APPROVED DISTRIBUTOR / SUPER ADMIN WORKFLOW
  // Active Distributor Session automatically locks Customer Page
  // =========================================================================
  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-8 px-4 sm:px-8 lg:px-12 selection:bg-gold selection:text-navy-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* RULE 4.1: ACTIVE DISTRIBUTOR SESSION CONTROL BAR */}
        <div className="glass-card p-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold border border-gold/40 flex items-center justify-center text-lg font-bold">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sand-50">
                  Active Distributor Session in Progress
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  🔒 Customer Page Locked
                </span>
              </div>
              <p className="text-[11px] text-sand-300/70">
                To prevent data contamination, Customer view is locked. Exit to Customer perspective to view storefront updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExitToCustomerView}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20 transition-all flex items-center gap-1.5"
              title="Exits distributor session and unlocks Customer Storefront"
            >
              <span>🛍️</span>
              <span>Exit to Customer View (Unlocks Page) →</span>
            </button>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-700/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                ● Live Distributor Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {authUser.distributorId || "DC109283"}
              </span>
              {isSuperAdmin && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  👑 Master Admin
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-sand-100 mt-1">
              Welcome back, {authUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Rank: <span className="text-gold font-bold">Crown Ambassador</span> | Left Leg:{" "}
              <span className="text-emerald-400">2,45,000 BV</span> | Right Leg:{" "}
              <span className="text-cyan-400">1,75,000 BV</span>
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

        {/* 4 Core Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-navy-800/80 border border-gold/20 shadow-lg space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Total Earnings (YTD)</span>
            <div className="text-2xl sm:text-3xl font-black text-sand-100 font-serif">₹2,84,500</div>
            <span className="text-[11px] text-emerald-400">✓ Settled to registered bank</span>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/80 border border-gold/20 shadow-lg space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Wallet Balance Available</span>
            <div className="text-2xl sm:text-3xl font-black text-gold font-serif">₹42,800</div>
            <span className="text-[11px] text-slate-300">Next auto-settlement: Tuesday</span>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/80 border border-gold/20 shadow-lg space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Total Downline Partners</span>
            <div className="text-2xl sm:text-3xl font-black text-sand-100 font-serif">148 Active</div>
            <span className="text-[11px] text-cyan-400">82 Left • 66 Right Leg</span>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/80 border border-gold/20 shadow-lg space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Next Rank Target</span>
            <div className="text-2xl sm:text-3xl font-black text-sand-100 font-serif">Royal Crown</div>
            <div className="w-full bg-navy-950 rounded-full h-1.5 mt-2 overflow-hidden border border-gold/20">
              <div className="bg-gold h-full rounded-full" style={{ width: "78%" }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">78% BV criteria achieved</span>
          </div>
        </div>

        {/* Downline Interactive Tree */}
        <div className="p-6 rounded-3xl bg-navy-800/90 border border-gold/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-700/80 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-sand-100">
                Binary Genealogy Network Tree
              </h2>
              <p className="text-xs text-slate-400">
                Visual downline tracking. Click any leader node to inspect real-time team BV and weekly performance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active Member
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 15-Day Grace
              </span>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="overflow-x-auto py-6">
            <div className="min-w-[650px] flex flex-col items-center space-y-6">
              {/* Root */}
              <div
                onClick={() => setSelectedNode(downlineTree)}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center w-64 shadow-xl ${
                  selectedNode?.id === downlineTree.id
                    ? "border-gold bg-gold/15 shadow-gold/20"
                    : "border-gold/40 bg-navy-950 hover:border-gold"
                }`}
              >
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold text-navy-900 font-bold uppercase tracking-wider">
                  {downlineTree.rank}
                </span>
                <div className="font-bold text-sand-100 text-sm mt-1">{downlineTree.name}</div>
                <div className="text-xs text-gold font-mono">{downlineTree.bv.toLocaleString()} BV</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {downlineTree.id}</div>
              </div>

              {/* Level 1 (Left & Right) */}
              <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
                {downlineTree.children?.map((child) => (
                  <div key={child.id} className="flex flex-col items-center space-y-4">
                    <div
                      onClick={() => setSelectedNode(child)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all text-center w-56 shadow-lg ${
                        selectedNode?.id === child.id
                          ? "border-gold bg-gold/15"
                          : "border-slate-700 bg-navy-950 hover:border-gold/60"
                      }`}
                    >
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-navy-800 text-cyan-300 font-semibold border border-cyan-500/30">
                        {child.leg} Leg • {child.rank}
                      </span>
                      <div className="font-bold text-sand-100 text-xs mt-1">{child.name}</div>
                      <div className="text-xs text-emerald-400 font-mono">{child.bv.toLocaleString()} BV</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {child.id}</div>
                    </div>

                    {/* Level 2 Sub-children */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {child.children?.map((grandChild) => (
                        <div
                          key={grandChild.id}
                          onClick={() => setSelectedNode(grandChild)}
                          className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
                            selectedNode?.id === grandChild.id
                              ? "border-gold bg-gold/15"
                              : "border-slate-800 bg-navy-900 hover:border-slate-600"
                          }`}
                        >
                          <div className="text-[10px] text-sand-200 font-semibold truncate">{grandChild.name}</div>
                          <div className="text-[10px] text-gold font-mono">{grandChild.bv.toLocaleString()} BV</div>
                          <div className="text-[9px] text-slate-400">{grandChild.leg} Leg</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Details Inspection Panel */}
          {selectedNode && (
            <div className="p-4 rounded-2xl bg-navy-950 border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gold uppercase tracking-wider font-bold">Node Selected:</span>
                <div className="font-bold text-sand-100 text-base">{selectedNode.name} ({selectedNode.id})</div>
                <div className="text-xs text-slate-300">
                  Rank: <strong className="text-gold">{selectedNode.rank}</strong> • Leg: {selectedNode.leg} • Volume: <strong className="text-emerald-400">{selectedNode.bv.toLocaleString()} BV</strong> • Joined: {selectedNode.joinedDate}
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
              >
                Close Inspector
              </button>
            </div>
          )}
        </div>

        {/* Wallet & Bank Settlements */}
        <div id="wallet" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-navy-800/90 border border-gold/20 shadow-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-sand-100">
              Bank Withdrawal Request
            </h3>
            <p className="text-xs text-slate-400">
              Direct transfer to your registered verified bank account. Processed weekly every Tuesday.
            </p>

            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Settlement Bank</label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold"
                >
                  <option value="HDFC Bank •••• 4892">HDFC Bank (Current A/c •••• 4892)</option>
                  <option value="SBI •••• 1044">State Bank of India (•••• 1044)</option>
                  <option value="ICICI Bank •••• 8821">ICICI Bank (•••• 8821)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Amount to Withdraw (₹)</label>
                <input
                  type="number"
                  placeholder="Min ₹1,000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold font-mono"
                />
              </div>

              {withdrawStatus && (
                <div className="p-3 rounded-xl bg-gold/15 border border-gold/30 text-xs text-sand-100">
                  {withdrawStatus}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-md shadow-gold/20"
              >
                Submit Tuesday Payout Request
              </button>
            </form>
          </div>

          {/* Commission Statement Log */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-navy-800/90 border border-gold/20 shadow-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-sand-100">
              Recent Tuesday Commission Settlements
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {commissionHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-navy-750">
                      <td className="py-3 px-3 font-mono text-slate-300">{item.date}</td>
                      <td className="py-3 px-3 text-sand-100">{item.type}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{item.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Referral Link & Social Sharing */}
        <div className="p-6 rounded-3xl bg-navy-800/90 border border-gold/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-sand-100">
              Your Personalized Sponsor Registration Link
            </h3>
            <p className="text-xs text-slate-400">
              Share with new partners to place them in your binary downline network.
            </p>
            <div className="mt-2 font-mono text-xs text-gold truncate max-w-lg">
              {referralLink}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow"
            >
              {copied ? "Copied Link ✓" : "Copy Sponsor Link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Join Dream Comfort Furniture India as an official partner with my sponsor ID DC109283: ${referralLink}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
            >
              Share via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
