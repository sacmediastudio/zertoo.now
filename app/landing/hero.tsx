"use client";

import { motion } from "framer-motion";
import { HandNote } from "./hand-note";
import StoreBadges from "./store-badges";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-lime">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-2 lg:pb-20 lg:pt-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-graphite"
          >
            Good food. Great places.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-4 max-w-xl text-5xl font-extrabold leading-[0.95] tracking-tight text-graphite sm:text-6xl xl:text-7xl"
          >
            Find your next favorite <span className="text-coral">spot.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-md text-lg font-medium text-charcoal"
          >
            Menus, places, deals and more. All in one app.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}>
            <StoreBadges className="mt-9" />
          </motion.div>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden
            className="absolute -left-2 top-2 z-10 h-10 w-10 text-graphite lg:left-4"
          >
            <path d="M8 40 C 10 28, 8 18, 12 8" />
            <path d="M22 42 C 24 30, 22 20, 26 10" />
            <path d="M36 40 C 38 30, 36 22, 40 12" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/landing/hero-burger.webp"
            alt="Two hands holding a stacked double cheeseburger with bacon, melted cheese, tomato and lettuce"
            initial={{ opacity: 0, scale: 0.94, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mx-auto w-full max-w-xl lg:max-w-none lg:scale-110"
          />
          <HandNote lines={["Good Food", "Closer", "to You"]} className="absolute right-0 top-0 rotate-6 text-2xl sm:text-3xl lg:-right-2" />
        </div>
      </div>
    </section>
  );
}
