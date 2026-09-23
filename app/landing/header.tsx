"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import LangSwitch from "@/components/lang-switch";

const WEBAPP_URL = "https://app.zertooeats.com";
const BUSINESS_URL = "https://zertoo.app";

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  // Los nav links del diseño original (Restaurants/How it works/For
  // Business/About) eran anclas de una sola página — acá van a los
  // destinos reales que pidió el negocio: la app web, el panel de
  // negocios y contacto.
  const NAV_LINKS = [
    { label: t.landing.nav.webApp, href: WEBAPP_URL },
    { label: t.landing.nav.business, href: BUSINESS_URL },
    { label: t.landing.nav.contact, href: "#contact" },
  ];

  return (
    <header className="bg-lime">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" aria-label="ZertooEats — back to top">
          <Image src="/logo.svg" alt="ZertooEats" width={160} height={60} className="h-9 w-36 object-contain md:h-11 md:w-44" priority />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-charcoal transition-colors hover:text-graphite">
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            className="rounded-full bg-graphite px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-charcoal active:scale-[0.98]"
          >
            {t.landing.nav.getApp}
          </a>
          <LangSwitch />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-full text-graphite lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-graphite/10 px-6 pb-6 pt-2 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-graphite/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#download"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-graphite px-6 py-3.5 text-center text-sm font-bold text-white"
          >
            {t.landing.nav.getApp}
          </a>
          <div className="mt-4 flex justify-center">
            <LangSwitch />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
