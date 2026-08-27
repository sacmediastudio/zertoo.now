"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NearMeButton({ active }: { active: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (active) {
      // Ya está activo — un segundo clic lo apaga (vuelve al orden normal).
      const params = new URLSearchParams(searchParams.toString());
      params.delete("lat");
      params.delete("lng");
      router.push(params.toString() ? `/?${params.toString()}` : "/");
      return;
    }

    if (!navigator.geolocation) {
      setError("Tu navegador no permite compartir ubicación.");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", String(position.coords.latitude));
        params.set("lng", String(position.coords.longitude));
        router.push(`/?${params.toString()}`);
        setLoading(false);
      },
      () => {
        setError("No pudimos acceder a tu ubicación — revisá el permiso en tu navegador.");
        setLoading(false);
      },
      { timeout: 10_000 }
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-60 ${
          active ? "bg-lime text-graphite" : "bg-white text-graphite/70 hover:bg-graphite/5"
        }`}
      >
        📍 {loading ? "Buscando tu ubicación..." : active ? "Cerca de mí ✓" : "Cerca de mí"}
      </button>
      {error && <p className="text-[11px] text-red-600 px-1">{error}</p>}
    </div>
  );
}
