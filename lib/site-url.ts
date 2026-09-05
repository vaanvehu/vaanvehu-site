// Central place to resolve the site's own absolute base URL, for sitemap.ts,
// robots.ts, and any future canonical/OG tags. Once a custom domain is
// connected, set NEXT_PUBLIC_SITE_URL in Vercel's project env vars (e.g.
// "https://vaanvehu.co.il") and everything here switches over automatically —
// no code change needed. Until then it falls back to the stable production
// *.vercel.app alias Vercel injects at build time.
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
