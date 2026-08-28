"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { T, ABOUT } from "@/lib/i18n";
import Footer from "@/components/shop/Footer";

const BANNER_BY_LANG = { he: "banner-he-w.jpg", en: "banner-en-w.jpg", fr: "banner-fr-w.jpg" };
const BUTTONS_BY_LANG = { he: "buttons-he-w.jpg", en: "buttons-en-w.jpg", fr: "buttons-fr-w.jpg" };
const MOBILE_BANNER_BY_LANG = { he: "home-banner-etrog-trim2-w.jpg", en: "en-banner-arba-minim-w.jpg", fr: "fr-banner-arba-minim-w.jpg" };
const ENTRY_CARDS_BY_LANG = { he: "home-entry-cards-w.jpg", en: "en-entry-cards-w.jpg", fr: "fr-entry-cards-w.jpg" };
const MOBILE_HOTSPOTS = {
  he: { sets: { left: "22%", top: "4.5%", width: "56%", height: "42%" }, build: { left: "22%", top: "52.5%", width: "56%", height: "42%" } },
  en: { sets: { left: "23%", top: "4.8%", width: "55%", height: "39%" }, build: { left: "23%", top: "48.4%", width: "55%", height: "37.5%" } },
  fr: { sets: { left: "23%", top: "4.8%", width: "55%", height: "39%" }, build: { left: "23%", top: "48.4%", width: "55%", height: "37.5%" } },
};

export default function HomePage() {
  const { lang } = useLang();
  const t = T[lang];
  const about = ABOUT[lang];
  const anchorRef = useRef<HTMLDivElement>(null);

  const scrollToButtons = () => {
    const el = anchorRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const hotspots = MOBILE_HOTSPOTS[lang];

  return (
    <>
      {/* ══════════ DESKTOP / TABLET (>=720px) ══════════ */}
      <section className="hidden vm:block border-b" style={{ borderColor: "var(--color-divider)" }}>
        <div className="w-full aspect-[4/1] bg-cover bg-center" style={{ backgroundImage: "url('/assets/logo-banner-w.jpg')", backgroundColor: "var(--color-accent-100)" }} />
        <div className="w-full aspect-[4/1] bg-cover bg-center" style={{ backgroundImage: `url('/assets/${BANNER_BY_LANG[lang]}')`, backgroundColor: "var(--color-accent-100)" }} />
        <div onClick={scrollToButtons} className="flex justify-center py-[26px] pb-[30px] cursor-pointer" style={{ background: "var(--color-bg)" }}>
          <svg width="72" height="52" viewBox="0 0 46 34" fill="none" style={{ animation: "vaBounce 1.4s ease-in-out infinite" }}>
            <path d="M6 5l17 10L40 5M6 18l17 10L40 18" stroke="#1c4a34" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div ref={anchorRef} className="relative w-full aspect-[4/1] bg-cover bg-center" style={{ backgroundImage: `url('/assets/${BUTTONS_BY_LANG[lang]}')` }}>
          <Link href="/build" className="absolute cursor-pointer rounded-[10px]" style={{ left: "26.3%", top: "14%", width: "15.6%", height: "85%" }} />
          <Link href="/sets" className="absolute cursor-pointer rounded-[10px]" style={{ left: "58.4%", top: "14%", width: "15.6%", height: "85%" }} />
        </div>
      </section>

      {/* ══════════ MOBILE (<720px) ══════════ */}
      <section className="block vm:hidden">
        <img loading="lazy" src="/assets/hero-square-w.jpg" alt="" className="w-full block" />
        <img loading="lazy" src={`/assets/${MOBILE_BANNER_BY_LANG[lang]}`} alt="" className="w-full block" />
        <div onClick={scrollToButtons} className="flex justify-center py-3.5 pb-5 cursor-pointer">
          <svg width="64" height="46" viewBox="0 0 46 34" fill="none" style={{ animation: "vaBounce 1.4s ease-in-out infinite" }}>
            <path d="M6 5l17 10L40 5M6 18l17 10L40 18" stroke="#0b4a2f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div ref={anchorRef} className="relative w-full">
          <img loading="lazy" src={`/assets/${ENTRY_CARDS_BY_LANG[lang]}`} alt="" className="w-full block" />
          <Link href="/sets" className="absolute cursor-pointer rounded-[16px]" style={{ ...hotspots.sets, position: "absolute" }} />
          <Link href="/build" className="absolute cursor-pointer rounded-[16px]" style={{ ...hotspots.build, position: "absolute" }} />
        </div>
      </section>

      {/* ══════════ kashrut + wide selection (shared) ══════════ */}
      <section className="max-w-[1240px] mx-auto px-4 vm:px-10 py-4 vm:py-16">
        <div className="grid grid-cols-1 vm:grid-cols-2 gap-4 vm:gap-11">
          <img src="/assets/kashrut-block-w.jpg" alt="" className="w-full aspect-square object-contain" />
          <img src="/assets/wide-selection-w.jpg" alt="" className="w-full aspect-square object-contain" />
        </div>
      </section>

      {/* ══════════ about ══════════ */}
      <section className="border-t" style={{ borderColor: "var(--color-divider)" }}>
        <div className="max-w-[880px] mx-auto px-6 vm:px-10 pt-9 vm:pt-14 pb-9 vm:pb-16 text-center">
          <h3 className="text-[30px] vm:text-[38px] mb-3.5 vm:mb-5">{t.who}</h3>
          {about.paras.map((p, i) => (
            <p
              key={i}
              className={`text-[17px] vm:text-[18px] leading-[1.8] vm:leading-[1.85] mb-3.5 vm:mb-4 vd:text-justify ${lang === "he" ? "text-right" : "text-left"}`}
              style={{ textWrap: "pretty" }}
            >
              {p}
            </p>
          ))}
          <p className="font-[var(--font-heading)] text-[22px] vm:text-[26px] leading-[1.6] mt-0" style={{ color: "var(--brand-green)" }}>
            {about.close}
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
