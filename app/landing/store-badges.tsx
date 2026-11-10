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
        {/* El PNG oficial de Google trae margen transparente propio — los márgenes negativos lo compensan para que se vea del mismo alto que el de Apple. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/google-play-${suffix}.png`}
          alt={t.landing.storeBadges.playStoreAlt}
          className="-my-2 h-[62px] w-auto select-none"
          draggable={false}
        />
      </a>
    </div>
  );
}
