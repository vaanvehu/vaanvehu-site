"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { T, money, pickField } from "@/lib/i18n";
import { setLineKey } from "@/lib/cart-keys";
import PitamDialog, { pitamExtrasText } from "./PitamDialog";

interface SetUpgradeRow { id: string; key: string; nameHe: string; nameEn: string; nameFr: string; price: number }
interface SetRow {
  id: string; image: string;
  nameHe: string; nameEn: string; nameFr: string;
  descHe: string; descEn: string; descFr: string;
  includesHe: string[]; includesEn: string[]; includesFr: string[];
  price: number; upgrades: SetUpgradeRow[];
}

export default function SetDetail({ set, coverImage }: { set: SetRow; coverImage: string }) {
  const { lang } = useLang();
  const { addOrInc, count, total } = useCart();
  const t = T[lang];
  const [dialogOpen, setDialogOpen] = useState(false);

  const name = pickField(set, "name", lang);
  const desc = pickField(set, "desc", lang);
  const includes = lang === "he" ? set.includesHe : lang === "en" ? set.includesEn : set.includesFr;
  const upgrades = set.upgrades.map((u) => ({ id: u.key, name: pickField(u, "name", lang), price: u.price }));

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-16 vm:pb-20">
      <Link href="/sets" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
        {t.allSets}
      </Link>
      <div className="grid grid-cols-1 vd:grid-cols-2 gap-6 vd:gap-14 items-start">
        <div
          className="w-full aspect-[4/3] rounded-[var(--radius-md)] bg-cover bg-center"
          style={{ backgroundImage: `url('/${coverImage}')`, backgroundColor: "var(--color-accent-100)", boxShadow: "var(--shadow-sm)" }}
        />
        <div>
          <div className="font-[var(--font-heading)] text-[32px] vd:text-[44px] font-semibold leading-[1.1] mb-2.5">{name}</div>
          <p className="text-[18px] vd:text-[19px] leading-[1.7] opacity-90 mb-3.5" style={{ textWrap: "pretty" }}>{desc}</p>
          <div className="font-[var(--font-heading)] font-semibold text-[26px] vd:text-[30px] mb-5.5" style={{ color: "var(--color-accent-700)" }}>
            {money(set.price, lang)}
          </div>
          <div className="hr" />
          <div className="font-[var(--font-heading)] text-[22px] vd:text-[26px] font-semibold mt-5.5 mb-2.5">{t.included}</div>
          <ul className="mb-7 ps-5.5 text-[17px] vd:text-[18px] leading-[1.9] vd:leading-[2] list-disc">
            {includes.map((inc, i) => <li key={i}>{inc}</li>)}
          </ul>
          <div className="flex items-center gap-4.5 flex-wrap">
            <button onClick={() => setDialogOpen(true)} className="btn btn-primary text-[19px] vd:text-[20px] py-4 px-6 vd:px-7">
              {t.addSet}
            </button>
            {count > 0 && (
              <Link href="/cart" className="btn btn-secondary text-[17px] vd:text-[18px] py-4 px-6 no-underline">
                {t.toPayment} · {money(total, lang)}
              </Link>
            )}
          </div>
        </div>
      </div>

      {dialogOpen && (
        <PitamDialog
          itemName={name}
          pitamAsk={true}
          upgrades={upgrades}
          basePrice={set.price}
          onClose={() => setDialogOpen(false)}
          onConfirm={({ pitamChoice, note, upgradeIds }) => {
            const chosen = set.upgrades.filter((u) => upgradeIds.includes(u.key));
            const unitPrice = set.price + chosen.reduce((a, u) => a + u.price, 0);
            const extrasParts = [pitamExtrasText(lang, pitamChoice, note)];
            const upgradeNames = chosen.map((u) => pickField(u, "name", lang));
            const extrasText = [...upgradeNames, ...extrasParts.filter(Boolean)].join(" · ");
            addOrInc({
              key: setLineKey(set.id, upgradeIds, pitamChoice, note),
              kind: "set",
              name,
              image: set.image,
              unitPrice,
              extrasText,
              pitamChoice,
              note,
            });
            setDialogOpen(false);
          }}
        />
      )}
    </section>
  );
}
