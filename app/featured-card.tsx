"use client";

import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";
import type { BusinessCardData } from "./business-card";

// Card vertical para la grilla de "Destacados" — mismo tratamiento que
// FeaturedGrid.tsx en la app móvil (foto de portada cuadrada, 2
// columnas). A diferencia de esa versión, acá no mostramos el badge de
// promo/special ni el punto de horario porque esta web consulta la
// base de datos directo (lib/db.ts) y no trae esos datos — se puede
// sumar más adelante si hace falta paridad total.
export default function FeaturedCard({ tenant }: { tenant: BusinessCardData }) {
  const { lang } = useLang();

  return (
    <Link
      href={`/${tenant.slug}`}
      className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] overflow-hidden hover:brightness-[0.98] transition-[filter]"
    >
      <div className="relative aspect-square bg-graphite">
        {tenant.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.heroImageUrl} alt={tenant.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
            {tenant.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="font-semibold text-graphite text-sm truncate">{tenant.name}</p>
        <div className="flex items-center gap-2 text-xs text-graphite/60 flex-wrap">
          {tenant.nowCategory && (
            <span className="truncate">{CATEGORY_LABELS[lang][tenant.nowCategory] ?? tenant.nowCategory}</span>
          )}
          {tenant.avgRating !== null && <span className="font-semibold text-graphite shrink-0">★ {tenant.avgRating.toFixed(1)}</span>}
        </div>
      </div>
    </Link>
  );
}
