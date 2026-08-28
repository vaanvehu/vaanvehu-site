"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T, money, PAYMENT_METHODS } from "@/lib/i18n";

export default function PaymentPage() {
  const { lang } = useLang();
  const { lines, total, clear } = useCart();
  const { state, setPaymentMethod, reset } = useCheckout();
  const t = T[lang];
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalid = !state.paymentMethod || submitting;

  const placeOrder = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          customer: state.customer,
          lines: lines.map((l) => ({
            kind: l.kind, name: l.name, image: l.image, unitPrice: l.unitPrice, qty: l.qty,
            extrasText: l.extrasText, pitamChoice: l.pitamChoice, note: l.note,
          })),
          fulfillment: state.fulfillment,
          pickupPointId: state.pickupPointId,
          delivery: state.delivery,
          paymentMethod: state.paymentMethod,
          note: state.orderNote,
        }),
      });
      if (!res.ok) throw new Error("order_failed");
      const data = await res.json();
      clear();
      reset();
      router.push(`/order/${data.number}`);
    } catch {
      setError(lang === "he" ? "אירעה שגיאה בשליחת ההזמנה. נסו שוב." : lang === "en" ? "Something went wrong placing the order. Please try again." : "Une erreur est survenue. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[640px]">
        <Link href="/checkout/summary" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.back}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-3.5 vm:mb-5.5">{t.paymentTitle}</h3>
        <div className="flex flex-col gap-2.5 vm:gap-3">
          {PAYMENT_METHODS[lang].map((pm) => (
            <div
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className="card cursor-pointer flex-row items-center gap-3.5 py-3.5 px-4 vm:py-4.5 vm:px-5"
            >
              <span className="flex-none w-5 h-5 rounded-full border-[1.5px]" style={{
                borderColor: state.paymentMethod === pm.id ? "var(--color-accent-700)" : "var(--color-divider)",
                background: state.paymentMethod === pm.id ? "var(--color-accent-700)" : "transparent",
                boxShadow: state.paymentMethod === pm.id ? "inset 0 0 0 3px var(--color-bg)" : "none",
              }} />
              <span className="text-[19px] vm:text-[20px]">{pm.label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-[var(--font-heading)] font-semibold text-[19px] vm:text-[24px] my-6 vm:my-6.5 mb-5">
          <span>{t.total}</span><span style={{ color: "var(--color-accent-700)" }}>{money(total, lang)}</span>
        </div>
        {error && <p className="text-[15px] mb-3" style={{ color: "#8f2b2b" }}>{error}</p>}
        <button disabled={invalid} onClick={placeOrder} className="btn btn-primary text-[18px] vm:text-[19px] py-3.5 px-8">
          {t.placeOrder}
        </button>
      </div>
    </section>
  );
}
