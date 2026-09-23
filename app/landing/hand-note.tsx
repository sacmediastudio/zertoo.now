// Notita manuscrita con una florcha curva, usada como acento juguetón
// junto a las fotos (fuente Caveat, tinta verde oscuro).
export function HandNote({
  lines,
  className = "",
  arrow = true,
}: {
  lines: string[];
  className?: string;
  arrow?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none font-hand font-semibold leading-[0.95] text-graphite ${className}`}
    >
      {lines.map((line, i) => (
        <span key={`${i}-${line}`} className="block">
          {line}
        </span>
      ))}
      {arrow ? (
        <svg
          viewBox="0 0 48 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-1 h-8 w-10 -scale-x-100"
        >
          <path d="M40 4 C 30 22, 18 28, 8 30" />
          <path d="M14 24 L 7 30 L 15 35" />
        </svg>
      ) : null}
    </div>
  );
}
