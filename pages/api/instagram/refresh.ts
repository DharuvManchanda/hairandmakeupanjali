import type { NextApiRequest, NextApiResponse } from "next";
import { getInstagramToken, IG_TOKEN_KEY } from "../../../lib/instagram-token";

type SuccessResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  permissions: string;
};
type ErrorResponse = { error: string };

// Persists the refreshed token to Edge Config via the Vercel REST API so the
// site picks it up immediately, without a redeploy.
async function saveToken(token: string) {
  const connection = process.env.EDGE_CONFIG;
  const apiToken = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!connection || !apiToken) {
    throw new Error("EDGE_CONFIG or VERCEL_API_TOKEN not configured");
  }

  const edgeConfigId = new URL(connection).pathname.replace(/^\//, "");
  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${
    teamId ? `?teamId=${teamId}` : ""
  }`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: IG_TOKEN_KEY, value: token }],
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to store token in Edge Config: ${res.status} ${await res.text()}`
    );
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = await getInstagramToken();
    if (!token) {
      return res.status(500).json({ error: "ACCESS_TOKEN not configured" });
    }

    const igRes = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );

    if (!igRes.ok) {
      const err = await igRes.json();
      throw new Error(err.error?.message ?? igRes.statusText);
    }

    const data: SuccessResponse = await igRes.json();

    await saveToken(data.access_token);

    const daysLeft = Math.round(data.expires_in / 86400);
    console.log(`Instagram token refreshed. Expires in ${daysLeft} days.`);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Instagram token refresh failed:", err);
    return res.status(502).json({ error: "Failed to refresh token" });
  }
}
