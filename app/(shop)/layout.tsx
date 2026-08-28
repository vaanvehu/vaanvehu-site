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
