"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartLink() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return (
    <Link href="/cart" className="hover:text-brass transition-colors">
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
