"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentAuthUser,
  isSuperAdminEmail,
  signOutGoogleUser,
  loginWithGoogleAccount,
  extractFirstName,
  DCFAuthUser,
} from "@/lib/auth-session";

export function TopAnnouncementBanner() {
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    function syncUser() {
      const user = getCurrentAuthUser();
      setAuthUser(user);
    }

    function syncFromSupabase(sessionUser: any) {
      if (sessionUser?.email) {
        const meta = sessionUser.user_metadata || {};
        const fullName =
          meta.full_name ||
          meta.name ||
          meta.given_name ||
          sessionUser.email.split("@")[0];
        const avatar = meta.avatar_url || meta.picture || undefined;
        const loggedIn = loginWithGoogleAccount(sessionUser.email, fullName, avatar);
        setAuthUser(loggedIn);
        return loggedIn;
      }
      return null;
    }

    syncUser();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        syncFromSupabase(session.user);
      } else {
        syncUser();
      }
    });

    window.addEventListener("dcf_auth_change", syncUser);
    window.addEventListener("storage", syncUser);

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        syncFromSupabase(session.user);
      } else if (event === "SIGNED_OUT") {
        setAuthUser(null);
      }
    });

    return () => {
      window.removeEventListener("dcf_auth_change", syncUser);
      window.removeEventListener("storage", syncUser);
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    signOutGoogleUser();
    try {
      await supabase.auth.signOut();
    } catch {
      // silent
    }
    setAuthUser(null);
    window.location.href = "/";
  }

  const firstName = authUser ? extractFirstName(authUser.name || authUser.email) : "";

  return (
    <div className="bg-gradient-to-r from-navy-950 via-gold/15 to-navy-950 border-b border-gold/30 py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-sand-200">
          <span className="text-gold font-bold">✨ Dream Comfort Furniture:</span>
          {authUser ? (
            <span className="flex items-center gap-2 flex-wrap">
              <span>
                Welcome, <strong className="text-gold font-bold">{firstName}</strong>!
              </span>
              <span className="text-slate-300 hidden md:inline">• 100% Solid Teak & Sheesham Wood • 10-Year Guarantee</span>
            </span>
          ) : (
            <span>Handcrafted Solid Teak & Sheesham Wood • 10-Year Anti-Termite Guarantee • Direct Workshop Pricing</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {authUser ? (
            <>
              <Link
                href={isSuperAdminEmail(authUser?.email) ? "/admin" : "/customer"}
                className="gold-gradient-bg text-navy-900 font-bold px-3 py-1 rounded-lg text-[11px] hover:brightness-110 shadow-sm"
              >
                {isSuperAdminEmail(authUser?.email)
                  ? "Master Admin →"
                  : "My Customer Hub & Offers →"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sand-300 hover:text-red-300 text-[11px] px-2 py-1 rounded hover:bg-navy-800 transition-colors"
                title="Log Out"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/products"
                className="gold-gradient-bg text-navy-900 font-bold px-3 py-1 rounded-lg text-[11px] hover:brightness-110 shadow-sm"
              >
                Explore Furniture Catalog →
              </Link>
              <Link
                href="/login"
                className="text-sand-300 hover:text-gold text-[11px] px-2 py-1 rounded hover:bg-navy-800"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopAnnouncementBanner;
