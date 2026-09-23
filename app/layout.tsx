import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import LangProvider from "@/components/lang-provider";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
// Fuente manuscrita para los HandNote (notitas tipo "Good Food Closer to
// You") que acompañan las fotos en la landing.
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zertooeats.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ZertooEats — Find your next favorite spot",
  description: "Menus, places, deals and more. All in one app. Descubre los mejores restaurantes de Aruba.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${jakarta.variable} ${caveat.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
