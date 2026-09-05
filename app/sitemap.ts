import type { MetadataRoute } from "next";
import { getSets } from "@/lib/catalog";
import { getBaseUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/sets`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/build`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/beer-sheva`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/mahsan`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cancellations`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const sets = await getSets();
  const setRoutes: MetadataRoute.Sitemap = sets.map((s) => ({
    url: `${base}/sets/${s.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...setRoutes];
}
