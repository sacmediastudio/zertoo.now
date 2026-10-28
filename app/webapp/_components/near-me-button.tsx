"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import TintIcon from "./tint-icon";

export default function NearMeButton({
  active,
  onActivate,
  onDeactivate,
  overridePress,
}: {
  active: boolean;
  onActivate: (lat: number, lng: number) => void;
  onDeactivate: () => void;
  // En el detalle del negocio este botón solo vuelve al inicio.
  overridePress?: () => void;
}) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePress() {
    if (overridePress) return overridePress();
    if (active) return onDeactivate();
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError(t.nearMe.noGeolocation);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onActivate(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
        setError(t.nearMe.denied);
      }
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handlePress}
        disabled={loading}
        aria-label={loading ? t.nearMe.searching : active ? t.nearMe.activeLabel : t.nearMe.label}
        aria-pressed={active}
        className={`relative flex h-9 w-11 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${
          loading ? "opacity-60" : ""
        } ${active ? "bg-lime text-graphite" : "animate-near-pulse border border-white/50 bg-white/40 text-graphite/60 backdrop-blur-md"}`}
      >
        <TintIcon
          src="/nav/marker.png"
          size={20}
          color={active ? "#002D09" : "rgba(0,45,9,0.6)"}
          className="relative"
        />
      </button>
      {error && <p className="px-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
