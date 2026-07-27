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
    <main className="px-6 md:px-12 py-24 max-w-md mx-auto">
      <h1 className="font-display text-3xl text-walnut mb-8">Log in</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
          placeholder="Password"
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
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="flex justify-between text-sm text-charcoal/60 mt-6">
        <Link href="/signup" className="text-brass underline">
          Create an account
        </Link>
        <Link href="/forgot-password" className="text-brass underline">
          Forgot password?
        </Link>
      </div>
    </main>
  );
}