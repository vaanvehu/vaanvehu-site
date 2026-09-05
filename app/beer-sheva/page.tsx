import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/shop/Footer";
import { getSettings, getDeliveryCities } from "@/lib/catalog";
import { waHref } from "@/lib/whatsapp";

// Standalone landing page for the "ארבעת המינים בבאר שבע" search intent — kept
// outside app/(shop) on purpose so it renders instantly with no language gate or
// cart/checkout context: a visitor arriving from Google should see Be'er Sheva
// content immediately, not a "choose a language" screen. It still shares the
// root layout's fonts/CSP/globals, so it's visually the same site.
export const metadata: Metadata = {
  title: "ארבעת המינים בבאר שבע — משלוח עד הבית | וְאַנְוֵהוּ",
  description:
    "ארבעת המינים בבאר שבע והסביבה: אתרוג, לולב, הדסים וערבות בהידור, סטים מוכנים או הרכבה אישית, עם משלוח עד הבית לכל שכונות באר שבע. הזמינו אונליין או קבלו פרטים בוואטסאפ.",
};

export default async function BeerShevaPage() {
  const [settings, cities] = await Promise.all([getSettings(), getDeliveryCities()]);
  const city = cities.find((c) => c.nameHe === "באר שבע");
  const waMsg = "שלום, מעוניין/ת בארבעת המינים עם משלוח לבאר שבע";

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <header className="flex justify-center pt-9 pb-6 vm:pt-14 vm:pb-8">
        <Link href="/">
          <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[70px] vm:h-[92px] w-auto" />
        </Link>
      </header>

      <main className="flex-1 max-w-[720px] mx-auto px-5 pb-16 text-center">
        <h1
          className="font-[var(--font-heading)] text-[30px] vm:text-[38px] leading-[1.25] mb-3.5"
          style={{ color: "var(--brand-green)" }}
        >
          ארבעת המינים בבאר שבע
        </h1>
        <p className="text-[17px] vm:text-[19px] leading-[1.75] mb-8" style={{ color: "var(--color-text)" }}>
          סטים מהודרים של ארבעת המינים — אתרוג, לולב, הדסים וערבות — בסט מוכן או בהרכבה אישית לפי
          הטעם שלכם, עם משלוח עד הבית לכל רחבי באר שבע.
        </p>

        <div className="flex flex-col vm:flex-row gap-3.5 justify-center mb-10">
          <Link href="/" className="btn btn-primary justify-center py-4 px-8 text-[19px]">
            למעבר להזמנה
          </Link>
          <a
            href={waHref(settings.whatsappNumber, waMsg)}
            className="btn btn-secondary justify-center py-4 px-8 text-[19px]"
          >
            לפרטים בוואטסאפ
          </a>
        </div>

        {city && (
          <div className="card p-5 vm:p-7 text-right mx-auto" style={{ maxWidth: 480 }}>
            <p className="card-kicker mb-2.5">משלוח לבאר שבע</p>
            <ul className="space-y-1.5 text-[16px]" style={{ color: "var(--color-text)" }}>
              <li>
                עלות משלוח: ₪{city.price} (מינימום הזמנה ₪{city.minimum})
                {city.freeOver != null && <> · חינם בהזמנה מעל ₪{city.freeOver}</>}
              </li>
              {(() => {
                const named = city.neighborhoods.filter((n) => !n.nameHe.startsWith("אחר"));
                return named.length > 0 ? <li>שכונות: {named.map((n) => n.nameHe).join(", ")}</li> : null;
              })()}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
