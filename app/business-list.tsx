"use client";

import { useState } from "react";
import BusinessCard, { type BusinessCardData } from "./business-card";
import { CATEGORY_LABELS, BUSINESS_TYPE_LABELS } from "@/lib/categories";

interface SearchableTenant extends BusinessCardData {
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
  const [query, setQuery] = useState("");

  // Busca por nombre, por categoría específica ("Criolla"), o por tipo
  // de negocio en general ("Restaurantes", "Citas") — no busca
  // palabras sueltas de comida que no sean el nombre exacto de una
  // categoría (ej. "hamburguesas" no va a encontrar nada a menos que
  // el nombre del negocio la tenga).
  function matches(t: SearchableTenant): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const categoryLabel = t.nowCategory ? CATEGORY_LABELS[t.nowCategory] ?? t.nowCategory : "";
    const typeLabel = BUSINESS_TYPE_LABELS[t.businessType] ?? t.businessType;
    return (
      t.name.toLowerCase().includes(q) ||
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
        placeholder="Buscar por nombre, categoría o tipo (ej. Restaurantes)"
        className="w-full bg-white border border-graphite/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-graphite/30"
      />

      {hasAnyTenants && totalShown === 0 && (
        <p className="text-sm text-graphite/60 text-center py-10">
          {query.trim() ? (
            <>Nada coincide con &quot;{query}&quot; — probá con otra palabra.</>
          ) : nearMeActive ? (
            "No encontramos restaurantes cerca tuyo — todavía no llegamos a tu zona."
          ) : (
            "Nada coincide con tu búsqueda."
          )}
        </p>
      )}

      {nearMeActive && filteredByDistance.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">Más cerca tuyo</h2>
          <div className="flex flex-col gap-3">
            {filteredByDistance.map((t) => (
              <BusinessCard key={t.id} tenant={t} />
            ))}
          </div>
        </section>
      )}

      {!nearMeActive && filteredFeatured.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">Destacados</h2>
          <div className="flex flex-col gap-3">
            {filteredFeatured.map((t) => (
              <BusinessCard key={t.id} tenant={t} />
            ))}
          </div>
        </section>
      )}

      {!nearMeActive && filteredRest.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">
            {filteredFeatured.length > 0 ? "Todos los negocios" : "Negocios"}
          </h2>
          <div className="flex flex-col gap-3">
            {filteredRest.map((t) => (
              <BusinessCard key={t.id} tenant={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
