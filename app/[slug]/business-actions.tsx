"use client";

import { useEffect, useState } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://now.zertoo.app";

export default function BusinessActions({
  slug,
  name,
  address,
  latitude,
  longitude,
}: {
  slug: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}) {
  // navigator.share no existe en el servidor — se revisa recién
  // montado, para no arriesgar un desajuste entre lo que se renderiza
  // en el servidor y lo que ve el navegador (mismo criterio que usamos
  // para el idioma en el resto de Zertoo).
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareUrl = `${SITE_URL}/${slug}`;
  const shareText = `Mirá ${name} en Zertoo Now`;

  // Con coordenadas reales (ya geocodificadas) o, si todavía no las
  // tiene, con la dirección de texto tal cual — Google Maps acepta las
  // dos formas igual de bien.
  const directionsUrl =
    latitude !== null && longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
        : null;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;

  async function handleNativeShare() {
    try {
      await navigator.share({ title: name, text: shareText, url: shareUrl });
    } catch {
      // El usuario canceló el share nativo — no es un error real, no hace falta avisar nada.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] text-center text-sm font-semibold px-4 py-3 rounded-xl bg-graphite text-white hover:brightness-110"
        >
          📍 Cómo llegar
        </a>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-[140px] text-center text-sm font-semibold px-4 py-3 rounded-xl bg-[#25D366] text-white hover:brightness-105"
      >
        Compartir por WhatsApp
      </a>
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="flex-1 min-w-[140px] text-center text-sm font-semibold px-4 py-3 rounded-xl border border-graphite/15 text-graphite hover:bg-graphite/5"
        >
          Compartir
        </button>
      )}
    </div>
  );
}
