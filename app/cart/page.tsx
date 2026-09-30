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
            <h1 className="font-display text-3xl font-bold text-sand-100">Shopping Cart & Business Volume</h1>
            <p className="text-xs text-slate-400 mt-1">Review items and manage distributor pricing benefits.</p>
          </div>

          <div className="glass-card p-3 rounded-xl border border-gold/30 flex items-center gap-3">
            <div>
              <span className="text-xs font-bold text-gold block">Distributor Member Discount</span>
              <span className="text-[10px] text-slate-400">Wholesale pricing activated</span>
            </div>
            <button
              onClick={() => setIsMemberPricing(!isMemberPricing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isMemberPricing ? "bg-gold" : "bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMemberPricing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-card rounded-2xl border border-navy-700 divide-y divide-navy-700/60 p-4 sm:p-6">
              {items.map((item) => {
                const itemPrice = isMemberPricing
                  ? (item.memberPrice || item.price * 0.8)
                  : item.price;

                return (
                  <div key={item.slug} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-navy-700"
                      />
                      <div>
                        <h3 className="font-display font-bold text-sm text-sand-100">{item.name}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-bold text-gold">₹{itemPrice.toLocaleString("en-IN")}</span>
                          {isMemberPricing && (
                            <span className="text-xs line-through text-slate-500">₹{item.price.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mt-1">
                          <span>BV: {((item.bv || Math.round(item.price * 0.4)) * item.qty).toLocaleString("en-IN")}</span>
                          <span>•</span>
                          <span>PV: {((item.pv || Math.round(item.price * 0.004)) * item.qty)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-navy-950 text-xs">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="px-2.5 py-1 text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 font-semibold text-sand-100">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="px-2.5 py-1 text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <span className="font-bold text-sand-100 text-sm">
                          ₹{(itemPrice * item.qty).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-xs text-red-400 hover:text-red-300 p-1"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={clear}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear shopping cart
            </button>
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-gold/30 space-y-5">
              <h2 className="font-display font-bold text-lg text-sand-100">Order & BV Summary</h2>

              <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gold font-bold">Business Volume (BV):</span>
                  <span className="font-bold text-emerald-400 font-mono">{totalBV.toLocaleString("en-IN")} BV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold font-bold">Personal Volume (PV):</span>
                  <span className="font-bold text-emerald-400 font-mono">{totalPV} PV</span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-gold/20">
                  Credited directly to sponsor ID upon confirmed doorstep delivery.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal (Retail):</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {isMemberPricing && savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Distributor Discount (20%):</span>
                    <span>-₹{savings.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Shipping & Assembly:</span>
                  <span className="text-emerald-400 font-semibold">FREE (Pan-India)</span>
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
