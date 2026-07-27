"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-24 max-w-md mx-auto">
      <h1 className="font-display text-3xl text-walnut mb-8">Create an account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-walnut/20 rounded-sm px-4 py-3"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-walnut/20 rounded-sm px-4 py-3"
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="text-sm text-charcoal/60 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brass underline">
          Log in
        </Link>
      </p>
    </main>
  );
}