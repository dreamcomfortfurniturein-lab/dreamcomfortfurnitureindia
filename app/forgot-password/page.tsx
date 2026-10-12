"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-20 px-4 sm:px-8 flex items-center justify-center selection:bg-gold selection:text-navy-900">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-gold/30 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-2xl border border-gold/40 shadow-lg shadow-gold/20">
          🔑
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-sand-50">
            Google Account Password Recovery
          </h1>
          <p className="text-xs text-sand-300/80 leading-relaxed">
            Dream Comfort Furniture India utilizes Google SSO / OAuth exclusively. Password credentials are maintained securely by Google LLC and are not stored in our database.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-950 border border-gold/15 text-left text-xs text-sand-200 space-y-2">
          <div className="flex items-center gap-2 text-gold font-bold">
            <span>🛡️</span>
            <span>Google Security Guidelines:</span>
          </div>
          <p className="text-[11px] text-sand-300/70 leading-relaxed">
            To reset your password, update two-factor verification, or recover your Gmail access, please use standard Google Account Recovery.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href="https://accounts.google.com/signin/recovery"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Google Recovery ↗</span>
          </a>

          <Link
            href="/login"
            className="inline-block text-xs text-sand-300 hover:text-gold transition-colors"
          >
            ← Back to Google Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}