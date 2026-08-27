"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zertooeats.com";

export default function BusinessActions({
  slug,
  name,
  address,
  latitude,
  longitude,
  googleMapsUrl,
}: {
  slug: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
}) {
  const { t } = useLang();

  // navigator.share no existe en el servidor — se revisa recién
  // montado, para no arriesgar un desajuste entre lo que se renderiza
  // en el servidor y lo que ve el navegador (mismo criterio que usamos
  // para el idioma en el resto de Zertoo).
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareUrl = `${SITE_URL}/${slug}`;
  const shareText = t.actions.shareText(name);

  // Orden de prioridad: 1) el link de Google Maps que el propio
  // negocio cargó a mano (el más preciso, es su pin real) — 2) si no
  // tiene, las coordenadas geocodificadas de su dirección — 3) si
  // tampoco tiene eso, la dirección de texto tal cual. Geocodificar
  // texto acerca a la manzana correcta, pero no siempre a la puerta;
  // el link propio del negocio no tiene ese problema.
  const directionsUrl =
    googleMapsUrl ||
    (latitude !== null && longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
        : null);

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
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-3 rounded-xl bg-graphite text-white hover:brightness-110"
        >
          <span aria-hidden>📍</span>
          {t.actions.directions}
        </a>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-[140px] text-center text-sm font-semibold px-4 py-3 rounded-xl bg-[#25D366] text-white hover:brightness-105"
      >
        {t.actions.shareWhatsapp}
      </a>
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="flex-1 min-w-[140px] text-center text-sm font-semibold px-4 py-3 rounded-xl border border-graphite/15 text-graphite hover:bg-graphite/5"
        >
          {t.actions.share}
        </button>
      )}
    </div>
  );
}
