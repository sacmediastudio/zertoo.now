"use client";

import { useLang } from "@/lib/lang-context";
import TintIcon from "./tint-icon";

// Las 10 etiquetas de "ambiente" — grilla fija de íconos (2 filas de 5),
// igual que la app nativa.
const OPTIONS = [
  { value: "SUNSET", icon: "/nav/sunset.png" },
  { value: "OCEANFRONT", icon: "/nav/ocean-front.png" },
  { value: "ON_THE_BEACH", icon: "/nav/on-the-beach.png" },
  { value: "ROOFTOP", icon: "/nav/rooftop.png" },
  { value: "FEET_IN_THE_WATER", icon: "/nav/feet-in-the-water.png" },
  { value: "CHEFS_TABLE", icon: "/nav/chef-table.png" },
  { value: "PRIVATE_DINING", icon: "/nav/private-dinning.png" },
  { value: "LIVE_MUSIC", icon: "/nav/live-music.png" },
  { value: "LOCAL_EXPERIENCE", icon: "/nav/local.png" },
  { value: "UNDER_THE_STARS", icon: "/nav/under-stars.png" },
] as const;

export default function SecondaryCategoryGrid({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const { t } = useLang();
  return (
    <div className="flex flex-wrap">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value)}
            className="mb-3.5 flex w-1/5 flex-col items-center gap-1.5 px-0.5"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-eats-header ${active ? "border-eats-secondary" : "border-transparent"}`}
            >
              <TintIcon src={opt.icon} size={22} color="#0a2808" />
            </span>
            <span
              className={`line-clamp-2 text-center text-[10px] leading-3 text-eats-secondary ${active ? "font-extrabold" : "font-semibold"}`}
            >
              {t.secondaryCategories[opt.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
