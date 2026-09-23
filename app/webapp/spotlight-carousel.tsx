"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";
import type { BusinessCardData } from "./business-card";

// Mismo "lapso considerable" que la app móvil — ver SpotlightCarousel.tsx.
const AUTO_ADVANCE_MS = 6000;

// Versión web del carrusel de portada (SpotlightCarousel.tsx en la
// app). Sin el badge de promo/special: esta web consulta la base de
// datos directo (lib/db.ts) y no trae los datos de promociones.
export default function SpotlightCarousel({
  businesses,
  onNavigate,
}: {
  businesses: BusinessCardData[];
  onNavigate: (slug: string) => void;
}) {
  const { lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const scrollSettleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // El auto-avance manda el scroll directo sobre el DOM (lee la
  // posición actual ahí mismo, no de `index` en React) — antes ese
  // efecto dependía de `index` y el handler de scroll TAMBIÉN escribía
  // `index`, así que cada auto-avance se retroalimentaba con su propia
  // corrección de scroll y el carrusel terminaba peleando consigo mismo
  // a mitad de camino. Ahora `index` es de una sola vía: nace del
  // scroll ya asentado (real o por swipe), nunca al revés — solo se usa
  // para pintar los puntos.
  useEffect(() => {
    if (businesses.length < 2) return;
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      const next = (current + 1) % businesses.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [businesses.length]);

  useEffect(() => {
    return () => {
      if (scrollSettleTimeout.current) clearTimeout(scrollSettleTimeout.current);
    };
  }, []);

  // Tanto el auto-avance como un swipe manual disparan varios eventos
  // "scroll" mientras están en tránsito — se espera a que el scroll
  // esté quieto un rato (igual que onMomentumScrollEnd en la app) antes
  // de recalcular qué punto pintar activo.
  function handleScroll() {
    if (scrollSettleTimeout.current) clearTimeout(scrollSettleTimeout.current);
    scrollSettleTimeout.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      const newIndex = Math.round(track.scrollLeft / track.clientWidth);
      setIndex(Math.max(0, Math.min(newIndex, businesses.length - 1)));
    }, 120);
  }

  if (businesses.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl no-scrollbar"
      >
        {businesses.map((item) => {
          const categoryLabel = item.nowCategory ? CATEGORY_LABELS[lang][item.nowCategory] ?? item.nowCategory : "";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.slug)}
              className="relative shrink-0 w-full h-[190px] snap-start overflow-hidden bg-graphite text-left"
            >
              {item.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.heroImageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
              {item.avgRating !== null && (
                <span className="absolute top-3 left-3 bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-[11px] font-bold">
                  ★ {item.avgRating.toFixed(1)}
                </span>
              )}
              <div className="absolute left-0 right-0 bottom-0 bg-black/45 backdrop-blur-sm p-3.5 pt-4">
                <p className="text-white text-[17px] font-bold truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {categoryLabel && (
                    <span className="text-white text-[11px] font-semibold bg-white/30 rounded-full px-2 py-0.5">
                      {categoryLabel}
                    </span>
                  )}
                  {item.address && <span className="text-white text-xs truncate">{item.address}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {businesses.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {businesses.map((b, i) => (
            <div
              key={b.id}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-graphite" : "w-1.5 bg-graphite/15"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
