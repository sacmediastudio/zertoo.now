"use client";

import { motion } from "framer-motion";
import { Heart, List, MapPin, Percent, type LucideIcon } from "lucide-react";
import { HandNote } from "./hand-note";
import { Reveal } from "./reveal";
import { useLang } from "@/lib/lang-context";

export default function AppShowcase() {
  const { t } = useLang();

  const APP_FEATURES: { label: string; icon: LucideIcon }[] = [
    { label: t.landing.appShowcase.findNearby, icon: MapPin },
    { label: t.landing.appShowcase.viewMenus, icon: List },
    { label: t.landing.appShowcase.exclusiveDeals, icon: Percent },
    { label: t.landing.appShowcase.saveFavorites, icon: Heart },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-cream">
      {/* Forma lima de marca — entra desde abajo-izquierda detrás del teléfono */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[18%] -left-[12%] z-0 h-[70%] w-[55%] rounded-[50%] bg-lime sm:-bottom-[22%] sm:-left-[8%] sm:w-[48%] lg:h-[78%] lg:w-[42%]"
      />

      <div className="relative z-10 mx-auto grid min-h-[36rem] max-w-[90rem] items-stretch gap-8 px-6 pb-0 pt-16 sm:pt-20 lg:min-h-[42rem] lg:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] lg:gap-6 lg:px-10 lg:pt-24 xl:px-16">
        {/* IZQUIERDA — mockup del teléfono */}
        <div className="relative z-10 flex items-end justify-center lg:items-center lg:justify-start lg:pl-4 xl:pl-10">
          <motion.div
            initial={{ opacity: 0, y: 36, rotate: -10 }}
            whileInView={{ opacity: 1, y: 0, rotate: -8 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-[min(100%,22rem)] sm:w-[min(100%,26rem)] lg:w-[min(100%,30rem)] xl:w-[32rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landing/app-phone.webp"
              alt="ZertooEats app on a smartphone: search, food categories and popular restaurants nearby"
              loading="lazy"
              decoding="async"
              className="relative z-10 w-full drop-shadow-[0_28px_50px_rgba(0,0,0,0.28)]"
            />
          </motion.div>
        </div>

        {/* DERECHA — texto + features + CTA */}
        <div className="relative z-20 flex flex-col justify-center pb-40 pt-2 sm:pb-48 lg:pb-36 lg:pl-4 lg:pr-8 xl:pl-8">
          <Reveal>
            <h2 className="max-w-xl text-[2.35rem] font-extrabold leading-[1.05] tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
              {t.landing.appShowcase.titleLine1}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-coral">{t.landing.appShowcase.titleHighlight}</span>
            </h2>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-charcoal/80 sm:text-lg">{t.landing.appShowcase.subtitle}</p>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-10 flex max-w-lg flex-wrap justify-between gap-y-6 sm:mt-12 sm:flex-nowrap sm:gap-x-2 lg:max-w-xl lg:gap-x-4">
              {APP_FEATURES.map(({ label, icon: Icon }) => (
                <li key={label} className="flex w-[46%] flex-col items-center gap-2.5 text-center sm:w-auto sm:flex-1">
                  <span className="grid h-[3.75rem] w-[3.75rem] place-items-center rounded-full border-[1.5px] border-coral bg-transparent sm:h-16 sm:w-16">
                    <Icon className="h-[1.35rem] w-[1.35rem] text-coral sm:h-6 sm:w-6" strokeWidth={1.6} />
                  </span>
                  <span className="max-w-[5.5rem] text-[0.7rem] font-semibold leading-snug text-charcoal sm:text-xs">{label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href="#download"
              className="mt-10 inline-flex w-fit items-center justify-center rounded-full bg-graphite px-9 py-3.5 text-sm font-bold text-white transition-colors hover:bg-charcoal active:scale-[0.98] sm:mt-12"
            >
              {t.landing.appShowcase.getApp}
            </a>
          </Reveal>

          <HandNote lines={t.landing.appShowcase.handNote} arrow={false} className="mt-8 -rotate-6 text-[1.65rem] leading-[0.9] sm:mt-10 sm:text-[1.85rem]" />
        </div>
      </div>

      {/* Plato de pasta — grande, abajo a la derecha, parcialmente cortado */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/landing/pasta-plate.webp"
        alt="Plate of penne pasta with cherry tomatoes, basil and parmesan"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, x: 40, rotate: 12 }}
        whileInView={{ opacity: 1, x: 0, rotate: 6 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-[18%] -right-[8%] z-10 w-[72%] max-w-none sm:-bottom-[22%] sm:-right-[6%] sm:w-[55%] lg:-bottom-[28%] lg:-right-[4%] lg:w-[38%] xl:w-[40%]"
      />
    </section>
  );
}
