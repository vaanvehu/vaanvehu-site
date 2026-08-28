import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "וְאַנְוֵהוּ — ארבעת המינים",
  description: "חנות ארבעת המינים וְאַנְוֵהוּ — סטים מוכנים והרכבת סט אישית",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
