"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { T, money } from "@/lib/i18n";
import { fulfillmentSummaryText, type PickupRow, type CityRow } from "@/lib/fulfillment-summary";

export default function SummaryClient({ pickupPoints, cities }: { pickupPoints: PickupRow[]; cities: CityRow[] }) {
  const { lang } = useLang();
  const { lines, total } = useCart();
  const { state, setOrderNote } = useCheckout();
  const t = T[lang];
  const router = useRouter();
  const [noteShown, setNoteShown] = useState(!!state.orderNote);

  const backHref = state.fulfillment === "pickup" ? "/checkout/pickup" : "/checkout/delivery";
  const summaryText = fulfillmentSummaryText(lang, state, pickupPoints, cities);

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <div className="max-w-[760px]">
        <Link href={backHref} className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
          {t.back}
        </Link>
        <h3 className="text-[26px] vm:text-[38px] mb-3.5 vm:mb-5.5">{t.summaryTitle}</h3>
        <div className="flex flex-col gap-2 mb-3.5">
          {lines.map((line) => (
            <div key={line.key} className="flex justify-between text-[15px] vm:text-[17px]">
              <span>{line.name} × {line.qty}</span>
              <span>{money(line.qty * line.unitPrice, lang)}</span>
            </div>
          ))}
        </div>
        <div className="hr" />
        <div className="flex justify-between font-[var(--font-heading)] font-semibold text-[19px] vm:text-[24px] my-3.5 mb-6">
          <span>{t.total}</span><span style={{ color: "var(--color-accent-700)" }}>{money(total, lang)}</span>
        </div>
        <div className="card py-3 px-3.5 mb-2.5 vm:mb-3">
          <div className="card-kicker">{t.customerInfo}</div>
          <div className="text-[15px] vm:text-[17px] mt-1">{state.customer.name} · {state.customer.phone} · {state.customer.email}</div>
        </div>
        <div className="card py-3 px-3.5 mb-4">
          <div className="card-kicker">{t.fulfillInfo}</div>
          <div className="text-[15px] vm:text-[17px] mt-1">{summaryText}</div>
        </div>

        {noteShown ? (
          <div className="field mb-3.5">
            <label>{t.orderNoteLabel}</label>
            <textarea className="input" value={state.orderNote} onChange={(e) => setOrderNote(e.target.value)} />
          </div>
        ) : (
          <button onClick={() => setNoteShown(true)} className="btn btn-ghost mb-3.5">{t.addNote}</button>
        )}

        <button onClick={() => router.push("/checkout/payment")} className="btn btn-primary text-[18px] vm:text-[19px] py-3.5 px-8">
          {t.toPayment}
        </button>
      </div>
    </section>
  );
}
