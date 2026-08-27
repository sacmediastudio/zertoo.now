"use client";

import { CATEGORY_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";
import LangSwitch from "@/components/lang-switch";
import NearMeButton from "./near-me-button";
import BusinessList, { type SearchableTenant } from "./business-list";

export default function HomeContent({
  availableCategories,
  selectedCategory,
  allTenantsCount,
  filteredTenantsCount,
  nearMeActive,
  byDistance,
  featured,
  rest,
}: {
  availableCategories: string[];
  selectedCategory: string | undefined;
  allTenantsCount: number;
  filteredTenantsCount: number;
  nearMeActive: boolean;
  byDistance: SearchableTenant[];
  featured: SearchableTenant[];
  rest: SearchableTenant[];
}) {
  const { lang, t } = useLang();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#e4f73e] px-5 py-6 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center relative">
          <div className="absolute top-0 right-0">
            <LangSwitch />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Zertoo Eats" className="h-16 w-auto" />
          <p className="text-sm text-graphite/70 mt-1">{t.tagline}</p>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 pt-5 flex flex-wrap items-start gap-2">
        <a
          href="/"
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            !selectedCategory ? "bg-graphite text-white" : "bg-white text-graphite/70 hover:bg-graphite/5"
          }`}
        >
          {t.all}
        </a>
        {availableCategories.map((cat) => (
          <a
            key={cat}
            href={`/?category=${cat}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              selectedCategory === cat ? "bg-graphite text-white" : "bg-white text-graphite/70 hover:bg-graphite/5"
            }`}
          >
            {CATEGORY_LABELS[lang][cat] ?? cat}
          </a>
        ))}
        <NearMeButton active={nearMeActive} />
      </div>

      <main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-5">
        {filteredTenantsCount === 0 && allTenantsCount > 0 && (
          <p className="text-sm text-graphite/60 text-center py-16">
            {t.empty.noneInCategory}{" "}
            <a href="/" className="underline font-medium">
              {t.empty.viewAll}
            </a>
            .
          </p>
        )}
        {allTenantsCount === 0 && (
          <p className="text-sm text-graphite/60 text-center py-16">{t.empty.noneYet}</p>
        )}

        {filteredTenantsCount > 0 && (
          <BusinessList
            nearMeActive={nearMeActive}
            byDistance={byDistance}
            featured={featured}
            rest={rest}
            hasAnyTenants={filteredTenantsCount > 0}
          />
        )}
      </main>

      <footer className="text-center py-8 text-xs text-graphite/40">{t.footer}</footer>
    </div>
  );
}
