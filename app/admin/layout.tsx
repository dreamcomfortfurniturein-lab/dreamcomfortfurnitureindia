"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentAuthUser,
  isSuperAdminEmail,
  signOutGoogleUser,
  loginWithGoogleAccount,
  SUPER_ADMIN_EMAIL,
  DCFAuthUser,
} from "@/lib/auth-session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<"checking" | "authorized" | "denied">("checking");
  const [currentUser, setCurrentUser] = useState<DCFAuthUser | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function evaluateAccess() {
      // 1. Check local session storage first
      const localUser = getCurrentAuthUser();
      
      // 2. Check Supabase session for verified Google identity
      const { data: { session } } = await supabase.auth.getSession();
      
      let verifiedEmail = localUser?.email || null;
      let activeUser = localUser;

      if (session?.user?.email) {
        verifiedEmail = session.user.email;
        const meta = session.user.user_metadata || {};
        const fullName =
          meta.full_name ||
          meta.name ||
          meta.given_name ||
          session.user.email.split("@")[0];
        const avatar = meta.avatar_url || meta.picture || undefined;
        activeUser = loginWithGoogleAccount(session.user.email, fullName, avatar);
      }

      if (!isMounted) return;

      setCurrentUser(activeUser);

      if (verifiedEmail && isSuperAdminEmail(verifiedEmail)) {
        setAuthStatus("authorized");
      } else {
        setAuthStatus("denied");
      }
    }

    evaluateAccess();

    // Listen to real-time auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user?.email && isSuperAdminEmail(session.user.email)) {
        setAuthStatus("authorized");
      } else {
        setAuthStatus("denied");
      }
    });

    const handleStorageChange = () => {
      evaluateAccess();
    };

    window.addEventListener("dcf_auth_change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener("dcf_auth_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSwitchAccount() {
    signOutGoogleUser();
    try {
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
  }

  // 1. Checking state: smooth luxury loader
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center text-sand-100">
        <div className="w-16 h-16 rounded-3xl bg-gold/15 border border-gold/40 flex items-center justify-center text-2xl shadow-xl shadow-gold/20 animate-pulse mb-4">
          👑
        </div>
        <h2 className="font-display text-xl font-bold text-sand-50">
          Verifying Master Admin Authorization...
        </h2>
        <p className="text-xs text-sand-300/70 mt-2 max-w-sm">
          Strictly gated for <span className="text-gold font-mono">{SUPER_ADMIN_EMAIL}</span>.
        </p>
      </div>
    );
  }

  // 2. Denied state: Strict 403 Forbidden Barrier
  if (authStatus === "denied") {
    const isOtherGmail = Boolean(currentUser?.email);

    return (
      <div className="min-h-screen bg-navy-950 text-sand-100 flex items-center justify-center p-4 sm:p-6 selection:bg-gold selection:text-navy-900">
        <div className="max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 border border-red-500/40 bg-navy-900/95 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 mx-auto flex items-center justify-center text-3xl">
            🛑
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[11px] font-bold uppercase tracking-wider border border-red-500/30">
              403 Access Denied
            </span>
            <h1 className="font-display text-2xl font-bold text-sand-50">
              Admin Portal Restricted
            </h1>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              This administrative portal is private and restricted strictly to the verified Master Admin Google account:
            </p>
            <p className="text-xs font-mono font-bold text-gold bg-navy-950 py-1.5 px-3 rounded-xl border border-gold/30">
              {SUPER_ADMIN_EMAIL}
            </p>
          </div>

          {isOtherGmail ? (
            <div className="p-3.5 rounded-2xl bg-navy-950 border border-sand-700/50 text-left text-xs space-y-1.5">
              <div className="text-sand-400 text-[11px]">Currently signed in as:</div>
              <div className="font-mono text-sand-100 font-semibold truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>{currentUser?.email}</span>
              </div>
              <div className="text-[11px] text-sand-400/80 pt-1">
                This Google account does not have permission to view or manage the administration portal.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-navy-950 border border-sand-700/50 text-xs text-sand-400">
              You are not signed in. Access is strictly blocked.
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            {isOtherGmail ? (
              <>
                <Link
                  href="/customer"
                  className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-lg shadow-gold/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>🛍️ Go to My Customer Account</span>
                </Link>

                <button
                  onClick={handleSwitchAccount}
                  className="w-full py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-sand-200 border border-sand-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>🔄 Switch to Master Admin Account</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow-lg shadow-gold/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>🔑 Sign In with Google</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-navy-800 text-sand-400 hover:text-sand-100 text-xs font-medium transition-all block"
            >
              ← Return to Main Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized state: render admin page
  return <>{children}</>;
}
