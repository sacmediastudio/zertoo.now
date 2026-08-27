import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zertooeats.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zertoo Eats! | Descubre dónde comer",
  description: "Restaurantes cerca tuyo — recomendados, mejor puntuados, y en vivo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
