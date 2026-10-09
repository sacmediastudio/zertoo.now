"use client";

import { useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { hoursStatusColor, listingLabels, SOFT_SHADOW } from "@/lib/eats-ui";
import type { Listing } from "@/lib/eats-api";

const PER_PAGE = 4;

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
}

// Grilla 2x2 de Destacados — se avanza de página a mano (swipe), sin auto-avance.
export default function FeaturedGrid({ businesses, onPress }: { businesses: Listing[]; onPress: (slug: string) => void }) {
  const { lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const pages = chunk(businesses, PER_PAGE);
  if (pages.length === 0) return null;

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setIndex(Math.max(0, Math.min(Math.round(el.scrollLeft / el.clientWidth), pages.length - 1)));
  }

  return (
    <div>
      <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
        {pages.map((page, pi) => (
          <div key={pi} className="grid w-full shrink-0 snap-start grid-cols-2 content-start gap-3">
            {page.map((tenant) => {
              const labels = listingLabels(tenant, lang);
              const hoursColor = hoursStatusColor(tenant.hoursStatus);
              return (
                <button
                  key={tenant.id}
                  type="button"
                  onClick={() => onPress(tenant.slug)}
                  className={`overflow-hidden rounded-[20px] bg-white text-left ${SOFT_SHADOW}`}
                >
                  <div className="relative aspect-square w-full">
                    {tenant.heroImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tenant.heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-graphite text-3xl font-bold text-white">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {tenant.promoKind && (
                      <span
                        className={`absolute right-2 top-2 rounded-full px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.3px] text-white ${
                          tenant.promoKind === "SPECIAL" ? "bg-eats-special" : "bg-eats-promo"
                        }`}
                      >
                        {tenant.promoKind === "SPECIAL" ? "Special" : "Promo"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-2.5">
                    <p className="truncate text-[13px] font-bold text-graphite">{tenant.name}</p>
                    <div className="flex flex-wrap items-center gap-x-1.5">
                      {labels.category && <span className="truncate text-[11px] text-graphite/60">{labels.category}</span>}
                      {labels.secondary && <span className="truncate text-[11px] text-graphite/60">{labels.secondary}</span>}
                      {tenant.avgRating !== null && (
                        <span className="text-[11px] font-bold text-graphite">★ {tenant.avgRating.toFixed(1)}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1">
                      <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: hoursColor }} />
                      <span className="truncate text-[10px] font-bold" style={{ color: hoursColor }}>
                        {labels.hours}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="mt-1 flex justify-center gap-[5px]">
          {pages.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full ${i === index ? "w-4 bg-graphite" : "w-1.5 bg-graphite/10"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
