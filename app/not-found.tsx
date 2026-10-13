import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 text-center">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-gold/30 shadow-2xl space-y-5">
        <span className="text-5xl block">🛋️</span>
        <h2 className="text-2xl font-bold font-display text-sand-50">Page Not Found</h2>
        <p className="text-sm text-sand-300/80">
          The furniture collection or page you are looking for does not exist or has moved.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="gold-gradient-bg text-navy-900 font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-95 transition-all shadow-lg shadow-gold/20"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="bg-navy-800 text-gold border border-gold/30 px-5 py-2.5 rounded-xl text-sm hover:bg-navy-700 transition-all"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
