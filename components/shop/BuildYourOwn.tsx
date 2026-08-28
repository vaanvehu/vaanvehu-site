"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { T, money, pickField, type Lang } from "@/lib/i18n";
import { etrogGradePrefix, etrogLineKey, flatLineKey } from "@/lib/cart-keys";
import PitamDialog, { pitamExtrasText } from "./PitamDialog";

interface EtrogTypeRow { id: string; image: string; pitamAsk: boolean; nameHe: string; nameEn: string; nameFr: string }
interface GradeRow { id: string; price: number; nameHe: string; nameEn: string; nameFr: string }
interface FlatRow { id: string; key: string; image: string | null; price: number; nameHe: string; nameEn: string; nameFr: string }

const CATEGORIES: { id: "etrog" | "lulav" | "hadas" | "arava"; labelKey: string }[] = [
  { id: "etrog", labelKey: "אתרוגים" },
  { id: "lulav", labelKey: "לולבים" },
  { id: "hadas", labelKey: "הדסים" },
  { id: "arava", labelKey: "ערבות ותוספות" },
];
const CATEGORY_LABEL: Record<string, Record<Lang, string>> = {
  etrog: { he: "אתרוגים", en: "Etrogim", fr: "Etrogim" },
  lulav: { he: "לולבים", en: "Lulavim", fr: "Lulavim" },
  hadas: { he: "הדסים", en: "Hadassim", fr: "Hadassim" },
  arava: { he: "ערבות ותוספות", en: "Aravot & Accessories", fr: "Aravot & accessoires" },
};

function BuildTabs({
  cols, category, lang, onSelect,
}: { cols: string; category: "etrog" | "lulav" | "hadas" | "arava"; lang: Lang; onSelect: (id: "etrog" | "lulav" | "hadas" | "arava") => void }) {
  return (
    <div className={`grid ${cols} gap-2.5 vd:gap-0 vd:flex vd:flex-col`}>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`btn ${category === c.id ? "btn-primary" : "btn-secondary"} justify-center vd:justify-start text-center vd:text-start font-[var(--font-heading)] text-[20px] vd:text-[22px] leading-[1.15] py-3.5 px-2.5 vd:py-3.5 vd:px-4.5`}
        >
          {CATEGORY_LABEL[c.id][lang]}
        </button>
      ))}
    </div>
  );
}

function BuildCartTotalCard({ lang, total, label }: { lang: Lang; total: number; label: string }) {
  return (
    <div className="card mt-3.5 p-4 gap-1" style={{ background: "color-mix(in srgb, var(--color-accent-100) 70%, var(--color-bg))", borderColor: "var(--color-accent-300)" }}>
      <span className="text-[15px] opacity-75">{T[lang].cartTotalLabel}</span>
      <span className="font-[var(--font-heading)] font-semibold text-[22px] vd:text-[24px]">{money(total, lang)}</span>
      <Link href="/cart" className="btn btn-primary justify-center text-[16px] py-2.5 px-3.5 mt-2 no-underline">{label}</Link>
    </div>
  );
}

export default function BuildYourOwn({
  etrogTypes, grades, lulavim, hadasim, arava,
}: {
  etrogTypes: EtrogTypeRow[]; grades: GradeRow[]; lulavim: FlatRow[]; hadasim: FlatRow[]; arava: FlatRow[];
}) {
  const { lang } = useLang();
  const { total } = useCart();
  const t = T[lang];
  const [category, setCategory] = useState<"etrog" | "lulav" | "hadas" | "arava">("etrog");
  const [etrogTypeId, setEtrogTypeId] = useState<string | null>(null);

  const flatSource = category === "lulav" ? lulavim : category === "hadas" ? hadasim : category === "arava" ? arava : [];
  const selectCategory = (id: "etrog" | "lulav" | "hadas" | "arava") => { setCategory(id); setEtrogTypeId(null); };

  const content = (
    <>
      {category === "etrog" ? (
        <EtrogSection etrogTypes={etrogTypes} grades={grades} etrogTypeId={etrogTypeId} setEtrogTypeId={setEtrogTypeId} />
      ) : (
        <FlatGrid products={flatSource} category={category} />
      )}
    </>
  );

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-6 vm:pt-[34px] pb-[140px] vd:pb-20">
      <Link href="/" className="btn btn-secondary text-[19px] py-2 px-5 inline-flex items-center gap-2.5 mb-4.5 no-underline">
        {t.back}
      </Link>
      <h3 className="text-[26px] vm:text-[40px] mb-3.5 vd:mb-6.5">{t.buildTitle}</h3>

      {/* desktop: sidebar layout */}
      <div className="hidden vd:grid grid-cols-[250px_1fr] gap-11 items-start">
        <aside className="flex flex-col gap-2.5 sticky top-[110px]">
          <BuildTabs cols="grid-cols-1" category={category} lang={lang} onSelect={selectCategory} />
          <BuildCartTotalCard lang={lang} total={total} label={t.toPayment} />
        </aside>
        <div>{content}</div>
      </div>

      {/* tablet/mobile: top tabs + sticky bottom bar */}
      <div className="vd:hidden">
        <div className="mb-5">
          <BuildTabs cols="grid-cols-2" category={category} lang={lang} onSelect={selectCategory} />
        </div>
        {content}
        <div
          className="fixed bottom-[80px] left-3 right-3 rounded-[var(--radius-md)] py-3.5 px-4 flex items-center justify-between gap-3 z-20"
          style={{ background: "color-mix(in srgb, var(--color-accent-100) 82%, var(--color-bg))", border: "1px solid var(--color-accent-300)" }}
        >
          <div className="flex flex-col">
            <span className="text-[14px] opacity-70">{t.cartTotalLabel}</span>
            <span className="font-[var(--font-heading)] font-semibold text-[20px]">{money(total, lang)}</span>
          </div>
          <Link href="/cart" className="btn btn-primary justify-center text-[16px] py-3 px-4.5 no-underline">{t.toPayment}</Link>
        </div>
      </div>
    </section>
  );
}

function EtrogSection({
  etrogTypes, grades, etrogTypeId, setEtrogTypeId,
}: { etrogTypes: EtrogTypeRow[]; grades: GradeRow[]; etrogTypeId: string | null; setEtrogTypeId: (id: string | null) => void }) {
  const { lang } = useLang();
  const { addOrInc, qtyForPrefix } = useCart();
  const t = T[lang];
  const [dialogFor, setDialogFor] = useState<GradeRow | null>(null);
  const selType = etrogTypes.find((e) => e.id === etrogTypeId) ?? null;

  if (!selType) {
    return (
      <div className="grid grid-cols-2 vd:grid-cols-4 gap-2.5 vd:gap-4.5">
        {etrogTypes.map((et) => (
          <div key={et.id} onClick={() => setEtrogTypeId(et.id)} className="card p-3 vd:p-3.5 gap-2.5 vd:gap-3 cursor-pointer">
            <div className="plate m-0" style={{ background: "#fff" }}>
              <div className="w-full h-[172px] vd:h-[186px] bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('/${et.image}')` }} />
            </div>
            <div className="card-title text-[23px] vd:text-[26px] text-center">{pickField(et, "name", lang)}</div>
          </div>
        ))}
      </div>
    );
  }

  const typeName = pickField(selType, "name", lang);

  return (
    <div className="grid grid-cols-1 vd:grid-cols-[280px_1fr] gap-4.5 vd:gap-9 items-start">
      <div className="flex flex-col items-center gap-2.5 mb-1 vd:mb-0">
        <div className="card w-full max-w-[230px] vd:max-w-none p-3 vd:p-3.5" style={{ boxShadow: "0 0 0 2px var(--color-accent)" }}>
          <div className="plate m-0" style={{ background: "#fff" }}>
            <div className="w-full h-[170px] vd:h-[200px] bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url('/${selType.image}')` }} />
          </div>
          <div className="card-title text-[24px] vd:text-[26px] text-center">{typeName}</div>
        </div>
        <button onClick={() => setEtrogTypeId(null)} className="text-[15px] vd:text-[16px] bg-transparent border-none cursor-pointer" style={{ color: "var(--color-accent-700)" }}>
          {t.changeEtrog}
        </button>
      </div>
      <div>
        <h6 className="mb-2.5 vd:mb-3.5 text-[18px] vd:text-[20px]">{t.levels} – {typeName}</h6>
        <div className="flex flex-col gap-2.5">
          {grades.map((lv) => {
            const qty = qtyForPrefix(etrogGradePrefix(selType.id, lv.id));
            return (
              <div key={lv.id} className="card flex-row items-center justify-between py-3.5 px-4.5 vd:py-5 vd:px-[22px]">
                <div>
                  <div className="font-[var(--font-heading)] text-[23px] vd:text-[26px]">{pickField(lv, "name", lang)}</div>
                  <div className="font-[var(--font-heading)] text-[19px] vd:text-[22px]" style={{ color: "var(--color-accent-700)" }}>{money(lv.price, lang)}</div>
                </div>
                <div className="flex items-center gap-2.5 vd:gap-3">
                  {qty > 0 && <span className="font-[var(--font-heading)] text-[16px] vd:text-[17px] opacity-70">×{qty}</span>}
                  <button onClick={() => setDialogFor(lv)} className="btn btn-primary text-[16px] vd:text-[17px] py-3 px-4.5 vd:px-5.5">{t.add}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {dialogFor && (
        <PitamDialog
          itemName={`${typeName} – ${pickField(dialogFor, "name", lang)}`}
          pitamAsk={selType.pitamAsk}
          onClose={() => setDialogFor(null)}
          onConfirm={({ pitamChoice, note }) => {
            const extrasText = pitamExtrasText(lang, pitamChoice, note);
            const name =
              lang === "en" ? `${pickField(selType, "name", lang)} Etrog – ${pickField(dialogFor, "name", lang)} Grade` :
              lang === "fr" ? `Etrog ${pickField(selType, "name", lang)} – qualité ${pickField(dialogFor, "name", lang)}` :
              `אתרוג ${selType.nameHe} – ${dialogFor.nameHe}`;
            addOrInc({
              key: etrogLineKey(selType.id, dialogFor.id, pitamChoice, note),
              kind: "product",
              name,
              image: selType.image,
              unitPrice: dialogFor.price,
              extrasText,
              pitamChoice,
              note,
            });
            setDialogFor(null);
          }}
        />
      )}
    </div>
  );
}

function FlatGrid({ products, category }: { products: FlatRow[]; category: string }) {
  const { lang } = useLang();
  const { addOrInc, qtyFor } = useCart();
  const t = T[lang];
  return (
    <div className="grid grid-cols-2 vd:grid-cols-3 gap-2.5 vd:gap-5">
      {products.map((p) => {
        const key = flatLineKey(category, p.key);
        const qty = qtyFor(key);
        const name = pickField(p, "name", lang);
        return (
          <div key={p.id} className="card p-3 vd:p-4 gap-2.5 vd:gap-3">
            {p.image ? (
              <div className="plate m-0">
                <div className="w-full h-[140px] vd:h-[172px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('/${p.image}')` }} />
              </div>
            ) : null}
            <div className="card-title text-[21px] vd:text-[25px] text-center leading-[1.25]">{name}</div>
            <div className="font-[var(--font-heading)] text-[19px] vd:text-[22px] text-center" style={{ color: "var(--color-accent-700)" }}>{money(p.price, lang)}</div>
            <div className="flex items-center justify-center gap-2.5 vd:gap-3">
              {qty > 0 && <span className="font-[var(--font-heading)] text-[16px] vd:text-[17px] opacity-70">×{qty}</span>}
              <button
                onClick={() => addOrInc({ key, kind: "product", name, image: p.image, unitPrice: p.price, extrasText: "", pitamChoice: null, note: "" })}
                className="btn btn-primary flex-1 justify-center text-[16px] vd:text-[18px] py-3 px-3.5 vd:px-4"
              >
                {t.add}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
