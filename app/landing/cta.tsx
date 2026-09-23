"use client";

import { motion } from "framer-motion";
import { HandNote } from "./hand-note";
import { Reveal } from "./reveal";
import { useLang } from "@/lib/lang-context";

export default function Cta() {
  const { t } = useLang();

  return (
    <section id="download" className="overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative">
          <HandNote lines={t.landing.cta.handNote} className="absolute -top-14 right-0 rotate-3 text-2xl sm:text-3xl lg:right-10" />
          <Reveal>
            <h2 className="max-w-lg text-4xl font-extrabold leading-[1.02] tracking-tight text-graphite sm:text-5xl xl:text-6xl">
              {t.landing.cta.titlePrefix} <span className="text-coral">{t.landing.cta.titleHighlight}</span>
            </h2>
            <p className="mt-5 font-medium text-charcoal/75">{t.landing.cta.subtitle}</p>
            <a
              href="https://apps.apple.com/app/id6814007959"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-block rounded-full bg-coral px-10 py-4 text-sm font-bold text-white transition-colors hover:bg-graphite active:scale-[0.98]"
            >
              {t.landing.cta.download}
            </a>
          </Reveal>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/landing/seated-person.webp"
          alt="Smiling man with red sunglasses relaxing in a red armchair, browsing the ZertooEats app on his phone"
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-md lg:max-w-none lg:scale-110"
        />
      </div>
    </section>
  );
}
