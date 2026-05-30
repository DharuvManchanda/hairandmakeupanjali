"use client";

import { useEffect, useState } from "react";

type Review = {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

const CHAR_LIMIT = 150;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > CHAR_LIMIT;
  const displayed = expanded || !isLong ? review.text : review.text.slice(0, CHAR_LIMIT) + "…";

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img
          src={review.profile_photo_url}
          alt={review.author_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-white text-sm">
            {review.author_name}
          </h3>
          <p className="text-xs text-gray-500">
            {review.relative_time_description}
          </p>
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {displayed}
        {isLong && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="ml-1 text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mapsUrl, setMapsUrl] = useState<string>("");
  const [totalRating, setTotalRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((data) => {
        setReviews(data.reviews);
        setMapsUrl(data.mapsUrl);
        setTotalRating(data.totalRating);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-black px-4 py-16">
        <div className="mx-auto max-w-7xl text-center text-gray-400">
          Loading reviews...
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) return null;

  return (
    <section className="bg-black px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">
          Client Love
        </h2>
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < Math.round(totalRating) ? "text-yellow-400" : "text-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white font-semibold">{totalRating}</span>
          <span className="text-gray-400 text-sm">on Google</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {mapsUrl && (
          <div className="mt-10 text-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-medium text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              View all reviews on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
