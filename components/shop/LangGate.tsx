"use client";

import { useLang } from "@/contexts/LangContext";
import FlagIcon from "./FlagIcon";

export default function LangGate() {
  const { langChosen, hydrated, chooseLang } = useLang();
  if (!hydrated || langChosen) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-6 text-center max-w-[420px]">
        <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[92px] vm:h-[150px] w-auto" />
        <div
          className="font-[var(--font-body)] text-[24px] vm:text-[26px] font-medium leading-[1.5] vm:leading-[1.6]"
          style={{ color: "var(--brand-green)" }}
        >
          בחרו שפה
          <div className="text-[20px] vm:text-[21px]" style={{ color: "var(--color-text)" }}>
            Choose a language
          </div>
          <div className="text-[20px] vm:text-[21px]" style={{ color: "var(--color-text)" }}>
            Choisir une langue
          </div>
        </div>
        <div className="flex flex-col vm:flex-row gap-3.5 w-full max-w-[260px] vm:max-w-none justify-center">
          <button onClick={() => chooseLang("he")} className="btn btn-primary justify-center gap-3 text-[20px] vm:text-[21px] font-[var(--font-body)] font-medium py-4 px-[18px] vm:px-[30px]">
            <FlagIcon lang="he" />
            עברית
          </button>
          <button onClick={() => chooseLang("en")} className="btn btn-secondary justify-center gap-3 text-[20px] vm:text-[21px] font-[var(--font-body)] font-medium py-4 px-[18px] vm:px-[30px]">
            <FlagIcon lang="en" />
            English
          </button>
          <button onClick={() => chooseLang("fr")} className="btn btn-secondary justify-center gap-3 text-[20px] vm:text-[21px] font-[var(--font-body)] font-medium py-4 px-[18px] vm:px-[30px]">
            <FlagIcon lang="fr" />
            Français
          </button>
        </div>
      </div>
    </div>
  );
}
