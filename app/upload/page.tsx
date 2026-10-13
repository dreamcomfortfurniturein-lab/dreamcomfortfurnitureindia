"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { uploadMediaToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";

export default function MobileUploadPage() {
  const [orientation, setOrientation] = useState<"landscape" | "vertical">("vertical");
  const [mediaType, setMediaType] = useState<"video" | "poster">("video");
  const [sourceOption, setSourceOption] = useState<"upload" | "url">("upload");

  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaLink, setCtaLink] = useState("/products");
  const [uploaderName, setUploaderName] = useState("Phone Admin");
  const [uploaderPhone, setUploaderPhone] = useState("+91 99594 27831");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submission state
  const [submittedData, setSubmittedData] = useState<{
    requestId: string;
    approvalCode: string;
    adminEmail: string;
    approveLink: string;
  } | null>(null);

  // Approval code entry state
  const [enteredCode, setEnteredCode] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccessMessage, setApprovalSuccessMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle direct file upload from phone (camera/gallery)
  async function handlePhoneFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(10);

    const resourceType = mediaType === "video" ? "video" : "image";
    const folder = orientation === "vertical" ? "reels_vertical" : "hero_landscape";

    try {
      const result = await uploadMediaToCloudinary(
        file,
        resourceType,
        folder,
        (percent) => setUploadProgress(percent)
      );

      setMediaUrl(result.secure_url);
      setIsUploading(false);
      setUploadProgress(null);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(null);
      setErrorMsg(err.message || "Upload failed. Please check network connection.");
    }
  }

  // Handle submission for admin approval via Gmail
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!mediaUrl.trim()) {
      setErrorMsg("Please upload a file or paste a media URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/media-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orientation,
          type: mediaType,
          mediaUrl: mediaUrl.trim(),
          title: title.trim() || (mediaType === "video" ? "Workshop Live Reel" : "Curated Collection"),
          subtitle: subtitle.trim() || "Handcrafted Sheesham & Teak Wood",
          ctaLink: ctaLink.trim() || "/products",
          uploaderName: uploaderName.trim(),
          uploaderPhone: uploaderPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit.");

      setSubmittedData({
        requestId: data.requestId,
        approvalCode: data.approvalCode,
        adminEmail: data.adminEmail,
        approveLink: data.approveLink,
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Submission failed.");
    }
  }

  // Handle immediate approval code verification
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!submittedData || !enteredCode.trim()) return;

    setIsApproving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/media-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: submittedData.requestId,
          code: enteredCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed.");

      setApprovalSuccessMessage(
        `✓ Approved! Your ${orientation.toUpperCase()} ${mediaType.toUpperCase()} is now LIVE on the front page!`
      );
      setIsApproving(false);
    } catch (err: any) {
      setIsApproving(false);
      setErrorMsg(err.message || "Invalid approval code.");
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 text-sand-100 py-6 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Mobile Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/40">
            <span>📱</span>
            <span>Mobile Media Upload Portal</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Upload from Phone
          </h1>
          <p className="text-xs text-sand-300/80">
            Post landscape or vertical videos & posters with Gmail admin verification.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-sm">✕</button>
          </div>
        )}

        {/* Success / Approved State */}
        {approvalSuccessMessage ? (
          <div className="glass-card p-6 rounded-2xl border-2 border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="font-display font-bold text-xl text-sand-50">
              Published to Live Site!
            </h3>
            <p className="text-xs text-sand-300 leading-relaxed">
              {approvalSuccessMessage}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="gold-gradient-bg text-navy-900 font-bold px-6 py-2.5 rounded-xl text-xs hover:brightness-110 shadow-lg"
              >
                View Live Front Page →
              </Link>
              <button
                onClick={() => {
                  setApprovalSuccessMessage(null);
                  setSubmittedData(null);
                  setMediaUrl("");
                  setTitle("");
                  setSubtitle("");
                }}
                className="px-5 py-2.5 rounded-xl bg-navy-800 text-sand-200 text-xs border border-gold/20"
              >
                Upload Another Item
              </button>
            </div>
          </div>
        ) : submittedData ? (
          /* Step 2: Verification Code Sent to Gmail */
          <div className="glass-card p-6 rounded-2xl border-2 border-gold/50 space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-3xl block">✉️</span>
              <h3 className="font-display font-bold text-lg text-sand-50">
                Approval Code Sent to Gmail!
              </h3>
              <p className="text-xs text-sand-300/80">
                Sent to: <strong className="text-gold font-mono">{submittedData.adminEmail}</strong>
              </p>
            </div>

            <div className="p-3.5 bg-navy-950 rounded-xl border border-gold/20 text-center space-y-1">
              <span className="text-[11px] text-sand-300/70 uppercase tracking-widest block font-mono">
                Verification Security Code
              </span>
              <div className="text-2xl font-mono font-bold text-amber-400 tracking-wider">
                {submittedData.approvalCode}
              </div>
              <span className="text-[10px] text-emerald-400 block">
                (Click the email link or enter the 6-digit code below to publish live)
              </span>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Enter 6-Digit Approval Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="e.g. 784912"
                  className="w-full text-center tracking-widest font-mono text-lg bg-navy-800 border border-gold/40 rounded-xl px-4 py-3 text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isApproving}
                className="w-full py-3 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm hover:brightness-110 shadow-lg shadow-gold/25 transition-all"
              >
                {isApproving ? "Verifying & Publishing..." : "Approve & Publish to Front Page →"}
              </button>
            </form>

            <div className="text-center pt-2">
              <a
                href={submittedData.approveLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold underline hover:text-gold-light"
              >
                Or test 1-Click Approval Link ↗
              </a>
            </div>
          </div>
        ) : (
          /* Step 1: Upload Form */
          <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6 rounded-2xl border border-gold/25 space-y-5 shadow-xl">
            {/* 1. Dimension Toggle (Landscape vs Vertical) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-sand-200">
                1. Select Showcase Dimension *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    orientation === "landscape"
                      ? "bg-navy-800 border-gold shadow-md text-gold"
                      : "bg-navy-950/60 border-sand-300/15 text-sand-300 hover:border-gold/40"
                  }`}
                >
                  <div className="text-lg mb-1">🖥️</div>
                  <strong className="text-xs block font-bold text-sand-100">Landscape (16:9)</strong>
                  <span className="text-[10px] text-sand-300/70 block mt-0.5">Desktop & Widescreen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrientation("vertical")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    orientation === "vertical"
                      ? "bg-navy-800 border-gold shadow-md text-gold"
                      : "bg-navy-950/60 border-sand-300/15 text-sand-300 hover:border-gold/40"
                  }`}
                >
                  <div className="text-lg mb-1">📱</div>
                  <strong className="text-xs block font-bold text-sand-100">Vertical (9:16)</strong>
                  <span className="text-[10px] text-sand-300/70 block mt-0.5">Mobile Reels & Stories</span>
                </button>
              </div>
            </div>

            {/* 2. Media Type (Video vs Poster) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-sand-200">
                2. Media Format *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-medium text-center transition-all ${
                    mediaType === "video"
                      ? "bg-gold text-navy-900 border-gold font-bold shadow-md"
                      : "bg-navy-800 text-sand-200 border-sand-300/20"
                  }`}
                >
                  🎬 Video (MP4/Reel)
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType("poster")}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-medium text-center transition-all ${
                    mediaType === "poster"
                      ? "bg-gold text-navy-900 border-gold font-bold shadow-md"
                      : "bg-navy-800 text-sand-200 border-sand-300/20"
                  }`}
                >
                  🖼️ Poster Image
                </button>
              </div>
            </div>

            {/* 3. Media Upload from Phone / Camera */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-sand-200">
                  3. Phone File or Direct URL *
                </label>
                <div className="flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSourceOption("upload")}
                    className={sourceOption === "upload" ? "text-gold underline font-bold" : "text-sand-300"}
                  >
                    Direct Upload
                  </button>
                  <span className="text-sand-300/40">|</span>
                  <button
                    type="button"
                    onClick={() => setSourceOption("url")}
                    className={sourceOption === "url" ? "text-gold underline font-bold" : "text-sand-300"}
                  >
                    Paste URL
                  </button>
                </div>
              </div>

              {sourceOption === "upload" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={mediaType === "video" ? "video/mp4,video/webm,video/*" : "image/*"}
                    onChange={handlePhoneFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-navy-950/60"
                  >
                    <div className="text-2xl mb-1">{mediaType === "video" ? "📹" : "📷"}</div>
                    <span className="text-xs font-medium text-sand-100 block">
                      {isUploading
                        ? "Uploading to Cloudinary..."
                        : `Tap to Select ${mediaType === "video" ? "Video" : "Photo"} from Phone`}
                    </span>
                    <span className="text-[10px] text-sand-300/60 mt-0.5 block">
                      Camera recording or gallery supported
                    </span>
                  </div>

                  {uploadProgress !== null && (
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[11px] text-sand-300 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden">
                        <div
                          className="h-full gold-gradient-bg transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/... or https://i.postimg.cc/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-sand-100 focus:outline-none focus:border-gold"
                />
              )}

              {/* Uploaded Media URL preview */}
              {mediaUrl && (
                <div className="p-2.5 bg-navy-950 rounded-xl border border-emerald-500/30 text-[11px] flex items-center justify-between gap-2">
                  <span className="truncate text-emerald-400 font-mono">{mediaUrl}</span>
                  <span className="text-emerald-300 font-bold shrink-0">✓ Ready</span>
                </div>
              )}
            </div>

            {/* 4. Captions & Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Teak Headboard Finishing"
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Handcrafted low-platform teakwood frame"
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={uploaderPhone}
                    onChange={(e) => setUploaderPhone(e.target.value)}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Submitting..." : "Send for Admin Approval (Code to Gmail) →"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Bottom Navigation Links */}
        <div className="text-center pt-2 pb-6 flex items-center justify-center gap-4 text-xs text-sand-300/70">
          <Link href="/" className="hover:text-gold">← Return Home</Link>
          <span>•</span>
          <Link href="/products" className="hover:text-gold">Browse Collection</Link>
        </div>
      </div>
    </div>
  );
}
