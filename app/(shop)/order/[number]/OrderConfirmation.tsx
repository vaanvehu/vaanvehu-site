"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { T } from "@/lib/i18n";

export default function OrderConfirmation({ number }: { number: string }) {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section className="max-w-[1240px] mx-auto px-4 vm:px-10 pt-[50px] vm:pt-[70px] pb-20 vm:pb-[110px]">
      <div className="max-w-[620px] mx-auto text-center flex flex-col items-center gap-4.5">
        <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[70px] vm:h-[84px] w-auto" />
        <h3 className="text-[32px] vm:text-[42px]">{t.confirmTitle}</h3>
        <div className="text-[17px] vm:text-[18px] opacity-75">{t.orderNum}</div>
        <div className="font-[var(--font-heading)] text-[26px] vm:text-[30px]" style={{ color: "var(--color-accent-700)" }}>{number}</div>
        <Link href="/" className="btn btn-secondary text-[17px] vm:text-[18px] py-3.5 px-7 mt-2.5 no-underline">
          {t.backHome}
        </Link>
      </div>
    </section>
  );
}
