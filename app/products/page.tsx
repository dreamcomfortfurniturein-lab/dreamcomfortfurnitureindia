import Link from "next/link";
import products from "@/data/products.json";

export const metadata = { title: "Shop — DreamComfortFurnitureIndia" };

export default function ProductsPage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="px-6 md:px-12 py-12">
      <h1 className="font-display text-3xl text-walnut mb-2">Shop all furniture</h1>
      <p className="text-charcoal/70 mb-10">
        {products.length} pieces across {categories.length} categories
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
            <div className="aspect-square bg-linen rounded-sm mb-3 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs uppercase tracking-wide text-brass mb-1">
              {p.category}
            </p>
            <h3 className="font-medium text-charcoal group-hover:text-brass transition-colors">
              {p.name}
            </h3>
            <p className="text-sm text-charcoal/60">
              ₹{p.price.toLocaleString("en-IN")}
              {p.mrp > p.price && (
                <span className="line-through text-charcoal/30 ml-2">
                  ₹{p.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}