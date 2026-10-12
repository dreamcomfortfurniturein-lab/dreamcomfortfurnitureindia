"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Google SSO with signup mode
    router.replace("/login?mode=signup");
  }, [router]);

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-2xl border border-gold/30 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-sand-300">
          Redirecting to Google SSO Sign-Up...
        </p>
      </div>
    </main>
  );
}