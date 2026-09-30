import Link from "next/link";
import products from "@/data/products.json";
import { notFound } from "next/navigation";
import AddToCartButton from "./add-to-cart-button";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <main className="bg-navy-900 text-sand-100 min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold">Catalog</Link>
          <span>/</span>
          <span className="text-gold font-medium truncate">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-navy-950">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-md bg-gold text-navy-900 shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-700 bg-navy-950"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Quality Specs Callout */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
              <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
                <span className="text-base block mb-0.5">🪵</span>
                <span className="text-[11px] text-slate-400 block font-medium">Wood Quality</span>
                <span className="text-xs font-bold text-sand-100">{product.material}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
                <span className="text-base block mb-0.5">🛡️</span>
                <span className="text-[11px] text-slate-400 block font-medium">Warranty</span>
                <span className="text-xs font-bold text-sand-100">{(product as any).warranty || "10 Year Warranty"}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
                <span className="text-base block mb-0.5">🚚</span>
                <span className="text-[11px] text-slate-400 block font-medium">Dispatch</span>
                <span className="text-xs font-bold text-sand-100">{(product as any).leadTime || "3-5 Working Days"}</span>
              </div>
            </div>
          </div>

          {/* Purchasing & MLM Earning Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold text-gold tracking-widest uppercase">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-sand-100 mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                SKU: <span className="font-mono text-slate-300">{product.slug.toUpperCase()}</span> | Stock:{" "}
                <span className={product.stock > 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                  {product.stock > 0 ? `${product.stock} Units Available` : "Backorder"}
                </span>
              </p>
            </div>

            {/* Price Box */}
            <div className="glass-card p-5 rounded-2xl border border-gold/30 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Retail Price (MRP)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-sand-100">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.mrp > product.price && (
                      <span className="line-through text-xs text-slate-500">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gold font-semibold block">Distributor Member Price</span>
                  <span className="text-xl font-bold text-gold">
                    ₹{product.memberPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Commission Volume Box */}
              <div className="p-3 rounded-xl bg-navy-950 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block">Leadership Volume Credit</span>
                  <span className="text-[10px] text-slate-400">Qualifies for binary & generation match</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 text-sm">{product.bv.toLocaleString("en-IN")} BV</span>
                  <span className="block text-[10px] text-slate-400">{product.pv} PV</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Craftsmanship Details</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Cart & Referral Action */}
            <div className="pt-2">
              <AddToCartButton product={product} />
            </div>

            {/* Direct Selling Distributor Incentive Note */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-sand-100 font-semibold block">Independent Distributor Advantage:</span>
              <p>
                Selling this unit directly yields an immediate retail profit of{" "}
                <strong className="text-emerald-400">
                  ₹{(product.price - product.memberPrice).toLocaleString("en-IN")}
                </strong>{" "}
                plus {product.bv.toLocaleString("en-IN")} BV credited into your weaker leg calculation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}