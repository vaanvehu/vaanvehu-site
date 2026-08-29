"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { T } from "@/lib/i18n";
import FlagIcon from "./FlagIcon";

export default function Header() {
  const { lang, chooseLang, reopenGate } = useLang();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = T[lang];

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)" }}>
      {/* ── desktop / tablet header (>=720px) ───────────────────────────── */}
      <div className="hidden vm:flex items-center justify-between gap-8 max-w-[1240px] mx-auto px-10 py-3.5">
        <Link href="/" className="flex items-center">
          <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[54px] w-auto block" />
        </Link>
        <nav className="flex items-center gap-7 text-[19px]">
          <Link href="/" style={{ color: "var(--color-text)" }} className="hover:!text-[var(--color-accent-700)]">{t.navHome}</Link>
          <Link href="/sets" style={{ color: "var(--color-text)" }} className="hover:!text-[var(--color-accent-700)]">{t.navSets}</Link>
          <Link href="/build" style={{ color: "var(--color-text)" }} className="hover:!text-[var(--color-accent-700)]">{t.navBuild}</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-2 me-2">
            {(["he", "en", "fr"] as const).map((l) => (
              <button
                key={l}
                onClick={() => chooseLang(l)}
                aria-label={l}
                className={`btn ${lang === l ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "7px 10px", lineHeight: 0 }}
              >
                <FlagIcon lang={l} />
              </button>
            ))}
          </div>
          <Link href="/cart" className="btn btn-secondary text-[17px] py-[11px] px-[18px] flex items-center gap-2.5">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h3l2.6 12.2a1.6 1.6 0 001.6 1.3h9.1a1.6 1.6 0 001.6-1.3L21.5 7H6" />
            </svg>
            {t.cartNav} ({count})
          </Link>
        </div>
      </div>

      {/* ── mobile header (<720px) ──────────────────────────────────────── */}
      <div className="flex vm:hidden items-center justify-between px-4 py-3.5">
        <button onClick={() => setMenuOpen(true)} aria-label="menu" className="p-1.5 bg-transparent border-none" style={{ color: "var(--color-text)" }}>
          <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="2" fill="currentColor" /><rect y="7" width="22" height="2" fill="currentColor" /><rect y="14" width="22" height="2" fill="currentColor" /></svg>
        </button>
        <div className="flex items-center gap-2.5">
          <Link href="/"><img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[34px] w-auto" /></Link>
          <button onClick={reopenGate} aria-label="lang" className="p-0.5 bg-transparent border-none leading-none">
            <FlagIcon lang={lang} size={26} bordered />
          </button>
        </div>
        <Link href="/cart" aria-label="cart" className="relative p-1.5" style={{ color: "var(--color-text)" }}>
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none"><path d="M1 2h3l2.5 13h13L22 6H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="19" r="1.6" fill="currentColor" /><circle cx="18" cy="19" r="1.6" fill="currentColor" /></svg>
          {count > 0 && (
            <span className="absolute -top-1 -start-1.5 text-white text-[10px] leading-none py-0.5 px-[5px] rounded-full" style={{ background: "var(--color-accent-700)" }}>
              {count}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-80 vm:hidden" style={{ background: "color-mix(in srgb, var(--color-neutral-900) 45%, transparent)" }} onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 bottom-0 end-0 w-[78%] max-w-[300px] z-81 flex flex-col gap-4.5 py-[70px] px-[22px] box-border vm:hidden" style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-lg)" }}>
            <div className="font-[var(--font-heading)] text-[22px] font-semibold">וְאַנְוֵהוּ</div>
            <div className="h-px" style={{ background: "var(--color-divider)" }} />
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-[16px]" style={{ color: "var(--color-text)" }}>{t.menuHome}</Link>
            <Link href="/sets" onClick={() => setMenuOpen(false)} className="text-[16px]" style={{ color: "var(--color-text)" }}>{t.menuSets}</Link>
            <Link href="/build" onClick={() => setMenuOpen(false)} className="text-[16px]" style={{ color: "var(--color-text)" }}>{t.menuBuild}</Link>
            <div className="h-px" style={{ background: "var(--color-divider)" }} />
            <Link href="/accessibility" onClick={() => setMenuOpen(false)} className="text-[15px] opacity-75" style={{ color: "var(--color-text)" }}>{t.accessibility}</Link>
            <Link href="/terms" onClick={() => setMenuOpen(false)} className="text-[15px] opacity-75" style={{ color: "var(--color-text)" }}>{t.terms}</Link>
            <Link href="/privacy" onClick={() => setMenuOpen(false)} className="text-[15px] opacity-75" style={{ color: "var(--color-text)" }}>{t.privacy}</Link>
            <Link href="/cancellations" onClick={() => setMenuOpen(false)} className="text-[15px] opacity-75" style={{ color: "var(--color-text)" }}>{t.cancellations}</Link>
            <div className="h-px" style={{ background: "var(--color-divider)" }} />
            <Link href="/admin" className="text-[15px] font-[var(--font-heading)]" style={{ color: "var(--color-accent-700)" }}>{t.adminLink}</Link>
          </div>
        </>
      )}
    </header>
  );
}
