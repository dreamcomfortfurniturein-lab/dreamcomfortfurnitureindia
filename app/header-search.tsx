"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/products");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden xl:block w-48 2xl:w-56">
      <input
        type="text"
        placeholder="Search furniture..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-navy-950/90 border border-slate-700 hover:border-gold/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-gold outline-none transition-colors"
      />
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
        🔍
      </span>
    </form>
  );
}
