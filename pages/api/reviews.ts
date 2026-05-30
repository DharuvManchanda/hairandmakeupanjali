import type { NextApiRequest, NextApiResponse } from "next";

type Review = {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

type SuccessResponse = { reviews: Review[]; mapsUrl: string; totalRating: number };
type ErrorResponse = { error: string };

let cache: { data: SuccessResponse; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=60");
    return res.status(200).json(cache.data);
  }

  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!placeId || !apiKey) {
    return res.status(500).json({ error: "Google API credentials not configured" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,url&key=${apiKey}`;
    const googleRes = await fetch(url);

    if (!googleRes.ok) {
      throw new Error(`Google API responded with ${googleRes.status}`);
    }

    const data = await googleRes.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message ?? data.status);
    }

    const result: SuccessResponse = {
      reviews: data.result.reviews ?? [],
      mapsUrl: data.result.url ?? `https://search.google.com/local/reviews?placeid=${placeId}`,
      totalRating: data.result.rating ?? 0,
    };

    cache = { data: result, timestamp: Date.now() };

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=60");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Google Reviews API error:", err);
    return res.status(502).json({ error: "Failed to fetch reviews" });
  }
}
