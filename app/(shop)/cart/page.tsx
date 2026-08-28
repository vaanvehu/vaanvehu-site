"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { T, money } from "@/lib/i18n";

export default function CartPage() {
  const { lang } = useLang();
  const { lines, count, total, inc, dec, remove } = useCart();
  const t = T[lang];

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <Link href="/" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
        {t.continueShopping}
      </Link>
      <h3 className="text-[28px] vm:text-[40px] mb-3.5 vm:mb-6.5">{t.cartTitle}</h3>
      {lines.length === 0 && <p className="opacity-60 text-[17px]">{t.cartEmpty}</p>}

      <div className="grid grid-cols-1 vd:grid-cols-[1fr_340px] gap-4.5 vd:gap-11 items-start">
        <div className="flex flex-col gap-3.5">
          {lines.map((line) => (
            <div key={line.key} className="card flex-row gap-3 vm:gap-4.5 p-3 vm:p-4.5 items-start">
              <div
                className="w-[74px] h-[74px] vm:w-24 vm:h-24 rounded-[var(--radius-sm)] flex-none bg-cover bg-center"
                style={{ backgroundImage: line.image ? `url('/${line.image}')` : undefined, backgroundColor: "var(--color-accent-100)" }}
              />
              <div className="flex-1">
                <div className="font-[var(--font-heading)] text-[20px] vm:text-[24px] font-semibold leading-[1.25]">{line.name}</div>
                {line.extrasText && <div className="text-[15px] vm:text-[16px] opacity-75 mt-1">{line.extrasText}</div>}
                <div className="flex items-center justify-between mt-2.5 vm:mt-3.5">
                  <div className="flex items-center gap-3 vm:gap-3.5">
                    <button onClick={() => dec(line.key)} className="btn btn-secondary btn-icon w-10 h-10 vm:w-[42px] vm:h-[42px] text-[22px] leading-none">−</button>
                    <span className="font-[var(--font-heading)] text-[20px] vm:text-[21px] min-w-[22px] text-center">{line.qty}</span>
                    <button onClick={() => inc(line.key)} className="btn btn-secondary btn-icon w-10 h-10 vm:w-[42px] vm:h-[42px] text-[22px] leading-none">+</button>
                  </div>
                  <span className="font-[var(--font-heading)] font-semibold text-[21px] vm:text-[22px]" style={{ color: "var(--color-accent-700)" }}>
                    {money(line.qty * line.unitPrice, lang)}
                  </span>
                </div>
              </div>
              <button onClick={() => remove(line.key)} aria-label="remove" className="bg-transparent border-none cursor-pointer p-1 text-[20px] leading-none self-start" style={{ color: "var(--color-neutral-600)" }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {count > 0 && (
          <aside className="card p-4.5 vm:p-6 gap-3 vd:sticky vd:top-[110px]">
            <div className="flex justify-between text-[17px]"><span>{t.items}</span><span>{count}</span></div>
            <div className="hr my-1.5" />
            <div className="flex justify-between font-[var(--font-heading)] font-semibold text-[22px] vm:text-[26px]">
              <span>{t.total}</span><span style={{ color: "var(--color-accent-700)" }}>{money(total, lang)}</span>
            </div>
            <Link href="/checkout/customer" className="btn btn-primary justify-center text-[18px] vm:text-[19px] py-3.5 px-5 mt-2.5 no-underline">
              {t.checkout}
            </Link>
          </aside>
        )}
      </div>
    </section>
  );
}
