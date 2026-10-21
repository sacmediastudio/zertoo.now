"use client";

import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { fetchReels, getDeviceId, type Reel } from "@/lib/eats-api";
import NearMeButton from "./near-me-button";
import ReelViewer from "./reel-viewer";
import TintIcon from "./tint-icon";

// Orden aleatorio (Fisher–Yates): cada vez que se abre el visor sale una
// mezcla distinta, no "los más recientes primero".
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Barra fija inferior (Reels / Inicio / Cerca de mí / Perfil) — igual que la
// app nativa. El botón de play precarga los reels (si no hay ninguno, no se
// muestra) y al tocarlo abre el visor a pantalla completa, en orden aleatorio.
export default function BottomNavBar({
  onHomePress,
  nearMeActive,
  onNearMeActivate,
  onNearMeDeactivate,
  onNearMePress,
  onProfilePress,
}: {
  onHomePress: () => void;
  nearMeActive: boolean;
  onNearMeActivate: (lat: number, lng: number) => void;
  onNearMeDeactivate: () => void;
  onNearMePress?: () => void;
  onProfilePress: () => void;
}) {
  const { t } = useLang();
  const [reels, setReels] = useState<Reel[]>([]);
  const [viewerReels, setViewerReels] = useState<Reel[] | null>(null);

  const loadReels = useCallback(async (): Promise<Reel[]> => {
    try {
      const list = await fetchReels(getDeviceId());
      setReels(list);
      return list;
    } catch {
      // sin reels no pasa nada: el botón simplemente no se muestra
      return [];
    }
  }, []);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  async function openReels() {
    const list = reels.length > 0 ? reels : await loadReels();
    if (list.length > 0) setViewerReels(shuffle(list));
  }

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-graphite/10 bg-white pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-8">
          {reels.length > 0 && (
            <button type="button" onClick={openReels} aria-label={t.reels.title} className="p-1">
              <TintIcon src="/nav/icons8-play-32.png" size={24} />
            </button>
          )}
          <button type="button" onClick={onHomePress} aria-label="Home" className="p-1">
            <TintIcon src="/nav/icons8-casa-48.png" size={24} />
          </button>
          <NearMeButton
            active={nearMeActive}
            onActivate={onNearMeActivate}
            onDeactivate={onNearMeDeactivate}
            overridePress={onNearMePress}
          />
          <button type="button" onClick={onProfilePress} aria-label="Profile" className="p-1">
            <TintIcon src="/nav/icono-user.png" size={24} />
          </button>
        </div>
      </nav>

      {viewerReels && (
        <ReelViewer
          reels={viewerReels}
          startIndex={0}
          onClose={() => {
            setViewerReels(null);
            loadReels();
          }}
        />
      )}
    </>
  );
}
