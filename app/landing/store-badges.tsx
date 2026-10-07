"use client";

import { useLang } from "@/lib/lang-context";

// Badges oficiales de App Store y Google Play (archivos en
// public/badges/, tal como los publican Apple y Google — no se
// modifican). Mientras las apps no estén publicadas se muestran sin
// link y con la etiqueta "Próximamente"; cuando salgan, volver a
// envolver cada badge en <a href> con la ficha real:
//   App Store:   https://apps.apple.com/app/id6814007959
//   Google Play: https://play.google.com/store/apps/details?id=app.zertoo.eats
export default function StoreBadges({ className = "" }: { className?: string }) {
  const { lang, t } = useLang();
  const suffix = lang === "en" ? "en" : "es";

  return (
    <div className={`flex flex-wrap items-start gap-4 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/app-store-${suffix}.svg`}
          alt={t.landing.storeBadges.appStoreAlt}
          className="h-12 w-auto select-none opacity-70"
          draggable={false}
        />
        <span className="rounded-full bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {t.landing.storeBadges.comingSoon}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        {/* El PNG oficial de Google trae margen transparente propio — los márgenes negativos lo compensan para que se vea del mismo alto que el de Apple. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/badges/google-play-${suffix}.png`}
          alt={t.landing.storeBadges.playStoreAlt}
          className="-my-2 h-[62px] w-auto select-none opacity-70"
          draggable={false}
        />
        <span className="rounded-full bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {t.landing.storeBadges.comingSoon}
        </span>
      </div>
    </div>
  );
}
