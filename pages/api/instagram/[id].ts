import type { NextApiRequest, NextApiResponse } from "next";
import { getInstagramToken } from "../../../lib/instagram-token";

export type MediaDetail = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink?: string;
};

type ErrorResponse = { error: string };

const itemCache = new Map<string, { data: MediaDetail; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MediaDetail | ErrorResponse>
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid media id" });
  }

  const hit = itemCache.get(id);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=60");
    return res.status(200).json(hit.data);
  }

  const ACCESS_TOKEN = await getInstagramToken();
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: "Access token not configured" });
  }

  try {
    const params = new URLSearchParams({
      fields: "id,media_type,media_url,thumbnail_url,caption,timestamp,permalink",
      access_token: ACCESS_TOKEN,
    });

    const igRes = await fetch(`https://graph.instagram.com/${id}?${params}`);
    if (!igRes.ok) {
      const err = await igRes.json();
      throw new Error(err.error?.message ?? igRes.statusText);
    }

    const data: MediaDetail = await igRes.json();
    itemCache.set(id, { data, timestamp: Date.now() });

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=60");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Instagram single media error:", err);
    return res.status(502).json({ error: "Failed to fetch media" });
  }
}
