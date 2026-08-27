"use client";

import { useState } from "react";
import BusinessCard, { type BusinessCardData } from "./business-card";
import { CATEGORY_LABELS, BUSINESS_TYPE_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";

export interface SearchableTenant extends BusinessCardData {
  businessType: string;
}

export default function BusinessList({
  nearMeActive,
  byDistance,
  featured,
  rest,
  hasAnyTenants,
}: {
  nearMeActive: boolean;
  byDistance: SearchableTenant[];
  featured: SearchableTenant[];
  rest: SearchableTenant[];
  hasAnyTenants: boolean;
}) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");

  // Busca por nombre, por categoría específica ("Criolla"), o por tipo
  // de negocio en general ("Restaurantes", "Restaurants") — no busca
  // palabras sueltas de comida que no sean el nombre exacto de una
  // categoría (ej. "hamburguesas" no va a encontrar nada a menos que
  // el nombre del negocio la tenga). Compara contra las etiquetas del
  // idioma actual, así buscar en inglés también funciona en inglés.
  function matches(tenant: SearchableTenant): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const categoryLabel = tenant.nowCategory ? CATEGORY_LABELS[lang][tenant.nowCategory] ?? tenant.nowCategory : "";
    const typeLabel = BUSINESS_TYPE_LABELS[lang][tenant.businessType] ?? tenant.businessType;
    return (
      tenant.name.toLowerCase().includes(q) ||
      categoryLabel.toLowerCase().includes(q) ||
      typeLabel.toLowerCase().includes(q)
    );
  }

  const filteredByDistance = byDistance.filter(matches);
  const filteredFeatured = featured.filter(matches);
  const filteredRest = rest.filter(matches);
  const totalShown = nearMeActive ? filteredByDistance.length : filteredFeatured.length + filteredRest.length;

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search.placeholder}
        className="w-full bg-white border border-graphite/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-graphite/30"
      />

      {hasAnyTenants && totalShown === 0 && (
        <p className="text-sm text-graphite/60 text-center py-10">
          {query.trim() ? t.search.noMatchQuery(query) : nearMeActive ? t.search.noNearby : t.search.noMatch}
        </p>
      )}

      {nearMeActive && filteredByDistance.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">
            {t.search.nearestSection}
          </h2>
          <div className="flex flex-col gap-3">
            {filteredByDistance.map((tenant) => (
              <BusinessCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </section>
      )}

      {!nearMeActive && filteredFeatured.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">
            {t.search.featuredSection}
          </h2>
          <div className="flex flex-col gap-3">
            {filteredFeatured.map((tenant) => (
              <BusinessCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </section>
      )}

      {!nearMeActive && filteredRest.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">
            {filteredFeatured.length > 0 ? t.search.allBusinessesSection : t.search.businessesSection}
          </h2>
          <div className="flex flex-col gap-3">
            {filteredRest.map((tenant) => (
              <BusinessCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
