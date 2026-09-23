"use client";

import { motion } from "framer-motion";
import { Reveal } from "./reveal";

export default function Discover() {
  return (
    <section id="restaurants" className="overflow-hidden bg-graphite py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/landing/pizza.webp"
          alt="Whole pepperoni pizza seen from above"
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-full max-w-md lg:max-w-none lg:-translate-x-14 lg:scale-125"
        />

        <div className="relative">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden
            className="absolute -top-12 left-0 h-10 w-10 text-lime"
          >
            <path d="M8 40 C 10 28, 8 18, 12 8" />
            <path d="M22 42 C 24 30, 22 20, 26 10" />
            <path d="M36 40 C 38 30, 36 22, 40 12" />
          </svg>
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Discover more. <span className="text-coral">Eat better.</span>
            </h2>
            <p className="mt-5 max-w-md font-medium text-white/75">
              From local favorites to hidden gems, ZertooEats brings the best of Aruba right to your fingertips.
            </p>
            <a
              href="https://app.zertooeats.com"
              className="mt-9 inline-block rounded-full bg-white px-8 py-4 text-sm font-bold text-graphite transition-colors hover:bg-lime active:scale-[0.98]"
            >
              Explore Restaurants
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
