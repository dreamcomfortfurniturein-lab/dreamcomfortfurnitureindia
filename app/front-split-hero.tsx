"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface PosterConfig {
  badge?: string;
  tag?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

interface FrontSplitHeroProps {
  videos?: string[];
  initialOrientation?: "landscape" | "vertical";
  landscapeVideos?: string[];
  landscapePoster?: PosterConfig;
  verticalVideos?: string[];
  verticalPoster?: PosterConfig;
}

const DEFAULT_LANDSCAPE_VIDEOS = [
  "https://res.cloudinary.com/og57tmj8/video/upload/v1785299830/products/kxl85oiq8kv8wwyfjktn.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

const DEFAULT_VERTICAL_VIDEOS = [
  "https://res.cloudinary.com/og57tmj8/video/upload/v1785482308/products/az48cydgfryqhphpysez.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

const DEFAULT_LANDSCAPE_POSTER: PosterConfig = {
  badge: "✦ New Collection 2026",
  tag: "100% Solid Teakwood",
  title: "Bedrooms, reimagined.",
  subtitle:
    "The Hollow edit just landed — handcrafted low-platform teakwood and moisture-resistant wood frames in deep ink and warm walnut.",
  ctaText: "Shop The Edit →",
  ctaLink: "/products?category=Bedroom Sets",
  imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_VERTICAL_POSTER: PosterConfig = {
  badge: "✦ Mobile & Reels Exclusive",
  tag: "Artisan Handcrafted",
  title: "Living Luxury, redefined.",
  subtitle:
    "Royal Sheesham 7-seater suite tailored for compact & grand spaces alike with 10-year anti-termite warranty.",
  ctaText: "Explore Living Sets →",
  ctaLink: "/products?category=Living Room",
  imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
};

export default function FrontSplitHero({
  videos,
  initialOrientation = "landscape",
  landscapeVideos = DEFAULT_LANDSCAPE_VIDEOS,
  landscapePoster = DEFAULT_LANDSCAPE_POSTER,
  verticalVideos = DEFAULT_VERTICAL_VIDEOS,
  verticalPoster = DEFAULT_VERTICAL_POSTER,
}: FrontSplitHeroProps) {
  const [orientation, setOrientation] = useState<"landscape" | "vertical">(initialOrientation);
  const [videoIndex, setVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Active video list based on orientation
  const currentVideoList =
    orientation === "vertical"
      ? verticalVideos && verticalVideos.length > 0
        ? verticalVideos
        : DEFAULT_VERTICAL_VIDEOS
      : landscapeVideos && landscapeVideos.length > 0
      ? landscapeVideos
      : videos && videos.length > 0
      ? videos
      : DEFAULT_LANDSCAPE_VIDEOS;

  const currentPoster = orientation === "vertical" ? verticalPoster : landscapePoster;

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  }

  function handleNextVideo() {
    setVideoIndex((prev) => (prev + 1) % currentVideoList.length);
  }

  function handlePrevVideo() {
    setVideoIndex((prev) => (prev - 1 + currentVideoList.length) % currentVideoList.length);
  }

  const isVertical = orientation === "vertical";

  return (
    <div className="w-full space-y-6">
      {/* Dimension Switcher Controls (Landscape vs Vertical) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-navy-950/70 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-gold/20 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs text-sand-300/80 font-medium">Showcase Dimension:</span>
          <div className="flex items-center bg-navy-900 rounded-xl p-1 border border-gold/20">
            <button
              type="button"
              onClick={() => {
                setOrientation("landscape");
                setVideoIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                orientation === "landscape"
                  ? "bg-gold text-navy-900 shadow-md font-bold"
                  : "text-sand-300 hover:text-sand-100"
              }`}
            >
              <span>🖥️</span>
              <span>Landscape (16:9)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOrientation("vertical");
                setVideoIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                orientation === "vertical"
                  ? "bg-gold text-navy-900 shadow-md font-bold"
                  : "text-sand-300 hover:text-sand-100"
              }`}
            >
              <span>📱</span>
              <span>Vertical / Reels (9:16)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/upload"
            className="text-gold hover:underline flex items-center gap-1 text-[11px] sm:text-xs"
          >
            <span>📱 Add from Phone</span>
            <span>↗</span>
          </Link>
          <span className="text-sand-300/40">•</span>
          <Link
            href="/admin"
            className="text-sand-300 hover:text-gold text-[11px] sm:text-xs"
          >
            Admin Approvals
          </Link>
        </div>
      </div>

      {/* Main Split Banner: Video (Left) + Poster (Right) */}
      <div
        className={`grid gap-5 sm:gap-6 items-stretch ${
          isVertical
            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {/* ========================================================= */}
        {/* LEFT CARD: VIDEO SHOWCASE                                */}
        {/* ========================================================= */}
        <div
          className={`relative rounded-3xl overflow-hidden border border-gold/30 shadow-2xl group bg-navy-950 flex flex-col justify-between p-6 sm:p-8 transition-all duration-500 ${
            isVertical
              ? "aspect-[9/16] min-h-[580px] sm:min-h-[640px]"
              : "h-[480px] sm:h-[520px] lg:h-[550px]"
          }`}
        >
          {/* Background Video Element */}
          <video
            key={currentVideoList[videoIndex]}
            ref={videoRef}
            src={currentVideoList[videoIndex]}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Gradients for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 z-10 pointer-events-none" />

          {/* Top Row: Orientation & Call Tag */}
          <div className="relative z-20 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-50/90 text-navy-900 text-xs font-bold shadow-md tracking-wide">
              <span>✦</span>
              <span>{isVertical ? "Vertical Reels Edit" : "Festive & Showroom Edit"}</span>
            </span>

            <div className="flex items-center gap-2">
              <a
                href="tel:+919959427831"
                className="hidden sm:flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono px-3 py-1.5 rounded-full transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Call: 99594 27831</span>
              </a>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              >
                <span>{muted ? "🔇" : "🔊"}</span>
                <span className="hidden sm:inline">{muted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
          </div>

          {/* Previous / Next Video Switchers */}
          {currentVideoList.length > 1 && (
            <div className="relative z-20 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrevVideo}
                aria-label="Previous video"
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextVideo}
                aria-label="Next video"
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                ›
              </button>
            </div>
          )}

          {/* Bottom Content: Headline, Subtitle, and CTA Button */}
          <div className="relative z-20 space-y-4">
            <div>
              <h2
                className={`font-display font-extrabold text-white tracking-tight leading-tight drop-shadow-lg ${
                  isVertical ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
                }`}
              >
                Welcome him home
              </h2>
              <div className="font-display text-xl sm:text-2xl text-gold font-light mt-0.5">
                Dream Comfort Living
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sand-200/90 max-w-md font-normal leading-relaxed drop-shadow">
              Festive-ready furniture, finished by hand in Vizag — free white-glove delivery this week.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand-50 hover:bg-gold text-navy-900 font-bold text-xs sm:text-sm shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
              >
                <span>Shop the edit</span>
                <span>→</span>
              </Link>

              {/* Indicator Dots */}
              {currentVideoList.length > 1 && (
                <div className="flex gap-1.5 items-center bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md">
                  {currentVideoList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVideoIndex(i)}
                      aria-label={`Go to video ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === videoIndex ? "w-5 bg-gold" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: POSTER EDITORIAL SHOWCASE                    */}
        {/* ========================================================= */}
        <div
          className={`relative rounded-3xl overflow-hidden border border-gold/25 shadow-2xl flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br from-[#3E1627] via-[#2A0F1B] to-[#190710] group transition-all duration-500 ${
            isVertical
              ? "aspect-[9/16] min-h-[580px] sm:min-h-[640px]"
              : "h-[480px] sm:h-[520px] lg:h-[550px]"
          }`}
        >
          {/* Background Poster Image (if provided) with dark luxury overlay */}
          {currentPoster.imageUrl && (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPoster.imageUrl}
                alt={currentPoster.title}
                className="w-full h-full object-cover filter brightness-[0.35] contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#190710] via-[#2A0F1B]/70 to-[#3E1627]/60" />
            </div>
          )}

          {/* Subtle Teak Glow Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          {/* Architectural Line Art */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sand-100">
              <path
                d="M 20 180 L 20 100 Q 20 20 100 20 Q 180 20 180 100 L 180 180 Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <path d="M 40 100 Q 100 80 160 100" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 40 140 Q 100 120 160 140" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10" y="150" width="180" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          {/* Top Badge Row */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sand-50 text-xs font-semibold tracking-wide">
              <span>✦</span>
              <span>{currentPoster.badge || "✦ New Collection 2026"}</span>
            </span>

            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300/80">
              {currentPoster.tag || "100% Solid Teakwood"}
            </span>
          </div>

          {/* Center Editorial Typography */}
          <div className="relative z-10 space-y-4 my-auto py-6">
            <h2
              className={`font-display font-extrabold text-white leading-[1.08] tracking-tight ${
                isVertical ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"
              }`}
            >
              {currentPoster.title}
            </h2>

            <p className="text-xs sm:text-sm text-sand-200/80 max-w-md font-normal leading-relaxed">
              {currentPoster.subtitle}
            </p>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10 pt-2">
            <Link
              href={currentPoster.ctaLink || "/products"}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sand-50 hover:bg-gold text-navy-900 font-bold text-xs sm:text-sm shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
            >
              <span>{currentPoster.ctaText || "Shop The Edit →"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4-COLUMN TRUST HIGHLIGHT STRIP                            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
        <div className="bg-sand-50 text-navy-900 p-4 sm:p-5 rounded-2xl shadow-md border border-sand-200 flex flex-col justify-center transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-700 text-base mb-2">
            🚚
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-navy-900">Free Shipping</h4>
          <p className="text-[11px] text-slate-600 mt-0.5">Pan-India delivery on all orders</p>
        </div>

        <div className="bg-sand-50 text-navy-900 p-4 sm:p-5 rounded-2xl shadow-md border border-sand-200 flex flex-col justify-center transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-700 text-base mb-2">
            🏡
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-navy-900">1,200+ Homes</h4>
          <p className="text-[11px] text-slate-600 mt-0.5">Furnished with lasting care in Vizag</p>
        </div>

        <div className="bg-sand-50 text-navy-900 p-4 sm:p-5 rounded-2xl shadow-md border border-sand-200 flex flex-col justify-center transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-700 text-base mb-2">
            🪵
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-navy-900">Solid Timber</h4>
          <p className="text-[11px] text-slate-600 mt-0.5">No flat-pack shortcuts or low-grade ply</p>
        </div>

        <div className="bg-sand-50 text-navy-900 p-4 sm:p-5 rounded-2xl shadow-md border border-sand-200 flex flex-col justify-center transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-700 text-base mb-2">
            🛡️
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-navy-900">10-Year Warranty</h4>
          <p className="text-[11px] text-slate-600 mt-0.5">Joinery integrity guaranteed</p>
        </div>
      </div>
    </div>
  );
}
