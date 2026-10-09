"use client";

import type { Reel } from "@/lib/eats-api";

// Carrusel de reels: 3 miniaturas verticales (9:16) a la vez, se desliza
// para ver el resto; tocar una abre el visor — igual que la app nativa.
export default function ReelsCarousel({ reels, onPress }: { reels: Reel[]; onPress: (index: number) => void }) {
  if (reels.length === 0) return null;
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5">
      {reels.map((reel, i) => (
        <button
          key={reel.id}
          type="button"
          onClick={() => onPress(i)}
          className="relative aspect-[9/16] w-[calc((100%-20px)/3)] shrink-0 snap-start overflow-hidden rounded-[14px] bg-graphite text-left active:opacity-85"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={reel.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/45 pl-px text-[9px] text-white">
            ▶
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-black/40 p-2">
            {reel.business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={reel.business.logoUrl} alt="" className="h-[22px] w-[22px] rounded-full border border-white object-cover" />
            ) : (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-lime text-[10px] font-extrabold text-graphite">
                {reel.business.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="line-clamp-2 text-[11px] font-bold leading-[13px] text-white">{reel.business.name}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
