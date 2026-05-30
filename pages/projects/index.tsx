"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { MasonryCard } from "@/components/ui/parallax-scroll";
import { LinkPreview } from "@/components/ui/link-preview";

type Media = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
};

// Varied heights simulate the staggered masonry proportions during skeleton load
const SKELETON_HEIGHTS = [
  "h-72", "h-96",
  "h-56", "h-[28rem]",
  "h-64", "h-80",
  "h-[22rem]", "h-52",
  "h-80", "h-60",
  "h-96", "h-48",
];

function MasonrySkeleton() {
  return (
    <div className="min-h-screen bg-black py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Title skeleton */}
        <div className="mb-10">
          <div className="h-9 w-28 bg-neutral-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-44 bg-neutral-800/60 rounded animate-pulse" />
        </div>
        {/* Card skeletons in masonry columns */}
        <div className="columns-1 md:columns-2 gap-6">
          {SKELETON_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`${h} rounded-2xl bg-neutral-800 mb-4 md:mb-6 break-inside-avoid animate-pulse`}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InstagramGallery() {
  const [media, setMedia] = useState<Media[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  // Ref keeps the observer callback pointing at the latest loadMore without
  // recreating the IntersectionObserver on every state change
  const loadMoreFnRef = useRef<() => void>(() => {});

  const fetchPage = useCallback(async (cursor?: string) => {
    const url = cursor ? `/api/instagram?cursor=${cursor}` : "/api/instagram";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<{ data: Media[]; nextCursor?: string }>;
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage()
      .then(({ data, nextCursor: nc }) => {
        setMedia(data);
        setNextCursor(nc);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    fetchPage(nextCursor)
      .then(({ data, nextCursor: nc }) => {
        setMedia((prev) => [...prev, ...data]);
        setNextCursor(nc);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [nextCursor, loadingMore, fetchPage]);

  // Keep ref in sync with latest closure
  useEffect(() => { loadMoreFnRef.current = loadMore; }, [loadMore]);

  // Set up IntersectionObserver once — fires loadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMoreFnRef.current(); },
      { rootMargin: "800px" } // pre-fetch well before user hits the bottom
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (loading) return <MasonrySkeleton />;

  if (error && media.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-black items-center justify-center">
        <div className="flex justify-center items-center h-[40rem] flex-col px-4">
          <p className="text-white text-xl md:text-3xl max-w-3xl mx-auto mb-10 font-bold">
            Oops! Something went wrong.
          </p>
          <p className="text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
            While we fix this, check out Anjali's work on{" "}
            <LinkPreview
              url="https://www.instagram.com/hairandmakeupbyanjali/"
              isStatic={true}
              imageSrc="/images/Hero/Hero1-min.jpg"
              className="font-bold text-white"
            >
              Instagram
            </LinkPreview>{" "}
            or{" "}
            <LinkPreview
              url="https://www.linkedin.com/in/anjali-bhutani/"
              isStatic={true}
              imageSrc="/images/Hero/Hero6-min.jpg"
              className="font-bold text-white"
            >
              LinkedIn
            </LinkPreview>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Head>
      <title>Latest Work & Bridal Moments | Anjali Bhutani - Makeup Artist</title>
      <meta name="description" content="Explore Anjali Bhutani's latest bridal makeup, party looks, editorial beauty, and real client transformations directly from Instagram." />
      <meta property="og:title" content="Latest Work & Bridal Moments | Anjali Bhutani" />
      <meta property="og:description" content="Explore Anjali Bhutani's latest bridal makeup, party looks, editorial beauty, and real client transformations directly from Instagram." />
      <meta property="og:url" content="https://www.hairandmakeupbyanjali.com/projects" />
      <meta property="og:image" content="https://www.hairandmakeupbyanjali.com/og-image.jpg" />
      <meta name="twitter:title" content="Latest Work & Bridal Moments | Anjali Bhutani" />
      <meta name="twitter:description" content="Explore Anjali Bhutani's latest bridal makeup, party looks, editorial beauty, and real client transformations directly from Instagram." />
      <link rel="canonical" href="https://www.hairandmakeupbyanjali.com/projects" />
    </Head>
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Latest Work & Bridal Moments
          </h1>
          <p className="text-neutral-500 text-sm mt-1 tracking-wide">
            Explore Anjali's latest makeup and hairstyling work, including bridal transformations, party looks, editorial beauty, fashion shoots, reels, and real client moments directly from Instagram.
          </p>
        </div>

        {/* Editorial masonry grid — CSS columns, browser-native scroll */}
        <div className="columns-1 md:columns-2 gap-6">
          {media.map((card) => (
            <Link key={card.id} href={`/projects/${card.id}`}>
              <MasonryCard card={card} />
            </Link>
          ))}
        </div>

        {/* Sentinel — IntersectionObserver target for infinite scroll */}
        {nextCursor && <div ref={sentinelRef} className="h-10 w-full" />}

        {/* Incremental load spinner */}
        {loadingMore && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* End of feed */}
        {!nextCursor && media.length > 0 && (
          <p className="text-center text-neutral-600 text-sm py-10 tracking-widest uppercase">
            — End of Gallery —
          </p>
        )}
      </div>
    </div>
    </>
  );
}
