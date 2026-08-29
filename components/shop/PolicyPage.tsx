import type { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/shop/Footer";

// Shared layout for the four static legal/info pages (accessibility, terms,
// privacy, cancellations). These are content pages, not part of the buy
// flow, so — like the footer links that lead to them — they're Hebrew-only
// regardless of the storefront's active language (see Footer.tsx).

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-7 vm:mb-9">
      <h2 className="font-[var(--font-heading)] text-[20px] vm:text-[23px] mb-2.5 vm:mb-3" style={{ color: "var(--brand-green)" }}>
        {title}
      </h2>
      <div className="text-[16px] vm:text-[17px] leading-[1.85] text-right" style={{ color: "var(--color-text)" }}>
        {children}
      </div>
    </section>
  );
}

export default function PolicyPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <div dir="rtl" className="max-w-[820px] mx-auto px-5 vm:px-10 pt-9 vm:pt-14 pb-9 vm:pb-16">
        <Link href="/" className="text-[15px] inline-block mb-6" style={{ color: "var(--color-accent-700)" }}>
          ← חזרה לדף הבית
        </Link>
        <h1 className="font-[var(--font-heading)] text-[28px] vm:text-[36px] mb-1.5" style={{ color: "var(--color-text)" }}>
          {title}
        </h1>
        <p className="text-[14px] mb-8 vm:mb-10" style={{ color: "var(--color-text)", opacity: 0.6 }}>
          עודכן לאחרונה: {updated}
        </p>
        {children}
      </div>
      <Footer />
    </>
  );
}
