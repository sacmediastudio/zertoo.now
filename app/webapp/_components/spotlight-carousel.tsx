"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { listingLabels } from "@/lib/eats-ui";
import type { Listing } from "@/lib/eats-api";

const AUTO_ADVANCE_MS = 6000;

// Carrusel de portada con avance automático cada 6s — igual que la app nativa.
export default function SpotlightCarousel({ businesses, onPress }: { businesses: Listing[]; onPress: (slug: string) => void }) {
  const { lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    if (businesses.length < 2) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const next = (indexRef.current + 1) % businesses.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [businesses.length]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setIndex(Math.max(0, Math.min(Math.round(el.scrollLeft / el.clientWidth), businesses.length - 1)));
  }

  if (businesses.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[20px]">
        {businesses.map((item) => {
          const labels = listingLabels(item, lang);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPress(item.slug)}
              className="relative h-[190px] w-full shrink-0 snap-start overflow-hidden rounded-[20px] bg-graphite text-left"
            >
              {item.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[40px] font-bold text-white">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
              {item.avgRating !== null && (
                <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-black/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                  ★ {item.avgRating.toFixed(1)}
                </span>
              )}
              {item.promoKind && (
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.3px] text-white ${
                    item.promoKind === "SPECIAL" ? "bg-eats-special" : "bg-eats-promo"
                  }`}
                >
                  {item.promoKind === "SPECIAL" ? "Special" : "Promo"}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/20 p-3.5 pt-4 backdrop-blur-md">
                <p className="truncate text-[17px] font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">{item.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  {labels.category && (
                    <span className="truncate rounded-full bg-white/30 px-2 py-0.5 text-[11px] font-semibold text-white">{labels.category}</span>
                  )}
                  {labels.secondary && (
                    <span className="truncate rounded-full bg-white/30 px-2 py-0.5 text-[11px] font-semibold text-white">{labels.secondary}</span>
                  )}
                  {item.address && (
                    <span className="min-w-0 truncate text-xs text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">{item.address}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {businesses.length > 1 && (
        <div className="flex justify-center gap-[5px]">
          {businesses.map((b, i) => (
            <span key={b.id} className={`h-1.5 rounded-full ${i === index ? "w-4 bg-graphite" : "w-1.5 bg-graphite/10"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
