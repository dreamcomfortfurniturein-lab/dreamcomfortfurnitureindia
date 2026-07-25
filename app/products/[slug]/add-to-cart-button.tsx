"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Product = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (product.stock === 0) {
    return (
      <button disabled className="bg-charcoal/20 text-charcoal/50 px-6 py-3 rounded-sm cursor-not-allowed">
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className="bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push("/checkout");
        }}
        className="border border-walnut text-walnut px-6 py-3 rounded-sm hover:bg-linen transition-colors"
      >
        Buy now
      </button>
    </div>
  );
}
