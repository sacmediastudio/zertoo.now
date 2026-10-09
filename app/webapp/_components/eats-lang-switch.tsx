"use client";

import { useLang } from "@/lib/lang-context";

// Chip "vidrio" con el idioma al que se cambia (EN/ES) — igual que la app nativa.
export default function EatsLangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="rounded-full border border-white/50 bg-white/40 px-2.5 py-1 text-xs font-bold text-graphite backdrop-blur-md"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
