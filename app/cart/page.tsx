"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, setQty, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="px-6 md:px-12 py-16 text-center">
        <h1 className="font-display text-2xl text-walnut mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-brass underline">
          Browse the collection
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-12">
      <h1 className="font-display text-3xl text-walnut mb-8">Your cart</h1>
      <div className="space-y-6 mb-10">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center justify-between border-b border-walnut/10 pb-4">
            <div>
              <p className="font-medium text-charcoal">{item.name}</p>
              <p className="text-sm text-charcoal/60">₹{item.price.toLocaleString("en-IN")} each</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => setQty(item.slug, Number(e.target.value))}
                className="w-16 border border-walnut/20 rounded-sm px-2 py-1 text-center"
              />
              <p className="w-24 text-right">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
              <button
                onClick={() => removeItem(item.slug)}
                className="text-sm text-charcoal/50 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8">
        <p className="text-lg">Subtotal</p>
        <p className="text-xl font-medium text-walnut">₹{subtotal.toLocaleString("en-IN")}</p>
      </div>
      <Link
        href="/checkout"
        className="inline-block bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors"
      >
        Proceed to checkout
      </Link>
    </main>
  );
}
