import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

export const KV_TOKEN_KEY = "instagram:access_token";

const redis = new Redis({
  url: process.env.INSTAGRAM_KV_REST_API_URL!,
  token: process.env.INSTAGRAM_KV_REST_API_TOKEN!,
});

type SuccessResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  permissions: string;
};
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const storedToken = await redis.get<string>(KV_TOKEN_KEY);
  const token = storedToken ?? process.env.ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "ACCESS_TOKEN not configured" });
  }

  try {
    const igRes = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );

    if (!igRes.ok) {
      const err = await igRes.json();
      throw new Error(err.error?.message ?? igRes.statusText);
    }

    const data: SuccessResponse = await igRes.json();

    await redis.set(KV_TOKEN_KEY, data.access_token);

    const daysLeft = Math.round(data.expires_in / 86400);
    console.log(`Instagram token refreshed. Expires in ${daysLeft} days.`);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Instagram token refresh failed:", err);
    return res.status(502).json({ error: "Failed to refresh token" });
  }
}
