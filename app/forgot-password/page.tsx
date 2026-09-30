"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-screen py-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            ✉️
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-100">Check your email</h1>
          <p className="text-xs text-slate-300">
            If an account exists for <strong className="text-gold">{email}</strong>, we&apos;ve sent a link to reset your password.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs"
          >
            Back to Log In
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
            🔑
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-100">Reset Password</h1>
          <p className="text-xs text-slate-400">Enter your email and we&apos;ll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-800">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
          Remembered your password?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}