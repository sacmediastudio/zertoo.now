import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LangProvider from "@/components/lang-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zertooeats.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ZertooEats — Find your next favorite spot",
  description: "Menus, places, deals and more. All in one app. Descubre los mejores restaurantes de Aruba.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
