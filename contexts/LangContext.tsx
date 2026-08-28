"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dirFor, type Lang } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  langChosen: boolean;
  hydrated: boolean;
  chooseLang: (lang: Lang) => void;
  reopenGate: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_LANG = "va_lang";
const STORAGE_CHOSEN = "va_lang_chosen";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("he");
  const [langChosen, setLangChosen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(STORAGE_LANG) as Lang | null;
      const storedChosen = localStorage.getItem(STORAGE_CHOSEN) === "1";
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (storedLang === "he" || storedLang === "en" || storedLang === "fr") setLang(storedLang);
      setLangChosen(storedChosen);
    } catch {
      // ignore (private browsing etc.)
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dirFor(lang);
  }, [lang, hydrated]);

  const chooseLang = (next: Lang) => {
    setLang(next);
    setLangChosen(true);
    try {
      localStorage.setItem(STORAGE_LANG, next);
      localStorage.setItem(STORAGE_CHOSEN, "1");
    } catch {
      // ignore
    }
  };

  const reopenGate = () => setLangChosen(false);

  const value = useMemo<LangContextValue>(
    () => ({ lang, dir: dirFor(lang), langChosen, hydrated, chooseLang, reopenGate }),
    [lang, langChosen, hydrated]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
