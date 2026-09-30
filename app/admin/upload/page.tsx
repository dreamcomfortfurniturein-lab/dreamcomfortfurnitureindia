"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "og57tmj8";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dcf_products";

export default function AdminUploadPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function openWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: "products",
        sources: ["local", "camera"],
        multiple: true,
        maxFiles: 20,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedUrls((prev) => [result.info.secure_url, ...prev]);
        }
      }
    );
    widget.open();
  }

  function copyToClipboard(url: string, index: number) {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <main className="px-6 md:px-12 py-12 max-w-3xl">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

      <h1 className="font-display text-3xl text-walnut mb-2">Upload product photos</h1>
      <p className="text-charcoal/70 mb-8">
        Upload photos here, then copy each URL into the matching product&apos;s{" "}
        <code className="bg-linen px-1 rounded-sm">images</code> field in{" "}
        <code className="bg-linen px-1 rounded-sm">data/products.json</code>.
      </p>

      <button
        onClick={openWidget}
        className="bg-walnut text-cream px-6 py-3 rounded-sm hover:bg-charcoal transition-colors mb-10"
      >
        Upload photos
      </button>

      {uploadedUrls.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-walnut mb-4">Uploaded ({uploadedUrls.length})</h2>
          <div className="space-y-3">
            {uploadedUrls.map((url, i) => (
              <div key={url} className="flex items-center gap-4 border border-walnut/10 rounded-sm p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-sm" />
                <input
                  readOnly
                  value={url}
                  className="flex-1 text-xs bg-linen px-3 py-2 rounded-sm text-charcoal/70"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={() => copyToClipboard(url, i)}
                  className="text-sm border border-walnut text-walnut px-3 py-2 rounded-sm hover:bg-linen transition-colors whitespace-nowrap"
                >
                  {copiedIndex === i ? "Copied ✓" : "Copy URL"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}