"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { fetchListings, type ListingsResponse } from "@/lib/eats-api";
import BusinessCard from "./_components/business-card";
import FeaturedGrid from "./_components/featured-grid";
import SpotlightCarousel from "./_components/spotlight-carousel";
import SecondaryCategoryGrid from "./_components/secondary-category-grid";
import SelectSheet from "./_components/select-sheet";
import FoodPeekImage from "./_components/food-peek-image";
import EatsLangSwitch from "./_components/eats-lang-switch";
import BottomNavBar from "./_components/bottom-nav-bar";

// Port web de HomeScreen de la app nativa (zertoo-mobile-app): mismo
// header con foto que se asoma, mismos filtros, mismas secciones.
export default function HomeScreen() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [secondaryCategory, setSecondaryCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // El spinner de pantalla completa solo en la primera carga; un cambio
  // de filtro sobre datos ya visibles usa un indicador chico.
  const loading = !data && fetching;

  const load = useCallback(async () => {
    setFetching(true);
    setError(false);
    try {
      setData(
        await fetchListings({
          category,
          secondaryCategory,
          priceRange,
          q: query || undefined,
          lat: coords?.lat,
          lng: coords?.lng,
        })
      );
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, [category, secondaryCategory, priceRange, query, coords]);

  useEffect(() => {
    const timeout = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [load, query]);

  const openBusiness = (slug: string) => router.push(`/${slug}`);

  const nearMeActive = !!coords;
  const sections: { title: string; data: NonNullable<ListingsResponse["rest"]>; isFeatured?: boolean }[] = [];
  if (data) {
    if (nearMeActive && data.nearby) {
      sections.push({ title: t.search.nearestSection, data: data.nearby });
    } else {
      if (data.featured.length) sections.push({ title: t.search.featuredSection, data: data.featured, isFeatured: true });
      if (data.rest.length)
        sections.push({
          title: data.featured.length ? t.search.allBusinessesSection : t.search.businessesSection,
          data: data.rest,
        });
    }
  }
  const totalShown = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <div className="min-h-screen bg-eats-bg pb-24">
      <header className="rounded-b-3xl bg-eats-header px-5 pt-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-2.5">
            <EatsLangSwitch />
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full rounded-[14px] border border-graphite/10 bg-white py-3 pl-3.5 pr-9 text-sm text-graphite outline-none placeholder:text-graphite/50"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[13px] font-bold text-graphite/50"
                >
                  ✕
                </button>
              )}
              {fetching && data && (
                <span className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />
              )}
            </div>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <FoodPeekImage />
            <p className="flex flex-1 flex-col items-center self-center text-center text-[15px] font-bold leading-[19px] text-[#0a2808]">
              <span className="animate-tagline-up">{t.taglinePart1}</span>
              <span className="animate-tagline-up text-[#dd5152]">{t.taglinePart2}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-4 px-5 pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SelectSheet
              grow
              options={(data?.availableCategories ?? []).map((o) => ({ value: o.value, label: lang === "es" ? o.labelEs : o.labelEn }))}
              value={category}
              onChange={setCategory}
              allLabel={t.all}
              title={t.categoryTitle}
            />
            <SelectSheet
              options={data?.availablePriceRanges ?? []}
              value={priceRange}
              onChange={setPriceRange}
              allLabel={t.priceRangeAll}
              title={t.priceRangeTitle}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Zertoo Eats" className="h-8 w-auto" />
          </div>

          <SecondaryCategoryGrid value={secondaryCategory} onChange={setSecondaryCategory} />

          {!!data?.spotlight.length && <SpotlightCarousel businesses={data.spotlight} onPress={openBusiness} />}

          {loading && (
            <div className="flex justify-center py-6">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-2.5 py-6">
              <p className="text-[13px] text-graphite/60">{t.errors.loadFailed}</p>
              <button type="button" onClick={load} className="rounded-[14px] bg-graphite px-4 py-2 text-[13px] font-semibold text-white">
                {t.errors.retry}
              </button>
            </div>
          )}

          {!loading && !error && data && totalShown === 0 && (
            <p className="py-6 text-center text-[13px] text-graphite/60">
              {query.trim() ? t.search.noMatchQuery(query) : nearMeActive ? t.search.noNearby : t.search.noMatch}
            </p>
          )}
        </div>

        {!loading &&
          !error &&
          sections.map((section) => (
            <section key={section.title} className="mb-2 flex flex-col gap-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-[1.5px] text-graphite/50">{section.title}</h2>
              {section.isFeatured ? (
                <FeaturedGrid businesses={section.data} onPress={openBusiness} />
              ) : (
                <div className="flex flex-col gap-3">
                  {section.data.map((tenant) => (
                    <BusinessCard key={tenant.id} tenant={tenant} onPress={() => openBusiness(tenant.slug)} />
                  ))}
                </div>
              )}
            </section>
          ))}

        <p className="py-4 text-center text-[11px] text-graphite/50">{t.footer}</p>
      </main>

      <BottomNavBar
        onHomePress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        nearMeActive={nearMeActive}
        onNearMeActivate={(lat, lng) => setCoords({ lat, lng })}
        onNearMeDeactivate={() => setCoords(null)}
        onProfilePress={() => router.push("/profile")}
      />
    </div>
  );
}
