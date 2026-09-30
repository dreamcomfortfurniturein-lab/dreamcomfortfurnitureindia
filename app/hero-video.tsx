"use client";

import { useRef, useState } from "react";

export default function HeroVideo({ videos }: { videos: string[] }) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  }

  function goPrev() {
    setIndex((i) => (i === 0 ? videos.length - 1 : i - 1));
    setMuted(true);
  }

  function goNext() {
    setIndex((i) => (i === videos.length - 1 ? 0 : i + 1));
    setMuted(true);
  }

  return (
    <div className="relative w-full h-full group">
      <video
        key={videos[index]}
        ref={videoRef}
        src={videos[index]}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-contain"
      />

      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/60 text-cream text-xs px-3 py-1.5 rounded-sm hover:bg-black/80 transition-colors"
      >
        {muted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      {videos.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous video"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-cream w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Next video"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-cream w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {videos.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === index ? "bg-cream" : "bg-cream/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}