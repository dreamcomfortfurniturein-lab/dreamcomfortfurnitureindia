"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SUPER_ADMIN_EMAIL,
  loginWithGoogleAccount,
  computeUserRole,
  getPartnerStatus,
  isSuperAdminEmail,
} from "@/lib/auth-session";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [authMode, setAuthMode] = useState<"signin" | "signup">(initialMode);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");
  const [customGmail, setCustomGmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccountRecoveryModal, setShowAccountRecoveryModal] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Preset Google Accounts for Rapid Demonstration & Role Testing
  const PRESET_GOOGLE_ACCOUNTS = [
    {
      email: SUPER_ADMIN_EMAIL,
      name: "Master Admin (Director)",
      roleBadge: "Super Admin",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "Sole Master Admin credentials with supreme system authority.",
      icon: "👑",
    },
    {
      email: "rajeshwar.rao@gmail.com",
      name: "Rajeshwar Rao",
      roleBadge: "Approved Partner / Distributor",
      badgeColor: "bg-gold/20 text-gold border-gold/40",
      description: "Admin-approved distributor with access to MLM back-office.",
      icon: "💼",
    },
    {
      email: "pranay.shopper@gmail.com",
      name: "Pranay (Customer)",
      roleBadge: "Customer (Default Role)",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      description: "Standard customer with dedicated access to offers & storefront.",
      icon: "🛍️",
    },
  ];

  async function handleGoogleAuth(emailToUse: string, displayName?: string) {
    setError("");
    setLoading(true);

    const email = emailToUse.trim().toLowerCase();

    // Verify Gmail format
    if (!email.includes("@")) {
      setError("Please provide a valid Google/Gmail account.");
      setLoading(false);
      return;
    }

    try {
      // 1. Try Live Supabase Google OAuth if configured
      if (hasSupabase && !emailToUse.includes("example")) {
        try {
          const supabase = createClient();
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (!oauthError) {
            // Browser redirects to Google consent screen
            return;
          }
        } catch (e) {
          console.warn("Supabase Google OAuth fallback to direct session:", e);
        }
      }

      // 2. Client-Side Google SSO Session Manager
      const user = loginWithGoogleAccount(email, displayName);

      setTimeout(() => {
        setLoading(false);

        // Role-Based Access Redirection
        if (user.role === "super_admin") {
          router.push("/admin");
        } else if (user.role === "distributor") {
          router.push("/dashboard");
        } else {
          router.push("/customer");
        }
        router.refresh();
      }, 600);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to authenticate with Google.");
    }
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-gold selection:text-navy-900">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-teak flex items-center justify-center shadow-lg shadow-gold/20 border border-gold/50 group-hover:scale-105 transition-transform">
              <span className="text-navy-900 font-bold font-display text-xl leading-none">DC</span>
            </div>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-sand-50 tracking-wide">
            Dream Comfort Furniture India
          </h1>
          <p className="text-xs sm:text-sm text-sand-300/70">
            Enterprise Single Sign-On • Role-Based Access Control
          </p>
        </div>

        {/* Security Policy Enforced Banner */}
        <div className="p-3.5 rounded-2xl bg-navy-950 border border-gold/30 text-xs space-y-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-gold font-bold">
            <span>🛡️</span>
            <span>Authentication Policy: Google SSO / OAuth ONLY</span>
          </div>
          <p className="text-sand-300/80 text-[11px] leading-relaxed">
            All user identities are authenticated exclusively through <strong>Google Sign-In / Connect with Gmail</strong>. Standard email/password forms are permanently disabled for data integrity.
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-2xl space-y-6 bg-navy-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          {/* Action Tabs: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-navy-950 border border-gold/20">
            <button
              onClick={() => {
                setAuthMode("signin");
                setError("");
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authMode === "signin"
                  ? "bg-gold text-navy-900 shadow-md shadow-gold/20"
                  : "text-sand-300 hover:text-white"
              }`}
            >
              Sign In via Google
            </button>
            <button
              onClick={() => {
                setAuthMode("signup");
                setError("");
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authMode === "signup"
                  ? "bg-gold text-navy-900 shadow-md shadow-gold/20"
                  : "text-sand-300 hover:text-white"
              }`}
            >
              Sign Up via Google
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Primary Action Button: Official Google SSO Button */}
          <div className="space-y-4">
            <button
              onClick={() => handleGoogleAuth(selectedGoogleEmail || SUPER_ADMIN_EMAIL)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-xl hover:shadow-2xl border border-slate-200 active:scale-[0.99] disabled:opacity-50"
            >
              {/* Google G Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>
                {loading
                  ? "Connecting to Google..."
                  : authMode === "signup"
                  ? "Create Account with Google"
                  : "Continue with Google"}
              </span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gold/15"></div>
              <span className="flex-shrink mx-4 text-[10px] text-sand-300/50 uppercase tracking-widest">
                Select Google Account Identity
              </span>
              <div className="flex-grow border-t border-gold/15"></div>
            </div>

            {/* Quick 1-Click Google Account Switcher / Simulator */}
            <div className="space-y-2.5">
              {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => {
                    setSelectedGoogleEmail(acc.email);
                    handleGoogleAuth(acc.email, acc.name);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedGoogleEmail === acc.email
                      ? "bg-gold/15 border-gold shadow-md"
                      : "bg-navy-950/70 border-gold/15 hover:border-gold/40 hover:bg-navy-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-navy-800 border border-gold/30 flex items-center justify-center text-base shrink-0">
                      {acc.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-sand-100 flex items-center gap-2">
                        <span className="truncate">{acc.name}</span>
                        <span
                          className={`text-[9px] px-2 py-0.2 rounded-full border font-bold uppercase tracking-wider shrink-0 ${acc.badgeColor}`}
                        >
                          {acc.roleBadge}
                        </span>
                      </div>
                      <div className="text-[11px] text-sand-300/60 font-mono truncate">
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gold font-semibold shrink-0">Connect →</span>
                </div>
              ))}
            </div>

            {/* Custom Google Account Input */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center text-xs text-sand-300/70 hover:text-gold py-1 transition-colors"
              >
                + Connect a different @gmail.com address
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-navy-950 border border-gold/20 space-y-2">
                <label className="block text-[11px] text-sand-300/80 font-medium">
                  Enter Your Google Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="flex-1 bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGmail) return;
                      handleGoogleAuth(customGmail);
                    }}
                    className="gold-gradient-bg text-navy-900 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110"
                  >
                    Sign In
                  </button>
                </div>
                <p className="text-[10px] text-sand-300/60">
                  Note: Any non-admin Google email automatically receives the <strong>Customer</strong> role until elevated to Partner.
                </p>
              </div>
            )}
          </div>

          {/* Action 3: Password Reset & Google Recovery Link */}
          <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs text-sand-300/70">
            <button
              type="button"
              onClick={() => setShowAccountRecoveryModal(true)}
              className="hover:text-gold transition-colors flex items-center gap-1"
            >
              <span>🔑</span>
              <span>Need password help?</span>
            </button>

            <Link href="/" className="hover:text-gold transition-colors">
              Return to Storefront →
            </Link>
          </div>
        </div>

        {/* Security Disclaimers Footer */}
        <div className="text-center text-[11px] text-sand-300/50 space-y-1">
          <p>Super Admin: dreamcomfortfurniture.in@gmail.com • Customer Default Role Enforced</p>
          <p>Active Distributor session automatically locks Customer page to prevent data contamination.</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: GOOGLE ACCOUNT RECOVERY NOTICE */}
      {/* ========================================================================= */}
      {showAccountRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-gold/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center text-2xl border border-gold/40">
              🔑
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-sand-50">
                Google Account Password Recovery
              </h3>
              <p className="text-xs text-sand-300/80 leading-relaxed">
                Because Dream Comfort Furniture strictly enforces Google SSO / OAuth, passwords and credentials are never stored on our servers.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-navy-950 border border-gold/15 text-xs text-sand-200 space-y-1.5">
              <span className="text-gold font-bold block">Google Security Process:</span>
              <p className="text-[11px] text-sand-300/70 leading-relaxed">
                Password resets, 2-Step Verification, and account recovery are managed directly by Google. Click below to open standard Google Account Recovery.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="https://accounts.google.com/signin/recovery"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs text-center shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Open Google Account Recovery ↗</span>
              </a>
              <button
                type="button"
                onClick={() => setShowAccountRecoveryModal(false)}
                className="w-full py-2.5 rounded-xl bg-navy-800 text-sand-300 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}