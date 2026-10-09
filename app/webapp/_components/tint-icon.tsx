// Ícono PNG pintado de un solo color (equivalente a tintColor en la app
// nativa): el PNG actúa de máscara y el color de fondo lo rellena.
export default function TintIcon({
  src,
  size,
  color = "#002D09",
  className = "",
}: {
  src: string;
  size: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
