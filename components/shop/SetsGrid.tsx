"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { T, money, pickField } from "@/lib/i18n";

interface SetRow {
  id: string;
  nameHe: string; nameEn: string; nameFr: string;
  descHe: string; descEn: string; descFr: string;
  price: number;
}

export default function SetsGrid({ sets, coverImage }: { sets: SetRow[]; coverImage: string }) {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <Link href="/" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
        {t.back}
      </Link>
      <h3 className="text-[30px] vm:text-[40px] mb-1.5">{t.setsTitle}</h3>
      <p className="text-[16px] opacity-60 mb-6 vm:mb-[30px]">{t.setsNote}</p>
      <div className="grid grid-cols-1 vd:grid-cols-3 gap-4 vm:gap-7">
        {sets.map((s) => (
          <Link key={s.id} href={`/sets/${s.id}`} className="card elev-sm p-0 overflow-hidden cursor-pointer no-underline" style={{ color: "var(--color-text)" }}>
            <div
              className="w-full h-[190px] vm:h-[230px] bg-cover bg-center"
              style={{ backgroundImage: `url('/${coverImage}')`, backgroundColor: "var(--color-accent-100)" }}
            />
            <div className="py-[18px] px-4 vm:py-[22px] vm:px-[22px] pb-5 vm:pb-[26px]">
              <div className="font-[var(--font-heading)] text-[30px] vm:text-[31px] font-semibold leading-[1.2]">{pickField(s, "name", lang)}</div>
              <p className="my-2.5 mb-3.5 text-[17px] leading-[1.65] opacity-90" style={{ textWrap: "pretty" }}>{pickField(s, "desc", lang)}</p>
              <div className="font-[var(--font-heading)] font-semibold text-[24px] vm:text-[25px]" style={{ color: "var(--color-accent-700)" }}>
                {money(s.price, lang)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
