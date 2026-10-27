import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "./cart-drawer";
import LuxuryHeader from "./luxury-header";
import LuxuryFooter from "./luxury-footer";
import DesignAssistantWidget from "./design-assistant-widget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dream Comfort Furniture India | Handcrafted Solid Wood Luxury Furniture",
  description:
    "India's premier solid Sheesham & CP Teak furniture workshop. Discover hand-carved maharaja sofas, solid teak hydraulic beds, dining suites, and custom woodwork with 10-year anti-termite guarantee.",
  other: {
    "google-adsense-account": "ca-pub-7132015137354089",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7132015137354089" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7132015137354089"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} font-body bg-[#FBFBFA] text-[#111111] min-h-screen flex flex-col antialiased selection:bg-[#D4AF37] selection:text-white`}
      >
        <CartProvider>
          {/* Modern Luxury Header & Navigation */}
          <LuxuryHeader />

          {/* Page Content */}
          <div className="flex-1">{children}</div>

          {/* Cart Drawer Modal */}
          <CartDrawer />

          {/* Modern Indian Luxury Dark Footer */}
          <LuxuryFooter />

          {/* Interactive Special Rooms Design Assistant */}
          <DesignAssistantWidget />
        </CartProvider>
      </body>
    </html>
  );
}