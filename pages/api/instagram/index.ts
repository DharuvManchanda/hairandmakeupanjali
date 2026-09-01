import type { NextApiRequest, NextApiResponse } from "next";
import { getInstagramToken } from "../../../lib/instagram-token";

type Media = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink?: string;
};

type SuccessResponse = { data: Media[]; nextCursor?: string };
type ErrorResponse = { error: string };

type CacheEntry = { data: Media[]; nextCursor?: string; timestamp: number };

// Server-side cache — persists across all requests for the lifetime of the process
const serverCache = new Map<string, CacheEntry>();
// 15 min keeps video CDN URLs fresh (Instagram tokens expire ~1 hr)
const CACHE_TTL = 1000 * 60 * 15;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : "";
  const cacheKey = `page:${cursor || "first"}`;

  const hit = serverCache.get(cacheKey);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=60");
    return res.status(200).json({ data: hit.data, nextCursor: hit.nextCursor });
  }

  const ACCESS_TOKEN = await getInstagramToken();
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: "Access token not configured" });
  }

  try {
    const params = new URLSearchParams({
      fields: "id,media_type,media_url,thumbnail_url,caption,timestamp,permalink",
      access_token: ACCESS_TOKEN,
      limit: "12",
    });
    if (cursor) params.set("after", cursor);

    const igRes = await fetch(`https://graph.instagram.com/me/media?${params}`);
    if (!igRes.ok) {
      const err = await igRes.json();
      throw new Error(err.error?.message ?? igRes.statusText);
    }

    const json = await igRes.json();
    const nextCursor: string | undefined = json.paging?.cursors?.after;

    serverCache.set(cacheKey, { data: json.data, nextCursor, timestamp: Date.now() });

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=60");
    return res.status(200).json({ data: json.data, nextCursor });
  } catch (err) {
    console.error("Instagram API error:", err);
    return res.status(502).json({ error: "Failed to fetch Instagram media" });
  }
}
