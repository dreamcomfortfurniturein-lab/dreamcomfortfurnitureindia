"use client";

import { useState } from "react";
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
      <main className="px-6 md:px-12 py-24 max-w-md mx-auto text-center">
        <h1 className="font-display text-3xl text-walnut mb-4">Password updated</h1>
        <p className="text-charcoal/70">Redirecting you to log in...</p>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-24 max-w-md mx-auto">
      <h1 className="font-display text-3xl text-walnut mb-8">Set a new password</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="password"
          required
          minLength={6}
          placeholder="New password (min 6 characters)"
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
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </main>
  );
}