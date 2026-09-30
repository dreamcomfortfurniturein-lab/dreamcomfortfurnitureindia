"use client";

import { useState } from "react";
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
      <main className="px-6 md:px-12 py-24 max-w-md mx-auto text-center">
        <h1 className="font-display text-3xl text-walnut mb-4">Check your email</h1>
        <p className="text-charcoal/70">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to
          reset your password.
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-24 max-w-md mx-auto">
      <h1 className="font-display text-3xl text-walnut mb-4">Reset your password</h1>
      <p className="text-charcoal/70 mb-8">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-walnut/20 rounded-sm px-4 py-3"
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </main>
  );
}