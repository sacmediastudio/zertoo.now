"use client";

import { useLang } from "@/lib/lang-context";

export default function LangSwitch({ dark }: { dark?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex items-center rounded-full border px-0.5 py-0.5 text-[11px] font-bold ${
        dark ? "border-white/30 text-white" : "border-graphite/20 text-graphite"
      }`}
    >
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2 py-0.5 rounded-full transition-colors ${
            lang === l ? (dark ? "bg-white text-graphite" : "bg-graphite text-white") : ""
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
