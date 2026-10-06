"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const {
    items,
    removeItem,
    setQty,
    subtotal,
    memberSubtotal,
    totalBV,
    totalPV,
    isMemberPricing,
    setIsMemberPricing,
    clear,
  } = useCart();

  const currentTotal = isMemberPricing ? memberSubtotal : subtotal;
  const savings = Math.max(0, subtotal - memberSubtotal);

  if (items.length === 0) {
    return (
      <main className="bg-navy-900 text-sand-100 min-h-[70vh] flex items-center justify-center px-6 py-20 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border border-slate-700 space-y-4">
          <span className="text-5xl block">🛋️</span>
          <h1 className="font-display text-2xl font-bold text-sand-100">Your Cart is Currently Empty</h1>
          <p className="text-xs text-slate-400">
            Explore our solid Sheesham living sets, solid Teak bedroom packages, and modular kitchens.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs hover:brightness-110 shadow"
          >
            Explore Furniture Store →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-700/80 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-sand-100">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review your selected handcrafted luxury furniture pieces.
            </p>
          </div>

          <button
            onClick={clear}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors self-start md:self-auto"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const unitPrice = item.price;
              const lineTotal = unitPrice * item.qty;

              return (
                <div
                  key={item.slug}
                  className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                  />

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display font-semibold text-sand-100 hover:text-gold transition-colors text-base"
                    >
                      {item.name}
                    </Link>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                      <span className="text-gold font-bold text-sm">
                        ₹{unitPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center rounded-lg border border-slate-700 bg-navy-950 overflow-hidden">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-sand-100 font-mono">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-xs text-red-400/80 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex-shrink-0">
                    <span className="text-xs text-slate-400 block">Total</span>
                    <span className="font-display font-bold text-lg text-sand-100">
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-gold/30 space-y-5">
              <h2 className="font-display font-bold text-lg text-sand-100 border-b border-slate-700/60 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Shipping & Assembly:</span>
                  <span className="text-emerald-400 font-semibold">FREE (Pan-India)</span>
                </div>
                <div className="flex justify-between">
                  <span>10-Year Anti-Termite Warranty:</span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>
                <div className="flex justify-between text-base font-bold text-sand-100 pt-2 border-t border-slate-700">
                  <span>Total Amount</span>
                  <span className="text-gold text-xl">₹{currentTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-center text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all"
              >
                Proceed to Secure Checkout →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
