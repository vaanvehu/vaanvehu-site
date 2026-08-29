import type { Metadata } from "next";
import { Bellefair, Frank_Ruhl_Libre, David_Libre } from "next/font/google";
import "./globals.css";

// Self-hosted (downloaded at build time, served from our own domain) instead of the
// runtime Google Fonts <link>/@import — sharper, no external round-trip, no flash of a
// fallback serif while the page loads.
const bellefair = Bellefair({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bellefair",
  display: "swap",
});
const frankRuhlLibre = Frank_Ruhl_Libre({
  weight: ["400", "500", "700"],
  subsets: ["latin", "hebrew"],
  variable: "--font-frank-ruhl",
  display: "swap",
});
const davidLibre = David_Libre({
  weight: ["400", "500", "700"],
  subsets: ["latin", "hebrew"],
  variable: "--font-david-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "וְאַנְוֵהוּ — ארבעת המינים",
  description: "חנות ארבעת המינים וְאַנְוֵהוּ — סטים מוכנים והרכבת סט אישית",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${bellefair.variable} ${frankRuhlLibre.variable} ${davidLibre.variable}`}>
      <body>{children}</body>
    </html>
  );
}
