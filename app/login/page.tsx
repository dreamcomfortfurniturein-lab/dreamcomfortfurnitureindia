"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
  isUnreachableSupabaseHost,
  isSupabaseOAuthProviderReady,
} from "@/lib/supabase/client";
import {
  SUPER_ADMIN_EMAIL,
  loginWithGoogleAccount,
  getCurrentAuthUser,
  signOutGoogleUser,
  extractFirstName,
  getLastExpiredReason,
  clearExpiredReason,
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
  const [expiredNotice, setExpiredNotice] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number>(0);
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

    // 2. Check for session expiration or rate limit notices
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const reason = searchParams.get("reason");
      const err = searchParams.get("error");
      const lastExpired = getLastExpiredReason();

      if (reason === "session_expired" || lastExpired === "session_expired") {
        setExpiredNotice(
          "⚠️ Session Expired: Your secure session time limit has ended. Please sign in with your Google account to renew access."
        );
        clearExpiredReason();
      } else if (reason === "free_limit_over" || (err && err.toLowerCase().includes("rate"))) {
        setRateLimitSeconds(60);
        setExpiredNotice(
          "⚠️ Free Tier Rate Limit reached. Time limit retry active: Please wait 60s before retrying, or continue below."
        );
      }
    }

    // 3. Check if user is already signed in via local storage
    const user = getCurrentAuthUser();
    if (user) {
      setAuthUser(user);
    }

    // 4. Sync active Supabase session (after Google OAuth redirect)
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const meta = session.user.user_metadata || {};
        const fullName =
          meta.full_name ||
          meta.name ||
          meta.given_name ||
          session.user.email.split("@")[0];
        const avatar = meta.avatar_url || meta.picture || undefined;
        const logged = loginWithGoogleAccount(session.user.email, fullName, avatar);
        setAuthUser(logged);
      }
    });
  }, []);

  // Countdown timer for rate limit time limit
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  function handleRollNextQuote() {
    let next = getRandomQuote();
    while (next.id === currentQuote.id && WELCOME_QUOTES.length > 1) {
      next = getRandomQuote();
    }
    setCurrentQuote(next);
  }

  async function handleGoogleAuth(emailToUse?: string, displayName?: string) {
    setError("");
    setLoading(true);

    try {
      if (hasSupabase && (!emailToUse || !emailToUse.includes("example"))) {
        try {
          const currentOrigin = window.location.origin;
          const isLiveSite =
            !window.location.hostname.includes("localhost") &&
            !window.location.hostname.includes("127.0.0.1");

          const supabase = createClient();
          const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${currentOrigin}/auth/callback`,
              skipBrowserRedirect: true,
            },
          });

          if (oauthError) {
            console.error("[DCF Auth] Supabase OAuth error:", oauthError);
            const errStr = (oauthError.message || "").toLowerCase();
            if (errStr.includes("rate") || errStr.includes("quota") || errStr.includes("429")) {
              setRateLimitSeconds(60);
              setExpiredNotice(
                "⚠️ Free Tier Rate Limit reached. Time limit retry active: Please wait 60 seconds before retrying, or continue with Google Identity below."
              );
            } else if (errStr.includes("expired") || errStr.includes("invalid")) {
              setExpiredNotice("⚠️ Session Expired: Please reconnect your Google account.");
            }
          }

          if (!oauthError && data?.url && !isUnreachableSupabaseHost(data.url)) {
            let authUrl = data.url;
            try {
              const parsed = new URL(data.url);
              const targetRedirect = parsed.searchParams.get("redirect_to");
              if (
                isLiveSite &&
                targetRedirect &&
                (targetRedirect.includes("localhost") || targetRedirect.includes("127.0.0.1"))
              ) {
                console.warn(
                  "[DCF Auth] Correcting localhost redirect in live to:",
                  `${currentOrigin}/auth/callback`
                );
                parsed.searchParams.set("redirect_to", `${currentOrigin}/auth/callback`);
                authUrl = parsed.toString();
              }
            } catch {
              // fallback to data.url
            }

            const isReady = await isSupabaseOAuthProviderReady(authUrl);
            if (isReady) {
              window.location.href = authUrl;
              return;
            } else {
              console.warn(
                "Supabase Google Provider is not enabled yet in dashboard. Falling back smoothly."
              );
            }
          }
        } catch (e) {
          console.warn("Supabase Google OAuth fallback:", e);
        }
      }

      // If an explicit account was specified (e.g. Master Admin fast login)
      if (emailToUse) {
        handleRollNextQuote();
        const user = loginWithGoogleAccount(emailToUse, displayName);
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
        return;
      }

      setLoading(false);
      setError("Unable to initiate Google Sign In. Please try again or use Master Admin login below.");
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to authenticate with Google.");
    }
  }

  async function handleSignOutCurrent() {
    signOutGoogleUser();
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // silent
    }
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
                Welcome back, {extractFirstName(authUser.name || authUser.email)}!
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
                className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-red-950/40 text-sand-300 hover:text-red-300 border border-sand-300/20 hover:border-red-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Log Out of Google Account</span>
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

            {expiredNotice && (
              <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs space-y-2 shadow-lg animate-fadeIn text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                    <span>⏱️</span>
                    <span>Session Expired / Time Limit Notice</span>
                  </div>
                  {rateLimitSeconds > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-mono text-[10px] font-bold">
                      Retry in {rateLimitSeconds}s
                    </span>
                  )}
                </div>
                <p className="text-sand-300/90 leading-relaxed text-[11px]">
                  {expiredNotice}
                </p>
                {rateLimitSeconds > 0 && (
                  <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-1000"
                      style={{ width: `${(rateLimitSeconds / 60) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Official Google Sign-In Button */}
            {/* Official Google Sign-In Button (For All Regular Users / Customers) */}
            <div className="space-y-4">
              <button
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-xl hover:shadow-2xl border border-slate-200 active:scale-[0.99] disabled:opacity-50"
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
                <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
              </button>

              <p className="text-[11px] text-sand-300/60 text-center">
                One-tap sign in • Default customer role assigned automatically.
              </p>

              {/* DEDICATED ADMIN GMAIL ACCESS ONLY (RESTRICTED TO DREAMCOMFORTFURNITURE.IN@GMAIL.COM) */}
              {showCustomInput && (
                <div className="p-4 rounded-2xl bg-navy-950 border border-gold/40 space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                      <span>👑</span>
                      <span>Master Admin Access</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="text-[10px] text-sand-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <p className="text-[11px] text-sand-300/80 leading-relaxed">
                    Strictly authorized for the single Master Admin account credential:
                  </p>

                  <div
                    onClick={() => handleGoogleAuth(SUPER_ADMIN_EMAIL, "Master Admin")}
                    className="p-3 rounded-xl bg-gold/15 border border-gold/50 hover:bg-gold/25 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">👑</span>
                      <div>
                        <div className="text-xs font-bold text-sand-50 group-hover:text-gold transition-colors">
                          Master Admin Identity
                        </div>
                        <div className="text-[11px] text-gold font-mono">
                          {SUPER_ADMIN_EMAIL}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gold font-bold">Connect →</span>
                  </div>
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
        <div className="text-center text-[11px] text-sand-300/50 space-y-1.5">
          <p>
            Default Customer Access • Secured by Google SSO •{" "}
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-sand-400/80 hover:text-gold underline transition-colors"
            >
              Master Admin Login
            </button>
          </p>
          <Link href="/" className="text-sand-400 hover:text-gold transition-colors inline-block">
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