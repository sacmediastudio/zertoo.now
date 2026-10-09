"use client";

import { useLang } from "@/lib/lang-context";
import { hoursStatusColor, listingLabels, SOFT_SHADOW } from "@/lib/eats-ui";
import type { Listing } from "@/lib/eats-api";

// Fila de negocio de la lista — misma tarjeta que BusinessCard de la app nativa.
export default function BusinessCard({ tenant, onPress }: { tenant: Listing; onPress: () => void }) {
  const { lang } = useLang();
  const labels = listingLabels(tenant, lang);
  const hoursColor = hoursStatusColor(tenant.hoursStatus);

  return (
    <button
      type="button"
      onClick={onPress}
      className={`flex w-full items-center gap-3.5 rounded-[20px] bg-white p-3.5 text-left transition-opacity active:opacity-85 ${SOFT_SHADOW}`}
    >
      {tenant.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tenant.logoUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-graphite text-xl font-bold text-white">
          {tenant.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-graphite">{tenant.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          {labels.category && (
            <span className="rounded-full bg-eats-chip px-2 py-0.5 text-[11px] font-semibold text-graphite/60">{labels.category}</span>
          )}
          {labels.secondary && (
            <span className="rounded-full bg-eats-chip px-2 py-0.5 text-[11px] font-semibold text-graphite/60">{labels.secondary}</span>
          )}
          {tenant.distanceKm !== null && tenant.distanceKm !== undefined && (
            <span className="text-xs font-semibold text-graphite">
              {tenant.distanceKm < 1 ? `${Math.round(tenant.distanceKm * 1000)} m` : `${tenant.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>
        {tenant.address && <p className="mt-1 truncate text-xs text-graphite/50">{tenant.address}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end self-start">
        {tenant.avgRating !== null && <span className="text-[13px] font-bold text-graphite">★ {tenant.avgRating.toFixed(1)}</span>}
        {tenant.promoKind && (
          <span
            className={`mt-2 rounded-full px-[9px] py-[3px] text-[10px] font-bold uppercase tracking-[0.3px] ${
              tenant.promoKind === "SPECIAL" ? "bg-eats-special/[0.12] text-eats-special" : "bg-eats-promo/[0.14] text-eats-promo"
            }`}
          >
            {tenant.promoKind === "SPECIAL" ? "Special" : "Promo"}
          </span>
        )}
        <span className="mt-1.5 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hoursColor }} />
          <span className="text-[10px] font-bold" style={{ color: hoursColor }}>
            {labels.hours}
          </span>
        </span>
      </div>
    </button>
  );
}
