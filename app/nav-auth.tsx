"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentAuthUser,
  signOutGoogleUser,
  getActiveSessionMode,
  setActiveSessionMode,
  DCFAuthUser,
} from "@/lib/auth-session";

export default function NavAuth() {
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [sessionMode, setSessionMode] = useState<"customer" | "distributor">("customer");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function syncUser() {
      const user = getCurrentAuthUser();
      setAuthUser(user);
      setSessionMode(getActiveSessionMode());
      setLoading(false);
    }

    syncUser();

    // Listen to in-app & cross-tab auth state changes
    window.addEventListener("dcf_auth_change", syncUser);
    window.addEventListener("dcf_session_mode_change", syncUser);
    window.addEventListener("storage", syncUser);

    // Supabase listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email && !getCurrentAuthUser()) {
        syncUser();
      }
    });

    return () => {
      window.removeEventListener("dcf_auth_change", syncUser);
      window.removeEventListener("dcf_session_mode_change", syncUser);
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
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  if (authUser) {
    const isSuperAdmin = authUser.role === "super_admin";
    const isDistributor = authUser.role === "distributor";

    return (
      <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
        {/* Role Portal Shortcut */}
        {isSuperAdmin ? (
          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1 hover:brightness-110"
            title="Super Admin Portal"
          >
            <span>👑</span>
            <span className="hidden md:inline">Super Admin</span>
          </Link>
        ) : isDistributor ? (
          <Link
            href={sessionMode === "distributor" ? "/dashboard" : "/customer"}
            onClick={() => {
              // If entering dashboard, toggle mode
              if (sessionMode !== "distributor") {
                setActiveSessionMode("distributor");
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-gold/20 text-gold border border-gold/40 font-semibold flex items-center gap-1 hover:brightness-110"
            title="Distributor / Partner Access"
          >
            <span>💼</span>
            <span className="hidden md:inline">Partner</span>
          </Link>
        ) : (
          <Link
            href="/customer"
            className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold flex items-center gap-1 hover:brightness-110"
            title="Customer Portal"
          >
            <span>🛍️</span>
            <span className="hidden md:inline">Customer</span>
          </Link>
        )}

        {/* User Identity */}
        <span className="text-sand-200 hidden lg:inline font-medium max-w-[120px] truncate" title={authUser.email}>
          {authUser.name || authUser.email.split("@")[0]}
        </span>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="text-sand-400 hover:text-gold transition-colors text-xs px-2 py-1 rounded hover:bg-navy-800"
          title="Sign out from Google session"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-3.5 py-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold hover:text-navy-900 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-gold/20"
    >
      <span>G</span>
      <span>Google Sign In</span>
    </Link>
  );
}