import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personalized/private flows — nothing useful for a search result, and
        // the admin area shouldn't be crawlable at all.
        disallow: ["/admin", "/api", "/cart", "/checkout", "/order"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
