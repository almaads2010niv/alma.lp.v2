import type { MetadataRoute } from "next";

// ChatGPT Ads reviews landing pages with OAI-AdsBot (required) and
// OAI-SearchBot (recommended) — allowed explicitly per OpenAI's advertiser
// guidance. Everyone else keeps the previous default: allow all.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-AdsBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
  };
}
