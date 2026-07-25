import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="px-6 md:px-12 py-24 text-center">
      <h1 className="font-display text-3xl text-walnut mb-4">Thank you for your order 🎉</h1>
      <p className="text-charcoal/70 mb-8">
        We&apos;ve received your payment. A confirmation will be sent to your email shortly.
      </p>
      <Link href="/products" className="text-brass underline">
        Continue shopping
      </Link>
    </main>
  );
}
