import { db } from "@/lib/db";
import type { NowCategory } from "@prisma/client";
import { CATEGORY_LABELS } from "@/lib/categories";
import NearMeButton from "./near-me-button";
import BusinessList from "./business-list";

// Fuerza que esto se genere en cada visita (tiempo de ejecución), NO
// durante `next build` — la base de datos solo es alcanzable en
// tiempo de ejecución (red privada de Railway), mismo motivo por el
// que el sitemap del proyecto principal necesitó este mismo fix.
export const dynamic = "force-dynamic";

// Distancia entre dos puntos en la Tierra, en km — cálculo puro, sin
// necesidad de ningún servicio externo (la geocodificación de la
// dirección del negocio sí lo necesita, pero eso ya pasó una sola vez
// de antemano; esto es solo matemática).
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; lat?: string; lng?: string };
}) {
  const allTenants = await db.tenant.findMany({
    where: { nowEnabled: true },
    include: { reviews: { where: { status: "PUBLISHED" } } },
    orderBy: { nowFeatured: "desc" },
  });

  // Solo se muestran como opción las categorías que de verdad tienen
  // algún negocio activo — no tiene sentido dejar elegir "Sushi" si
  // hoy no hay ningún negocio de sushi.
  const availableCategories = Array.from(
    new Set(allTenants.map((t) => t.nowCategory).filter((c): c is NowCategory => Boolean(c)))
  ).sort((a, b) => (CATEGORY_LABELS[a] ?? a).localeCompare(CATEGORY_LABELS[b] ?? b));

  const selectedCategory = searchParams.category;
  const filteredTenants = selectedCategory
    ? allTenants.filter((t) => t.nowCategory === selectedCategory)
    : allTenants;

  const userLat = searchParams.lat ? Number(searchParams.lat) : null;
  const userLng = searchParams.lng ? Number(searchParams.lng) : null;
  const nearMeActive = userLat !== null && userLng !== null && !Number.isNaN(userLat) && !Number.isNaN(userLng);

  const withRatings = filteredTenants.map((t) => {
    const publishedReviews = t.reviews;
    const avgRating =
      publishedReviews.length > 0
        ? publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length
        : null;
    const distanceKm =
      nearMeActive && t.latitude !== null && t.longitude !== null
        ? haversineKm(userLat!, userLng!, t.latitude, t.longitude)
        : null;
    return { ...t, avgRating, reviewCount: publishedReviews.length, distanceKm };
  });

  // Con "cerca de mí" activo, se muestra UN solo listado ordenado por
  // distancia real — separar Destacados del resto no tendría sentido
  // acá, porque son dos criterios de orden distintos que podrían
  // contradecirse (lo "destacado" no necesariamente es lo más cerca).
  // Los negocios sin coordenadas todavía (no geocodificados) quedan al
  // final, no se pueden ordenar por algo que no tienen.
  const byDistance = nearMeActive
    ? [...withRatings].sort((a, b) => {
        if (a.distanceKm === null && b.distanceKm === null) return 0;
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      })
    : [];

  const featured = withRatings.filter((t) => t.nowFeatured);
  const rest = withRatings.filter((t) => !t.nowFeatured);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#e4f73e] px-5 py-6 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Zertoo Eats" className="h-16 w-auto" />
          <p className="text-sm text-graphite/70 mt-1">Descubre dónde comer, ahora mismo</p>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 pt-5 flex flex-wrap items-start gap-2">
        <a
          href="/"
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            !selectedCategory ? "bg-graphite text-white" : "bg-white text-graphite/70 hover:bg-graphite/5"
          }`}
        >
          Todas
        </a>
        {availableCategories.map((cat) => (
          <a
            key={cat}
            href={`/?category=${cat}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              selectedCategory === cat ? "bg-graphite text-white" : "bg-white text-graphite/70 hover:bg-graphite/5"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </a>
        ))}
        <NearMeButton active={nearMeActive} />
      </div>

      <main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-5">
        {filteredTenants.length === 0 && allTenants.length > 0 && (
          <p className="text-sm text-graphite/60 text-center py-16">
            Ningún negocio en esa categoría todavía —{" "}
            <a href="/" className="underline font-medium">
              ver todos
            </a>
            .
          </p>
        )}
        {allTenants.length === 0 && (
          <p className="text-sm text-graphite/60 text-center py-16">
            Todavía no hay negocios en Zertoo Eats — pronto vas a ver acá los mejores lugares.
          </p>
        )}

        {filteredTenants.length > 0 && (
          <BusinessList
            nearMeActive={nearMeActive}
            byDistance={byDistance}
            featured={featured}
            rest={rest}
            hasAnyTenants={filteredTenants.length > 0}
          />
        )}
      </main>

      <footer className="text-center py-8 text-xs text-graphite/40">Un producto de Zertoo</footer>
    </div>
  );
}
