// Botones de descarga — apuntan a las fichas reales de cada tienda.
// Van a devolver 404/"no disponible" hasta que Apple y Google terminen
// de aprobar la publicación; el link ya queda correcto para cuando esté
// pública, sin tener que tocar este componente de nuevo.
const APP_STORE_URL = "https://apps.apple.com/app/id6814007959";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.zertoo.eats";

export default function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-graphite text-white rounded-xl px-4 py-2.5 hover:brightness-125 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.05 12.536c-.03-3.09 2.52-4.578 2.635-4.646-1.44-2.104-3.68-2.393-4.478-2.425-1.906-.194-3.72 1.123-4.688 1.123-.968 0-2.462-1.096-4.05-1.066-2.083.03-4.005 1.212-5.077 3.075-2.165 3.751-.552 9.31 1.556 12.354 1.03 1.49 2.256 3.163 3.87 3.103 1.552-.062 2.14-1.004 4.017-1.004 1.877 0 2.406 1.004 4.053.97 1.674-.028 2.732-1.518 3.755-3.017 1.185-1.73 1.673-3.406 1.7-3.492-.037-.017-3.259-1.251-3.293-4.975Zm-3.083-9.147C14.797 2.36 15.417 1.15 15.234 0c-1.09.045-2.412.732-3.196 1.658-.703.822-1.318 2.083-1.153 3.31 1.2.093 2.428-.61 3.082-1.579Z" />
        </svg>
        <div className="text-left leading-tight">
          <div className="text-[10px] opacity-80">Download on the</div>
          <div className="text-sm font-semibold -mt-0.5">App Store</div>
        </div>
      </a>

      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-graphite text-white rounded-xl px-4 py-2.5 hover:brightness-125 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.6 2.4c-.4.3-.6.8-.6 1.4v16.4c0 .6.2 1.1.6 1.4l.1.1L13 12.5v-.2L3.7 2.3l-.1.1Z" fill="#00D8FF" />
          <path d="M16.1 15.6 13 12.5v-.2l3.1-3.1 4.6 2.6c1.3.8 1.3 2 0 2.8l-4.6 2.6-.6-.6Z" fill="#FFCF00" />
          <path d="M16.1 15.6 13 12.4 3.6 21.8c.4.4 1 .4 1.8.1l10.7-6.3Z" fill="#FF3B58" />
          <path d="M16.1 9.2 5.4 2.9c-.8-.3-1.4-.3-1.8.1l10.4 9.4 2.1-3.2Z" fill="#00F076" />
        </svg>
        <div className="text-left leading-tight">
          <div className="text-[10px] opacity-80">GET IT ON</div>
          <div className="text-sm font-semibold -mt-0.5">Google Play</div>
        </div>
      </a>
    </div>
  );
}
