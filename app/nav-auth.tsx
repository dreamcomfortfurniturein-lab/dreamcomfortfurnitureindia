"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentAuthUser,
  isSuperAdminEmail,
  signOutGoogleUser,
  loginWithGoogleAccount,
  extractFirstName,
  DCFAuthUser,
} from "@/lib/auth-session";

export default function NavAuth() {
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function syncUser() {
      const user = getCurrentAuthUser();
      setAuthUser(user);
      setLoading(false);
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
        setLoading(false);
        return loggedIn;
      }
      return null;
    }

    // 1. Initial sync from local storage
    syncUser();

    // 2. Initial sync from active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        syncFromSupabase(session.user);
      } else {
        syncUser();
      }
    });

    // 3. Listen to auth state changes
    window.addEventListener("dcf_auth_change", syncUser);
    window.addEventListener("storage", syncUser);

    // 4. Supabase auth change listener
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        syncFromSupabase(session.user);
      } else if (event === "SIGNED_OUT") {
        signOutGoogleUser();
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
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  if (authUser) {
    const isSuperAdmin = isSuperAdminEmail(authUser.email);
    const firstName = extractFirstName(authUser.name || authUser.email);

    return (
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* User First Name Greeting Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-850/90 border border-gold/40 text-sand-100 shadow-sm"
          title={`Signed in as ${authUser.email}`}
        >
          {authUser.avatarUrl ? (
            <img
              src={authUser.avatarUrl}
              alt={firstName}
              className="w-5 h-5 rounded-full border border-gold/50 object-cover shrink-0"
            />
          ) : (
            <span className="w-5 h-5 rounded-full bg-gold/25 text-gold flex items-center justify-center text-[10px] font-bold border border-gold/50 shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-semibold text-sand-50 whitespace-nowrap">
            {firstName}
          </span>
        </div>

        {/* Account / Admin Link */}
        {isSuperAdmin ? (
          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1 hover:brightness-110"
            title="Super Admin Portal"
          >
            <span>👑</span>
            <span className="hidden md:inline">Admin</span>
          </Link>
        ) : (
          <Link
            href="/customer"
            className="px-2.5 py-1 rounded-lg bg-gold/20 text-gold border border-gold/40 font-semibold flex items-center gap-1 hover:brightness-110"
            title="Customer Account & Offers"
          >
            <span>🛍️</span>
            <span className="hidden md:inline">My Account</span>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-300 text-[11px] px-1.5 py-1 rounded hover:bg-navy-800 transition-colors"
          title="Sign Out"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Link
        href="/login"
        className="px-3 py-1.5 rounded-lg border border-gold/40 text-sand-200 hover:text-gold hover:border-gold transition-colors font-medium whitespace-nowrap"
      >
        Sign In
      </Link>
    </div>
  );
}