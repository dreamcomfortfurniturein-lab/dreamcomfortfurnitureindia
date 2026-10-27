"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCurrentAuthUser,
  isSuperAdminEmail,
  extractFirstName,
  DCFAuthUser,
} from "@/lib/auth-session";

interface OrderMilestone {
  orderId: string;
  furnitureItem: string;
  category: string;
  woodType: string;
  orderDate: string;
  estimatedDelivery: string;
  status: "Seasoning in Kiln" | "Master Carving" | "Termite Treatment" | "Quality Polish" | "Out for Delivery";
  progressPercent: number;
  amount: number;
}

export default function DashboardPage() {
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample order tracking for demonstrative friendly experience
  const sampleOrders: OrderMilestone[] = [
    {
      orderId: "DCF-84920",
      furnitureItem: "Heritage Handcrafted Teakwood King Bed with Hydraulic Storage",
      category: "Bedroom Sets",
      woodType: "100% Solid Indian Teak (Sagwan)",
      orderDate: "18 Oct 2026",
      estimatedDelivery: "02 Nov 2026",
      status: "Quality Polish",
      progressPercent: 75,
      amount: 54900,
    },
    {
      orderId: "DCF-81049",
      furnitureItem: "Royal Sheesham Maharaja 7-Seater Sofa Suite",
      category: "Living Room",
      woodType: "Grade-A Sheesham Wood & Velvet Upholstery",
      orderDate: "12 Oct 2026",
      estimatedDelivery: "28 Oct 2026",
      status: "Out for Delivery",
      progressPercent: 95,
      amount: 68500,
    },
  ];

  useEffect(() => {
    const user = getCurrentAuthUser();
    setAuthUser(user);
    setLoading(false);
  }, []);

  const firstName = extractFirstName(authUser?.name || authUser?.email);
  const isSuperAdmin = isSuperAdminEmail(authUser?.email);

  return (
    <main className="min-h-screen bg-navy-900 text-sand-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-gold/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gold font-bold">
              Customer Account & Furniture Tracking
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {firstName}!
            </h1>
            <p className="text-xs text-sand-300/80">
              Track your handcrafted solid wood furniture orders, delivery schedules, and workshop milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSuperAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:brightness-110 shadow"
              >
                👑 Master Admin Portal →
              </Link>
            )}
            <Link
              href="/customer"
              className="px-4 py-2 rounded-xl bg-gold/20 text-gold border border-gold/40 text-xs font-bold hover:brightness-110 shadow"
            >
              🎁 View Discount Vouchers
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl gold-gradient-bg text-navy-900 text-xs font-bold hover:brightness-110 shadow"
            >
              Browse Catalog →
            </Link>
          </div>
        </div>

        {/* Live Workshop Order Milestones */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-sand-100">
                Recent Workshop Orders & Dispatch Status
              </h2>
              <p className="text-xs text-slate-400">
                Handcrafted directly in our solar-kiln facility with real-time carpenter assembly updates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sampleOrders.map((order) => (
              <div
                key={order.orderId}
                className="glass-card p-6 rounded-2xl border border-gold/25 bg-navy-950/70 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                      Order ID: {order.orderId} • Placed {order.orderDate}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-sand-100 mt-0.5">
                      {order.furnitureItem}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Material: {order.woodType}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block text-[10px]">Total Paid:</span>
                    <span className="text-base font-bold text-sand-100">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Status */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-sand-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Status: <strong className="text-emerald-400">{order.status}</strong>
                    </span>
                    <span className="text-slate-400">
                      Estimated Delivery: <strong className="text-gold">{order.estimatedDelivery}</strong>
                    </span>
                  </div>

                  <div className="w-full bg-navy-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className="h-2.5 rounded-full gold-gradient-bg transition-all duration-500"
                      style={{ width: `${order.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-center pt-2">
                  <div className="p-2 rounded-lg bg-navy-900 border border-gold/30 text-gold font-medium">
                    1. Solar Seasoning ✓
                  </div>
                  <div className="p-2 rounded-lg bg-navy-900 border border-gold/30 text-gold font-medium">
                    2. Master Carving ✓
                  </div>
                  <div className="p-2 rounded-lg bg-navy-900 border border-gold/30 text-gold font-medium">
                    3. Anti-Termite Immersion ✓
                  </div>
                  <div className={`p-2 rounded-lg bg-navy-900 border ${order.progressPercent >= 75 ? "border-gold/30 text-gold font-medium" : "border-slate-800 text-slate-500"}`}>
                    4. German Polish
                  </div>
                  <div className={`p-2 rounded-lg bg-navy-900 border ${order.progressPercent >= 90 ? "border-emerald-500/40 text-emerald-300 font-bold" : "border-slate-800 text-slate-500"}`}>
                    5. White-Glove Delivery
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Quick Links & Assistance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-2xl block">💬</span>
            <h4 className="font-display font-bold text-sand-100 text-base">Direct Carpenter Concierge</h4>
            <p className="text-xs text-slate-400">
              Need custom wood stains, fabric alterations, or room dimensions? Chat directly with Founder Pranay.
            </p>
            <a
              href="https://wa.me/919959427831?text=Hi%20Pranay,%20I%20want%20to%20discuss%20custom%20solid%20wood%20furniture."
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-semibold text-gold hover:underline pt-1"
            >
              WhatsApp (+91 99594 27831) →
            </a>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-2xl block">🛡️</span>
            <h4 className="font-display font-bold text-sand-100 text-base">10-Year Anti-Termite Guarantee</h4>
            <p className="text-xs text-slate-400">
              All hardwood pieces are kiln-treated with zero synthetic particleboard or MDF. Lifetime structural warranty.
            </p>
            <Link
              href="/about"
              className="inline-block text-xs font-semibold text-gold hover:underline pt-1"
            >
              Learn About Our Timber →
            </Link>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-navy-700 space-y-2">
            <span className="text-2xl block">📍</span>
            <h4 className="font-display font-bold text-sand-100 text-base">Visit Experience Center</h4>
            <p className="text-xs text-slate-400">
              Experience the weight, grain, and finish of our solid wood collections at our Visakhapatnam Showroom.
            </p>
            <Link
              href="/stores"
              className="inline-block text-xs font-semibold text-gold hover:underline pt-1"
            >
              Showroom Directions →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
