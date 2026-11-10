"use client";

import { useLang } from "@/lib/lang-context";

// Badges oficiales de App Store y Google Play (archivos en
// public/badges/, tal como los publican Apple y Google — no se
// modifican). App Store y Google Play ya están publicadas y enlazadas.
export default function StoreBadges({ className = "" }: { className?: string }) {
  const { lang, t } = useLang();
  const suffix = lang === "en" ? "en" : "es";

  return (
    <div className={`flex flex-wrap items-start gap-4 ${className}`}>
      <a
        href="https://apps.apple.com/app/id6814007959"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/app-store-${suffix}.svg`}
          alt={t.landing.storeBadges.appStoreAlt}
          className="h-12 w-auto select-none"
          draggable={false}
        />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=app.zertoo.eats"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        {/* Los PNG de Google venían con margen transparente distinto en cada idioma (el de inglés mucho mayor), así que a la misma altura el inglés se veía más pequeño. Están recortados al borde del botón, y ahora ambos miden h-12 igual que el de Apple. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/google-play-${suffix}.png`}
          alt={t.landing.storeBadges.playStoreAlt}
          className="h-12 w-auto select-none"
          draggable={false}
        />
      </a>
    </div>
  );
}
