"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function YouTubeFacade({ videoId, title = "YouTube video player" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  // Extract clean ID if full URL passed
  let cleanId = videoId;
  if (videoId.includes("youtube.com/watch?v=")) {
    cleanId = videoId.split("v=")[1]?.split("&")[0];
  } else if (videoId.includes("youtu.be/")) {
    cleanId = videoId.split("youtu.be/")[1]?.split("?")[0];
  } else if (videoId.includes("youtube.com/embed/")) {
    cleanId = videoId.split("embed/")[1]?.split("?")[0];
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg my-8 border border-[#E5DCCB] dark:border-[#2E2A24] bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden shadow-md my-8 border border-[#E5DCCB] dark:border-[#2E2A24] bg-stone-900 cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsPlaying(true);
      }}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 720px"
        onError={(e) => {
          // Fallback to HQ thumbnail if maxres is unavailable
          e.currentTarget.src = fallbackThumbnail;
        }}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Pulsing Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B88A2B]/40 dark:bg-[#C5A059]/40 animate-ping" />
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#B88A2B] to-[#E5C177] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play size={24} className="fill-white translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
