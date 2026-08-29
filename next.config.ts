import type { NextConfig } from "next";

// Fonts are self-hosted via next/font/google (see app/layout.tsx), so this
// CSP needs no allowance for fonts.googleapis.com/fonts.gstatic.com — every
// asset the page loads comes from its own origin.
const csp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  // Next.js's own hydration bootstrap uses inline <script>/style attributes;
  // tightening this further needs per-request nonces threaded through the app.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
