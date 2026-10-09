"use client";

import NearMeButton from "./near-me-button";
import TintIcon from "./tint-icon";

// Barra fija inferior (Inicio / Cerca de mí / Perfil) — igual que la app nativa.
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
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-graphite/10 bg-white pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5">
      <div className="mx-auto flex max-w-xl items-center justify-center gap-8">
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
  );
}
