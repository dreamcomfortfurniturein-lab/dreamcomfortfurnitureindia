"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type Product = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
};

export default function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="text-xs border border-charcoal/20 text-charcoal/40 px-3 py-1.5 rounded-sm cursor-not-allowed mt-2"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="text-xs border border-walnut text-walnut px-3 py-1.5 rounded-sm hover:bg-walnut hover:text-cream transition-colors mt-2"
    >
      {added ? "Added ✓" : "+ Add to cart"}
    </button>
  );
}