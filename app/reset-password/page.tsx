"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  if (done) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-100">Password Updated</h1>
          <p className="text-xs text-slate-300">Redirecting you to log in...</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs"
          >
            Log In Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-gold/40 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-xl font-bold font-display border border-gold/40 mb-2">
            🔒
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-100">Set a New Password</h1>
          <p className="text-xs text-slate-400">Choose a secure password for your distributor account.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
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
            {loading ? "Updating..." : "Update Password →"}
          </button>
        </form>
      </div>
    </main>
  );
}