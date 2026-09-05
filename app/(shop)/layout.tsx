import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LangProvider } from "@/contexts/LangContext";
import { CartProvider } from "@/contexts/CartContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import Header from "@/components/shop/Header";
import LangGate from "@/components/shop/LangGate";
import WhatsAppFab from "@/components/shop/WhatsAppFab";
import MobileWatermark from "@/components/shop/MobileWatermark";
import { getSettings } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Fallback metadata for every page under the main storefront (the "הזמנות" property —
// see app/beer-sheva and app/mahsan for the two dedicated landing pages). Pages that
// need their own (the legal/info pages) already export their own `metadata` and win.
export const metadata: Metadata = {
  title: "הזמנת ארבעת המינים אונליין | וְאַנְוֵהוּ — משלוחים ונקודות איסוף",
  description:
    "הזמינו ארבעת המינים בסט מוכן או בהרכבה אישית — אתרוג, לולב, הדסים וערבות. משלוח עד הבית לירושלים, בני ברק, באר שבע ועוד, או איסוף עצמי מנקודות מרכזיות.",
};

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <LangProvider>
      <CartProvider>
        <CheckoutProvider>
          <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
            <MobileWatermark />
            <LangGate />
            <Header />
            {children}
            <WhatsAppFab phone={settings.whatsappNumber} />
          </div>
        </CheckoutProvider>
      </CartProvider>
    </LangProvider>
  );
}
