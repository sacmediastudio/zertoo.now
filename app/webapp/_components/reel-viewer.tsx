"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { getDeviceId, toggleReelLike, type Reel } from "@/lib/eats-api";
import TintIcon from "./tint-icon";

const SHADOW = "[text-shadow:0_1px_4px_rgba(0,0,0,0.55)]";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill={filled ? "#ff3b5c" : "none"} stroke={filled ? "#ff3b5c" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.6-9.6-9.4C.9 8 3 4.5 6.5 4.5c2 0 3.6 1 5.5 3 1.9-2 3.5-3 5.5-3C21 4.5 23.1 8 21.6 11.6 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function directionsUrl(b: Reel["business"]): string | null {
  return (
    b.googleMapsUrl ||
    (b.latitude !== null && b.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`
      : b.address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.address)}`
        : null)
  );
}

function ReelPage({
  reel,
  active,
  onLike,
  onClose,
  onToast,
}: {
  reel: Reel;
  active: boolean;
  onLike: (reel: Reel) => void;
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const { t } = useLang();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // Solo el reel visible se reproduce; al volver a él arranca desde el inicio.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !paused) {
      video.muted = false;
      video.play().catch(() => {
        // el navegador no permite sonido sin gesto: se reproduce en silencio
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
    if (!active) {
      video.currentTime = 0;
      setPaused(false);
    }
  }, [active, paused]);

  async function share() {
    const url = `https://zertooeats.com/${reel.business.slug}`;
    const text = `${reel.business.name} — ${url}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: reel.business.name, text: reel.business.name, url });
      } catch {
        // canceló
      }
    } else {
      await navigator.clipboard?.writeText(text).catch(() => {});
      onToast(t.reels.linkCopied);
    }
  }

  const maps = directionsUrl(reel.business);
  const tagline = reel.caption || reel.business.tagline;

  return (
    <section className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={reel.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={videoRef}
        src={active ? reel.videoUrl : undefined}
        poster={reel.posterUrl}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        onClick={() => setPaused((p) => !p)}
      />
      {paused && active && (
        <button
          type="button"
          onClick={() => setPaused(false)}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/45 pl-1 text-[28px] text-white">▶</span>
        </button>
      )}

      <div className="absolute bottom-[150px] right-4 flex flex-col items-center gap-[22px]">
        <button type="button" onClick={() => onLike(reel)} aria-label={t.reels.likeLabel} className="flex flex-col items-center gap-0.5">
          <HeartIcon filled={reel.liked} />
          <span className={`text-xs font-bold text-white ${SHADOW}`}>{reel.likes}</span>
        </button>
        <button type="button" onClick={share} aria-label={t.reels.shareLabel}>
          <TintIcon src="/nav/icons8-flecha-responder-48.png" size={34} color="#fff" />
        </button>
        {maps && (
          <a href={maps} target="_blank" rel="noopener noreferrer" aria-label={t.reels.locationLabel}>
            <PinIcon />
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          onClose();
          router.push(`/${reel.business.slug}`);
        }}
        className="absolute bottom-[100px] left-5 right-[90px] text-left"
      >
        <p className={`truncate text-xl font-extrabold text-white ${SHADOW}`}>{reel.business.name}</p>
        {tagline && <p className={`line-clamp-2 text-base text-white ${SHADOW}`}>{tagline}</p>}
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-10 pb-[max(14px,env(safe-area-inset-bottom))] pt-3.5">
        <button type="button" onClick={onClose} aria-label="Home">
          <TintIcon src="/nav/icons8-casa-48.png" size={26} color="#fff" />
        </button>
        <a
          href={reel.business.menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[14px] bg-lime px-[34px] py-3 text-[17px] font-bold text-graphite"
        >
          {t.business.viewMenu}
        </a>
        <button type="button" onClick={() => router.push("/profile")} aria-label="Profile">
          <TintIcon src="/nav/icono-user.png" size={26} color="#fff" />
        </button>
      </div>
    </section>
  );
}

// Visor a pantalla completa tipo "reel": un video por pantalla, se pasa
// al siguiente deslizando. Corazón, compartir y "cómo llegar" a la
// derecha; "Ver menú" abajo — igual que la app nativa.
export default function ReelViewer({
  reels: initialReels,
  startIndex,
  onClose,
}: {
  reels: Reel[];
  startIndex: number;
  onClose: () => void;
}) {
  const { t } = useLang();
  const [reels, setReels] = useState(initialReels);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Bloquea el scroll de la página de atrás y cierra con Escape.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Arranca en el reel tocado.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = startIndex * el.clientHeight;
  }, [startIndex]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(Math.max(0, Math.min(Math.round(el.scrollTop / el.clientHeight), reels.length - 1)));
  }

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const handleLike = useCallback(async (reel: Reel) => {
    const optimistic = !reel.liked;
    const apply = (liked: boolean, likes: number) =>
      setReels((list) => list.map((r) => (r.id === reel.id ? { ...r, liked, likes } : r)));
    apply(optimistic, Math.max(0, reel.likes + (optimistic ? 1 : -1)));
    try {
      const res = await toggleReelLike(reel.id, getDeviceId());
      apply(res.liked, res.likes);
    } catch {
      apply(reel.liked, reel.likes); // se revierte si falló
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <div className="relative mx-auto h-full w-full max-w-[480px]">
        <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
          {reels.map((reel, i) => (
            <ReelPage key={reel.id} reel={reel} active={i === activeIndex} onLike={handleLike} onClose={onClose} onToast={showToast} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-[18px] pb-3 pt-[max(14px,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.reels.close}
            className="pointer-events-auto flex w-9 items-center justify-start"
          >
            <TintIcon src="/nav/icons8-izquierda-50.png" size={28} color="#fff" />
          </button>
          <p className={`text-lg font-extrabold text-white ${SHADOW}`}>{t.reels.title}</p>
          <span className="w-9" />
        </div>

        {toast && (
          <p className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">{toast}</p>
        )}
      </div>
    </div>
  );
}
