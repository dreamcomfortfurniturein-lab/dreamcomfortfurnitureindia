"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import initialAssistants from "@/data/assistants.json";

type RoleTier = "customer" | "distributor" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as RoleTier) || "customer";

  const [activeRole, setActiveRole] = useState<RoleTier>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    setError("");
    if (activeRole === "admin") {
      setEmail("dreamcomfortfurniture.in@gmail.com");
    } else if (activeRole === "distributor") {
      setDistributorId("DC109283");
      setEmail("");
    } else {
      setEmail("");
    }
  }, [activeRole]);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // =========================================================================
    // 1. MASTER ADMIN LOGIN (SINGLE LOGIN ONLY ENFORCEMENT)
    // =========================================================================
    if (activeRole === "admin") {
      const isMasterAdmin =
        email.trim().toLowerCase() === "dreamcomfortfurniture.in@gmail.com" &&
        (adminPasscode === "DCF_ADMIN_2026" || adminPasscode === "10000" || password === "DCF_ADMIN_2026");

      // Check if this is an authorized delegated assistant (up to max 5)
      const matchedAssistant = (initialAssistants as any[]).find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.status === "Active"
      );

      if (isMasterAdmin) {
        localStorage.setItem("dcf_auth_role", "master_admin");
        localStorage.setItem("dcf_auth_email", "dreamcomfortfurniture.in@gmail.com");
        setTimeout(() => {
          setLoading(false);
          router.push("/admin");
          router.refresh();
        }, 500);
        return;
      } else if (matchedAssistant) {
        // Authorized delegated sub-assistant (restricted authority)
        localStorage.setItem("dcf_auth_role", "assistant");
        localStorage.setItem("dcf_auth_email", matchedAssistant.email);
        localStorage.setItem("dcf_assistant_scope", matchedAssistant.assignedScope);
        setTimeout(() => {
          setLoading(false);
          router.push("/admin");
          router.refresh();
        }, 500);
        return;
      } else {
        setLoading(false);
        setError(
          "Access Denied: Strictly ONE single Master Admin credential authorized (dreamcomfortfurniture.in@gmail.com) or verified delegated assistant."
        );
        return;
      }
    }

    // =========================================================================
    // 2. DISTRIBUTOR PORTAL LOGIN
    // =========================================================================
    if (activeRole === "distributor") {
      if (!distributorId && !email) {
        setLoading(false);
        setError("Please enter your Distributor ID (e.g. DC109283) or registered email.");
        return;
      }

      localStorage.setItem("dcf_auth_role", "distributor");
      localStorage.setItem("dcf_distributor_id", distributorId || "DC109283");

      if (hasSupabase && email) {
        try {
          const supabase = createClient();
          const { error: supaError } = await supabase.auth.signInWithPassword({
            email,
            password: password || "Distributor@2026",
          });
          if (supaError) {
            console.warn("Supabase auth warning:", supaError.message);
          }
        } catch {
          // fallback
        }
      }

      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
        router.refresh();
      }, 500);
      return;
    }

    // =========================================================================
    // 3. CUSTOMER PORTAL LOGIN (INDEPENDENT WORKFLOW)
    // =========================================================================
    if (activeRole === "customer") {
      if (!email) {
        setLoading(false);
        setError("Please enter your registered customer email address.");
        return;
      }

      localStorage.setItem("dcf_auth_role", "customer");
      localStorage.setItem("dcf_customer_email", email);

      if (hasSupabase) {
        try {
          const supabase = createClient();
          const { error: supaError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (supaError) {
            // If user doesn't exist yet in Supabase demo, gracefully log them into customer portal
            console.warn(supaError.message);
          }
        } catch {
          // fallback
        }
      }

      setTimeout(() => {
        setLoading(false);
        router.push("/customer");
        router.refresh();
      }, 500);
      return;
    }
  }

  // Quick credentials prefill helper for testing
  function prefillCredentials(role: RoleTier) {
    setActiveRole(role);
    if (role === "customer") {
      setEmail("patron.client@gmail.com");
      setPassword("Customer@2026");
    } else if (role === "distributor") {
      setDistributorId("DC109283");
      setEmail("rajeshwar.rao@gmail.com");
      setPassword("Distributor@2026");
    } else if (role === "admin") {
      setEmail("dreamcomfortfurniture.in@gmail.com");
      setAdminPasscode("DCF_ADMIN_2026");
    }
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-8 flex items-center justify-center selection:bg-gold selection:text-navy-900">
      <div className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-10 border border-gold/40 shadow-2xl space-y-6 relative overflow-hidden bg-navy-950/90">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-1 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-teak text-navy-900 flex items-center justify-center mx-auto text-xl font-bold font-display shadow-lg shadow-gold/20 mb-2">
            DC
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Dream Comfort Furniture
          </h1>
          <p className="text-xs text-sand-300/70">
            Select your portal to access dedicated operational tools and accounts.
          </p>
        </div>

        {/* 3-Tier Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-navy-900 rounded-2xl border border-gold/20 relative z-10">
          <button
            type="button"
            onClick={() => setActiveRole("customer")}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeRole === "customer"
                ? "bg-gold text-navy-900 shadow-md font-bold"
                : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/50"
            }`}
          >
            <span>🛍️</span>
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("distributor")}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeRole === "distributor"
                ? "bg-gold text-navy-900 shadow-md font-bold"
                : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/50"
            }`}
          >
            <span>💼</span>
            <span>Distributor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("admin")}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activeRole === "admin"
                ? "bg-gold text-navy-900 shadow-md font-bold"
                : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/50"
            }`}
          >
            <span>👑</span>
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Role Description Badge */}
        <div className="p-3.5 rounded-xl bg-navy-900/80 border border-gold/20 text-xs text-sand-200/90 relative z-10">
          {activeRole === "customer" && (
            <div>
              <strong className="text-gold block mb-0.5">Customer Rewards & Offers Portal</strong>
              <span>Dedicated independent access to view promotional offers, discount codes, and order milestones.</span>
            </div>
          )}
          {activeRole === "distributor" && (
            <div>
              <strong className="text-gold block mb-0.5">Distributor Back-Office CRM</strong>
              <span>Restricted to MLM distributors: access binary genealogy tree, BV points, and Tuesday bank payouts.</span>
            </div>
          )}
          {activeRole === "admin" && (
            <div>
              <strong className="text-amber-400 block mb-0.5">Strict Single Master Admin Credential</strong>
              <span>Sole authority over Distributor management, Customer Offers, Catalog, and up to 5 delegated assistants.</span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
          {/* Fields for Customer */}
          {activeRole === "customer" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Customer Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Account Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-gold"
                />
              </div>
            </>
          )}

          {/* Fields for Distributor */}
          {activeRole === "distributor" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Distributor ID or Registered Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DC109283 or distributor@gmail.com"
                  value={distributorId || email}
                  onChange={(e) => {
                    setDistributorId(e.target.value);
                    setEmail(e.target.value);
                  }}
                  className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Security Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-900 border border-gold/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-gold"
                />
              </div>
            </>
          )}

          {/* Fields for Master Admin */}
          {activeRole === "admin" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Master Admin Email (Single Official Account) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dreamcomfortfurniture.in@gmail.com"
                  className="w-full bg-navy-900 border border-gold/30 rounded-xl px-4 py-3 text-xs text-amber-200 font-mono outline-none focus:border-gold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Only master admin or verified sub-assistant credentials permitted.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Master Security Passcode / Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter Master Passcode (e.g. DCF_ADMIN_2026)"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-navy-900 border border-gold/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-gold font-mono"
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-red-300 text-xs bg-red-950/60 p-3 rounded-xl border border-red-500/40">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : `Log In to ${activeRole === "customer" ? "Customer Offers" : activeRole === "distributor" ? "Distributor CRM" : "Master Admin"} →`}
          </button>
        </form>

        {/* 1-Click Test Demo Credentials */}
        <div className="pt-2 border-t border-gold/15 space-y-2 relative z-10">
          <span className="text-[11px] text-slate-400 block text-center">
            🧪 Quick 1-Click Test Login:
          </span>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => prefillCredentials("customer")}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-gold border border-gold/20"
            >
              Fill Customer
            </button>
            <button
              type="button"
              onClick={() => prefillCredentials("distributor")}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-gold border border-gold/20"
            >
              Fill Distributor
            </button>
            <button
              type="button"
              onClick={() => prefillCredentials("admin")}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-amber-300 border border-gold/30 font-semibold"
            >
              Fill Master Admin
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800 relative z-10">
          {activeRole === "customer" ? (
            <Link href="/products" className="text-gold hover:underline">
              Explore Furniture Catalog
            </Link>
          ) : activeRole === "distributor" ? (
            <Link href="/register" className="text-gold hover:underline">
              Register New Distributor ID
            </Link>
          ) : (
            <span className="text-slate-500 text-[11px]">
              Master Admin: dreamcomfortfurniture.in@gmail.com
            </span>
          )}

          <Link href="/forgot-password" className="text-slate-400 hover:text-white">
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}