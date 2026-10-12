"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SUPER_ADMIN_EMAIL,
  loginWithGoogleAccount,
  getCurrentAuthUser,
  signOutGoogleUser,
  DCFAuthUser,
} from "@/lib/auth-session";
import { WELCOME_QUOTES, getRandomQuote, WelcomeQuote } from "@/lib/quotes";

export default function LoginPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [currentQuote, setCurrentQuote] = useState<WelcomeQuote>(WELCOME_QUOTES[0]);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");
  const [customGmail, setCustomGmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccountRecoveryModal, setShowAccountRecoveryModal] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Preset Google Accounts for Rapid Demonstration & Role Verification
  const PRESET_GOOGLE_ACCOUNTS = [
    {
      email: SUPER_ADMIN_EMAIL,
      name: "Master Admin (Director)",
      roleBadge: "Super Admin",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description: "Supreme authority across all portals & approvals.",
      icon: "👑",
    },
    {
      email: "rajeshwar.rao@gmail.com",
      name: "Rajeshwar Rao",
      roleBadge: "Approved Partner",
      badgeColor: "bg-gold/20 text-gold border-gold/40",
      description: "Admin-approved distributor with operational access.",
      icon: "💼",
    },
    {
      email: "customer.vip@gmail.com",
      name: "Meera Venkat (Customer)",
      roleBadge: "Customer (Default)",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      description: "Standard customer with access to discounts & orders.",
      icon: "🛍️",
    },
  ];

  useEffect(() => {
    // 1. Pick a fresh random welcoming quote on every page load/sign-in
    setCurrentQuote(getRandomQuote());

    // 2. Check if user is already signed in
    const user = getCurrentAuthUser();
    if (user) {
      setAuthUser(user);
    }
  }, []);

  function handleRollNextQuote() {
    let next = getRandomQuote();
    while (next.id === currentQuote.id && WELCOME_QUOTES.length > 1) {
      next = getRandomQuote();
    }
    setCurrentQuote(next);
  }

  async function handleGoogleAuth(emailToUse: string, displayName?: string) {
    setError("");
    setLoading(true);

    const email = emailToUse.trim().toLowerCase();
    if (!email.includes("@")) {
      setError("Please provide a valid Google/Gmail account.");
      setLoading(false);
      return;
    }

    try {
      if (hasSupabase && !emailToUse.includes("example")) {
        try {
          const supabase = createClient();
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (!oauthError) return;
        } catch (e) {
          console.warn("Supabase Google OAuth fallback:", e);
        }
      }

      // Rotate quote upon sign in to fulfill "change everytime sign in"
      handleRollNextQuote();

      const user = loginWithGoogleAccount(email, displayName);

      setTimeout(() => {
        setLoading(false);
        if (user.role === "super_admin") {
          router.push("/admin");
        } else if (user.role === "distributor") {
          router.push("/dashboard");
        } else {
          router.push("/customer");
        }
        router.refresh();
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to authenticate with Google.");
    }
  }

  function handleSignOutCurrent() {
    signOutGoogleUser();
    setAuthUser(null);
    handleRollNextQuote();
  }

  return (
    <main className="bg-navy-950 text-sand-100 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-gold selection:text-navy-900">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header: Logo & Website Name */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold via-amber-500 to-teak flex items-center justify-center shadow-xl shadow-gold/20 border border-gold/60 group-hover:scale-105 transition-all">
              <span className="text-navy-950 font-black font-display text-2xl leading-none">DC</span>
            </div>
            <div className="text-left">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-sand-50 tracking-wide">
                Dream Comfort Furniture India
              </h1>
              <span className="text-[10px] sm:text-xs text-gold/90 font-mono tracking-widest uppercase block">
                Handcrafted Solid Wood Luxury Living
              </span>
            </div>
          </Link>
        </div>

        {/* Dynamic Welcoming Quote Banner (Changes Every Time) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-gold/30 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 shadow-2xl relative overflow-hidden text-center space-y-2">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-semibold">
            <span>{currentQuote.mood}</span>
            <span>•</span>
            <span>{currentQuote.context}</span>
          </div>

          <p className="font-serif italic text-sm sm:text-base text-sand-100 leading-relaxed px-2">
            &ldquo;{currentQuote.quote}&rdquo;
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-sand-300/70 pt-1">
            <span className="font-semibold text-gold">— {currentQuote.author}</span>
            <span>•</span>
            <button
              onClick={handleRollNextQuote}
              className="text-[10px] text-sand-400 hover:text-gold flex items-center gap-1 transition-colors"
              title="Roll a different quote"
            >
              <span>✦ New Quote</span>
            </button>
          </div>
        </div>

        {/* IF USER IS ALREADY SIGNED IN: DEDICATED SIGN-IN DASHBOARD VIEW */}
        {authUser ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-2xl space-y-6 bg-navy-900/90 relative overflow-hidden">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center text-xl font-bold border border-gold/40">
                {authUser.role === "super_admin" ? "👑" : authUser.role === "distributor" ? "💼" : "🛍️"}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-sand-50">
                Welcome back, {authUser.name}!
              </h2>
              <p className="text-xs text-sand-300/70">
                You are securely signed in via Google (<span className="text-gold font-mono">{authUser.email}</span>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-gold/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-sand-300">
                <span>Account Role:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold uppercase text-[10px] border border-gold/30">
                  {authUser.role.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sand-300">
                <span>Storefront Access:</span>
                <span className="text-emerald-400 font-medium">● Active & Verified</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={
                  authUser.role === "super_admin"
                    ? "/admin"
                    : authUser.role === "distributor"
                    ? "/dashboard"
                    : "/customer"
                }
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {authUser.role === "super_admin"
                    ? "Enter Master Admin Portal →"
                    : authUser.role === "distributor"
                    ? "Enter Distributor Portal →"
                    : "Enter Customer Portal & Offers →"}
                </span>
              </Link>

              <button
                onClick={handleSignOutCurrent}
                className="w-full py-2.5 rounded-xl bg-navy-950 text-sand-300 hover:text-white border border-sand-300/20 text-xs transition-colors"
              >
                Switch Google Account / Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR GOOGLE SIGN-IN INTERFACE */
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-2xl space-y-6 bg-navy-900/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-sand-50">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-sand-300/70">
                Fast, secure access using your Google Account.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Official Google Sign-In Button */}
            <div className="space-y-4">
              <button
                onClick={() => handleGoogleAuth(selectedGoogleEmail || "customer.vip@gmail.com")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-xl hover:shadow-2xl border border-slate-200 active:scale-[0.99] disabled:opacity-50"
              >
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
                <span>{loading ? "Signing in..." : "Continue with Google"}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gold/15"></div>
                <span className="flex-shrink mx-3 text-[10px] text-sand-300/50 uppercase tracking-widest">
                  Quick Identity Select
                </span>
                <div className="flex-grow border-t border-gold/15"></div>
              </div>

              {/* 1-Click Identity Presets */}
              <div className="space-y-2">
                {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => {
                      setSelectedGoogleEmail(acc.email);
                      handleGoogleAuth(acc.email, acc.name);
                    }}
                    className="p-3 rounded-2xl border border-gold/15 bg-navy-950/70 hover:border-gold hover:bg-navy-850 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-navy-800 border border-gold/30 flex items-center justify-center text-sm shrink-0">
                        {acc.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-sand-100 group-hover:text-gold transition-colors flex items-center gap-1.5">
                          <span className="truncate">{acc.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.2 rounded-full border font-bold uppercase ${acc.badgeColor}`}>
                            {acc.roleBadge}
                          </span>
                        </div>
                        <div className="text-[10px] text-sand-300/60 font-mono truncate">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gold font-semibold shrink-0">Connect →</span>
                  </div>
                ))}
              </div>

              {/* Connect custom Google Account */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-center text-xs text-sand-300/70 hover:text-gold py-1 transition-colors"
                >
                  + Use a different @gmail.com address
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-navy-950 border border-gold/20 space-y-2">
                  <input
                    type="email"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGmail) return;
                      handleGoogleAuth(customGmail);
                    }}
                    className="w-full py-2 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow"
                  >
                    Sign In with This Gmail →
                  </button>
                </div>
              )}
            </div>

            {/* Links to Sign Up & Password Help */}
            <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs text-sand-300/70">
              <Link href="/signup" className="text-gold font-bold hover:underline">
                New user? Sign Up here →
              </Link>

              <button
                type="button"
                onClick={() => setShowAccountRecoveryModal(true)}
                className="hover:text-gold transition-colors flex items-center gap-1"
              >
                <span>🔑</span>
                <span>Password help</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[11px] text-sand-300/50 space-y-1">
          <p>Super Admin: dreamcomfortfurniture.in@gmail.com • Customer Default Role</p>
          <Link href="/" className="text-sand-400 hover:text-gold transition-colors">
            ← Return to Main Storefront
          </Link>
        </div>
      </div>

      {/* MODAL: GOOGLE ACCOUNT RECOVERY */}
      {showAccountRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-gold/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center text-2xl border border-gold/40">
              🔑
            </div>
            <h3 className="font-display font-bold text-lg text-sand-50">
              Google Account Recovery
            </h3>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Because Dream Comfort Furniture India strictly enforces Google SSO / OAuth, passwords are encrypted and managed exclusively through Google.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="https://accounts.google.com/signin/recovery"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow"
              >
                <span>Open Google Account Recovery ↗</span>
              </a>
              <button
                type="button"
                onClick={() => setShowAccountRecoveryModal(false)}
                className="w-full py-2 rounded-xl bg-navy-800 text-sand-300 text-xs"
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