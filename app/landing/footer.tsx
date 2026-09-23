"use client";

import Image from "next/image";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import LangSwitch from "@/components/lang-switch";

const BUSINESS_URL = "https://zertoo.app";

// Sin perfiles reales todavía — quedan como placeholder visual (igual
// que el diseño original) hasta que haya URLs de verdad para cargar acá.
const SOCIALS = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "TikTok", href: "#", icon: Music2 },
  { label: "YouTube", href: "#", icon: Youtube },
];

export default function LandingFooter() {
  const { t } = useLang();

  const FOOTER_LINKS = [
    { label: t.landing.footer.forBusiness, href: BUSINESS_URL },
    { label: t.landing.footer.contact, href: "mailto:hello@zertoo.app" },
    { label: t.landing.footer.privacy, href: "https://zertoo.app/privacidad" },
  ];

  return (
    <footer id="contact" className="bg-graphite pb-8 pt-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <Image src="/logo.svg" alt="ZertooEats" width={192} height={72} className="h-12 w-48 object-contain brightness-0 invert" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{t.landing.footer.tagline}</p>

        <ul className="mt-8 flex items-center gap-6">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full text-white/80 transition-colors hover:text-lime">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <LangSwitch dark />
        </div>

        <div className="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} ZertooEats. {t.landing.footer.rights}</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-lime">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
