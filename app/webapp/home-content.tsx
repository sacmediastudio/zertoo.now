"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";
import LangSwitch from "@/components/lang-switch";
import NearMeButton from "./near-me-button";
import FilterSelect from "./filter-select";
import SpotlightCarousel from "./spotlight-carousel";
import BusinessList, { type SearchableTenant } from "./business-list";
import type { BusinessCardData } from "./business-card";

export default function HomeContent({
  availableCategories,
  selectedCategory,
  availablePriceRanges,
  selectedPriceRange,
  spotlight,
  allTenantsCount,
  filteredTenantsCount,
  nearMeActive,
  byDistance,
  featured,
  rest,
}: {
  availableCategories: string[];
  selectedCategory: string | undefined;
  availablePriceRanges: { value: string; label: string }[];
  selectedPriceRange: string | undefined;
  spotlight: BusinessCardData[];
  allTenantsCount: number;
  filteredTenantsCount: number;
  nearMeActive: boolean;
  byDistance: SearchableTenant[];
  featured: SearchableTenant[];
  rest: SearchableTenant[];
}) {
  const { lang, t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  function updateParam(key: "category" | "priceRange", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#e4f73e] px-5 py-4 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <LangSwitch />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 min-w-0 bg-white border border-graphite/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-graphite/30"
          />
        </div>
      </header>

      <div className="bg-graphite px-5 py-2.5 overflow-hidden">
        <p className="max-w-xl mx-auto text-center text-sm font-semibold text-white flex items-center justify-center gap-1.5">
          <span className="animate-tagline-up">{t.taglinePart1}</span>
          <span className="animate-tagline-down text-lime">{t.taglinePart2}</span>
        </p>
      </div>

      <div className="max-w-xl mx-auto px-5 pt-5 flex flex-wrap items-center gap-2">
        <FilterSelect
          options={availableCategories.map((cat) => ({ value: cat, label: CATEGORY_LABELS[lang][cat] ?? cat }))}
          value={selectedCategory ?? null}
          onChange={(v) => updateParam("category", v)}
          allLabel={t.all}
          title={t.categoryTitle}
        />
        <FilterSelect
          options={availablePriceRanges}
          value={selectedPriceRange ?? null}
          onChange={(v) => updateParam("priceRange", v)}
          allLabel={t.priceRangeAll}
          title={t.priceRangeTitle}
        />
        <NearMeButton active={nearMeActive} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Zertoo Eats" className="h-9 w-auto ml-auto" />
      </div>

      <main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-5">
        {spotlight.length > 0 && (
          <SpotlightCarousel businesses={spotlight} onNavigate={(slug) => router.push(`/${slug}`)} />
        )}

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
            query={query}
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
