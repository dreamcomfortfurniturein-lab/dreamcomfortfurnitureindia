"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    if (!name || !phone || !address) {
      setError("Please fill in your name, phone and delivery address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInRupees: subtotal }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not start payment");

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "DreamComfortFurnitureIndia",
        description: "Furniture order",
        order_id: order.id,
        prefill: { name, email, contact: phone },
        theme: { color: "#2B1D14" },
        handler: function () {
          clear();
          router.push("/checkout/success");
        },
      });
      razorpay.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="px-6 md:px-12 py-16 text-center">
        <h1 className="font-display text-2xl text-walnut">Your cart is empty</h1>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 py-12 grid md:grid-cols-2 gap-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div>
        <h1 className="font-display text-3xl text-walnut mb-8">Checkout</h1>
        <div className="space-y-4">
          <input
            className="w-full border border-walnut/20 rounded-sm px-4 py-3"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border border-walnut/20 rounded-sm px-4 py-3"
            placeholder="Email (for order confirmation)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-walnut/20 rounded-sm px-4 py-3"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="w-full border border-walnut/20 rounded-sm px-4 py-3"
            placeholder="Delivery address"
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {loading ? "Starting payment..." : `Pay ₹${subtotal.toLocaleString("en-IN")}`}
          </button>
        </div>
      </div>
      <div>
        <h2 className="font-display text-xl text-walnut mb-4">Order summary</h2>
        {items.map((i) => (
          <div key={i.slug} className="flex justify-between text-sm py-2 border-b border-walnut/10">
            <span>{i.name} × {i.qty}</span>
            <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 font-medium text-walnut">
          <span>Total</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </main>
  );
}
