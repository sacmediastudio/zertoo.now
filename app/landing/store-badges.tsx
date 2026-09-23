import { Apple, Play } from "lucide-react";

// A diferencia del diseño original (que apuntaba ambos botones a un
// ancla "#download" en la misma página), acá van directo a la ficha
// real de cada tienda — van a devolver "no disponible" hasta que Apple
// y Google terminen de aprobar la publicación, pero el link ya queda
// correcto para cuando esté pública.
const APP_STORE_URL = "https://apps.apple.com/app/id6814007959";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.zertoo.eats";

export default function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-charcoal px-5 py-3 text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Apple className="h-7 w-7" fill="currentColor" strokeWidth={0} />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-white/80">Download on the</span>
          <span className="block text-lg font-bold">App Store</span>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-charcoal px-5 py-3 text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Play className="h-6 w-6" fill="currentColor" strokeWidth={0} />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-white/80">Get it on</span>
          <span className="block text-lg font-bold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
