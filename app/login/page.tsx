"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-gold/40 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-xl font-bold font-display border border-gold/40 mb-2">
            DC
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-100">Distributor Log In</h1>
          <p className="text-xs text-slate-400">Access your network back-office, downline tree, and payouts.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-800">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In to Back-Office →"}
          </button>
        </form>

        <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <Link href="/register" className="text-gold hover:text-gold-light font-medium">
            Join as Distributor
          </Link>
          <Link href="/forgot-password" className="text-slate-400 hover:text-sand-100">
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}