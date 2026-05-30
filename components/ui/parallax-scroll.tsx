"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Media = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
};

// MasonryCard — used in the editorial masonry grid.
// No fixed aspect ratio; each card sizes to its natural image height.
// Videos show as a still thumbnail + play button overlay (video plays on detail page).
export function MasonryCard({ card }: { card: Media }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const isVideo = card.media_type === "VIDEO";
  const displaySrc = isVideo ? (card.thumbnail_url ?? card.media_url) : card.media_url;
  const captionTitle = card.caption?.split("\n")[0] ?? "";

  return (
    <div className="break-inside-avoid mb-4 md:mb-6 group relative rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer">
      {/* Per-card skeleton — visible until img onLoad fires */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
      )}

      {error ? (
        <div className="h-48 flex items-center justify-center">
          <span className="text-neutral-600 text-xs">Preview unavailable</span>
        </div>
      ) : (
        <>
          {/* Natural-ratio image — width: 100%, height: auto */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt={captionTitle || "Instagram post"}
            loading="lazy"
            className={cn(
              "w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]",
              !loaded && "invisible"
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />

          {/* Play icon overlay for video cards */}
          {isVideo && loaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Caption slide-up overlay on hover */}
          {captionTitle && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-4 pt-10 pb-5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <p className="text-white text-xs md:text-sm font-medium line-clamp-2 leading-snug">
                {captionTitle}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Card — fixed aspect-[4/5] card used by FocusCards (fallback / other pages).
export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Media;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const [mediaError, setMediaError] = useState(false);
    const [mediaLoaded, setMediaLoaded] = useState(false);

    const isImage = card.media_type === "IMAGE" || card.media_type === "CAROUSEL_ALBUM";
    const isVideo = card.media_type === "VIDEO";

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-lg relative bg-black overflow-hidden aspect-[4/5] w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
      >
        {!mediaLoaded && !mediaError && (
          <div className="absolute inset-0 z-10 bg-neutral-800 animate-pulse" />
        )}

        {mediaError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-500 text-sm">Preview unavailable</span>
          </div>
        ) : isImage ? (
          <>
            <Image src={card.media_url} alt="" fill aria-hidden className="object-cover scale-110 blur-xl opacity-70 select-none pointer-events-none" />
            <Image src={card.media_url} alt={card.caption || "Instagram Media"} fill className="absolute inset-0 object-contain" onLoad={() => setMediaLoaded(true)} onError={() => setMediaError(true)} />
          </>
        ) : isVideo ? (
          <>
            {card.thumbnail_url && (
              <Image src={card.thumbnail_url} alt="" fill aria-hidden className="object-cover scale-110 blur-xl opacity-70 select-none pointer-events-none" />
            )}
            <video autoPlay muted loop playsInline preload="none" poster={card.thumbnail_url} className="absolute inset-0 w-full h-full object-contain" onCanPlay={() => setMediaLoaded(true)} onError={() => setMediaError(true)}>
              <source src={card.media_url} type="video/mp4" />
            </video>
          </>
        ) : null}

        <div className={cn("absolute inset-0 z-20 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300", hovered === index ? "opacity-100" : "opacity-0")}>
          <div className="text-sm md:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
            {card.caption?.split("\n")[0] || "No Caption"}
          </div>
        </div>
      </div>
    );
  }
);
Card.displayName = "Card";

export function FocusCards({ cards }: { cards: Media[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full my-10">
      {cards.map((card, index) => (
        <Card key={card.id} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
