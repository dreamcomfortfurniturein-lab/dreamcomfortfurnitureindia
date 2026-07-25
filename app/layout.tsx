import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartLink from "./cart-link";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DreamComfortFurnitureIndia — Furniture & Interiors",
  description:
    "Handcrafted furniture and interiors, made in India. Shop sofas, dining sets, bedroom and storage furniture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body`}>
        <CartProvider>
          <div className="swatch-strip" />
          <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-cream">
            <Link href="/" className="font-display text-xl md:text-2xl text-walnut tracking-tight">
              DreamComfort<span className="text-brass">Furniture</span>India
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-charcoal">
              <Link href="/products" className="hover:text-brass transition-colors">
                Shop
              </Link>
              <CartLink />
            </nav>
          </header>
          {children}
          <footer className="mt-24 border-t border-walnut/10 px-6 md:px-12 py-10 text-sm text-charcoal/70 bg-cream">
            <p className="font-display text-walnut text-lg mb-2">
              DreamComfortFurnitureIndia
            </p>
            <p>Handmade furniture & interiors, shipped across India.</p>
            <p className="mt-4">© {new Date().getFullYear()} DreamComfortFurnitureIndia. All rights reserved.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
