"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    setQty,
    subtotal,
    memberSubtotal,
    totalBV,
    totalPV,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    isMemberPricing,
    setIsMemberPricing,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const currentTotal = isMemberPricing ? memberSubtotal : subtotal;
  const savings = Math.max(0, subtotal - memberSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-navy-800 border-l border-gold/30 text-sand-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-navy-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-gold/10 text-gold text-xl">🛒</span>
              <div>
                <h2 className="text-lg font-bold text-sand-100 font-display">Your Furniture Order</h2>
                <p className="text-xs text-gold/80">Direct Factory Wholesale & Commission Tracked</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-navy-700/50 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🛋️</p>
                <p className="text-sand-100/70 text-sm">Your cart is empty.</p>
                <p className="text-xs text-slate-400 mt-1">Explore our handcrafted Indian furniture collections.</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-4 px-4 py-2 rounded-lg border border-gold/40 text-gold text-xs font-medium hover:bg-gold/10"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.price;

                return (
                  <div
                    key={item.slug}
                    className="p-3 rounded-xl bg-navy-900/60 border border-slate-700/70 flex gap-4 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-navy-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-sand-100 truncate">{item.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-gold">
                          ₹{itemPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-navy-600 rounded bg-navy-800 text-xs">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="px-2 py-0.5 hover:bg-navy-700 text-slate-300"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="px-2 py-0.5 hover:bg-navy-700 text-slate-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-[11px] text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer calculation */}
          {items.length > 0 && (
            <div className="p-6 border-t border-navy-700 bg-navy-900/90 space-y-3">

              <div className="flex justify-between items-center text-base font-bold text-sand-100 pt-2 border-t border-navy-700">
                <span>Total Amount</span>
                <span className="text-gold text-xl">₹{currentTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-600 text-center text-xs font-semibold text-slate-300 hover:bg-navy-700 transition-colors"
                >
                  View Cart Page
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-dark text-navy-900 font-bold text-center text-xs transition-colors shadow-lg"
                >
                  Checkout (Razorpay)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
