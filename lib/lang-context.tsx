"use client";

import { createContext, useContext } from "react";
import { translations, type Lang } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof translations)["es"];
}

export const LangContext = createContext<LangContextValue>({
  lang: "es",
  setLang: () => {},
  t: translations.es,
});

export function useLang() {
  return useContext(LangContext);
}
