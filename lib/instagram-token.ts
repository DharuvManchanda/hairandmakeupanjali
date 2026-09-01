import { get } from "@vercel/edge-config";

export const IG_TOKEN_KEY = "instagram_access_token";

// Reads the current Instagram access token: Edge Config first (kept fresh by
// the /api/instagram/refresh cron), falling back to the ACCESS_TOKEN env var.
export async function getInstagramToken(): Promise<string | undefined> {
  if (process.env.EDGE_CONFIG) {
    try {
      const token = await get<string>(IG_TOKEN_KEY);
      if (token) return token;
    } catch (err) {
      console.error("Edge Config read failed, falling back to env token:", err);
    }
  }
  return process.env.ACCESS_TOKEN;
}
