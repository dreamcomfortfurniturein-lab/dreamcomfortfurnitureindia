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
    <main className="px-6 md:px-12 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-linen rounded-sm flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-brass mb-2">
          {product.category}
        </p>
        <h1 className="font-display text-3xl text-walnut mb-3">{product.name}</h1>
        <p className="text-2xl text-charcoal mb-1">
          ₹{product.price.toLocaleString("en-IN")}
          {product.mrp > product.price && (
            <span className="line-through text-charcoal/30 text-base ml-3">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </p>
        <p className="text-sm text-charcoal/60 mb-6">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <p className="text-charcoal/80 mb-2">{product.description}</p>
        <p className="text-sm text-charcoal/60 mb-8">Material: {product.material}</p>

        <AddToCartButton product={product} />
      </div>
    </main>
  );
}