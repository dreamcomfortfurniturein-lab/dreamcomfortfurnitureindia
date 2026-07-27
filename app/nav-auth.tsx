"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function NavAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-charcoal/70 hidden sm:inline">
          Hi, {user.email?.split("@")[0]}
        </span>
        <button onClick={handleLogout} className="hover:text-brass transition-colors">
          Log out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="hover:text-brass transition-colors">
      Log in
    </Link>
  );
}