import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zertoo Eats! | Descubre dónde comer",
  description: "Restaurantes cerca tuyo — recomendados, mejor puntuados, y en vivo.",
};

export default function WebAppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
