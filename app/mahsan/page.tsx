import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/shop/Footer";
import { getSettings } from "@/lib/catalog";
import { waHref } from "@/lib/whatsapp";

// Standalone landing page for the "רכישה/מכירה סיטונאית של ארבעת המינים" search
// intent (bulk buyers: stores, gabbaim, community organizers) — outside app/(shop)
// on purpose, same reasoning as app/beer-sheva/page.tsx. No cart/pricing here:
// wholesale pricing is negotiated directly over WhatsApp, not self-serve.
export const metadata: Metadata = {
  title: "מכירה סיטונאית של ארבעת המינים | מחסן וְאַנְוֵהוּ",
  description:
    "רכישה סיטונאית של ארבעת המינים — אתרוגים, לולבים, הדסים וערבות — לחנויות, גבאים ומארגני קהילה. מחירי סיטונאות וזמינות מלאי, לפרטים ומחירון פנו בוואטסאפ.",
};

export default async function MahsanPage() {
  const settings = await getSettings();
  const waMsg = "שלום, מעוניין/ת ברכישה סיטונאית של ארבעת המינים";

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <header className="flex justify-center pt-9 pb-6 vm:pt-14 vm:pb-8">
        <Link href="/">
          <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[70px] vm:h-[92px] w-auto" />
        </Link>
      </header>

      <main className="flex-1 max-w-[720px] mx-auto px-5 pb-16 text-center">
        <p className="card-kicker mb-2.5">מחסן וְאַנְוֵהוּ — סיטונאות</p>
        <h1
          className="font-[var(--font-heading)] text-[30px] vm:text-[38px] leading-[1.25] mb-3.5"
          style={{ color: "var(--brand-green)" }}
        >
          מכירה סיטונאית של ארבעת המינים
        </h1>
        <p className="text-[17px] vm:text-[19px] leading-[1.75] mb-8" style={{ color: "var(--color-text)" }}>
          אתרוגים, לולבים, הדסים וערבות בכל הדרגות ובכל הכמויות — לחנויות, גבאי בית כנסת ומארגני
          קהילה. מחירי סיטונאות ומלאי מתעדכן זמינים לפי פנייה אישית.
        </p>

        <div className="flex justify-center mb-2">
          <a
            href={waHref(settings.whatsappNumber, waMsg)}
            className="btn btn-primary justify-center py-4 px-9 text-[19px]"
          >
            לפרטים ומחירון בוואטסאפ
          </a>
        </div>
        <p className="text-[14px]" style={{ color: "var(--color-text)", opacity: 0.65 }}>
          מענה אישי ומהיר — ספרו לנו איזו כמות וסוג אתם צריכים
        </p>
      </main>

      <Footer />
    </div>
  );
}
