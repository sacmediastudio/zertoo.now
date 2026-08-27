"use client";

import { useEffect, useState } from "react";
import { translations, getStoredLang, setStoredLang, type Lang } from "@/lib/i18n";
import { LangContext } from "@/lib/lang-context";

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = getStoredLang();
    setLangState(stored);
    document.documentElement.lang = stored;
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    setStoredLang(l);
    document.documentElement.lang = l;
  }

  return <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>{children}</LangContext.Provider>;
}
