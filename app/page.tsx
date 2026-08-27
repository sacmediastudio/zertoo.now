import { db } from "@/lib/db";
import type { NowCategory } from "@prisma/client";
import { CATEGORY_LABELS } from "@/lib/categories";
import HomeContent from "./home-content";

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

// El ORDEN de las categorías disponibles se calcula acá (servidor,
// usando las etiquetas en español como criterio de orden alfabético)
// — no cambia según el idioma elegido, solo la ETIQUETA que se
// muestra cambia (eso sí depende del idioma, y se resuelve en
// HomeContent). Es una decisión menor: el orden de las categorías es
// el mismo sin importar el idioma, en vez de reordenarse alfabético
// en cada idioma por separado.
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
  ).sort((a, b) => (CATEGORY_LABELS.es[a] ?? a).localeCompare(CATEGORY_LABELS.es[b] ?? b));

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

  // Fuera de este radio no tiene sentido considerarlo "cerca" — sin
  // este límite, alguien en otro país seguía viendo la lista completa,
  // solo que ordenada por una distancia gigante en vez de filtrada.
  // 20 km es más que de sobra para Aruba (32 km de punta a punta) —
  // nadie busca comer en un restaurante a 50 km en una isla así de
  // chica.
  const MAX_NEAR_ME_KM = 20;

  // Con "cerca de mí" activo, se muestra UN solo listado ordenado por
  // distancia real — separar Destacados del resto no tendría sentido
  // acá, porque son dos criterios de orden distintos que podrían
  // contradecirse (lo "destacado" no necesariamente es lo más cerca).
  // Los negocios sin coordenadas todavía (no geocodificados) quedan al
  // final, no se pueden ordenar por algo que no tienen — pero si están
  // confirmados fuera del radio, se descartan directamente.
  const byDistance = nearMeActive
    ? [...withRatings]
        .filter((t) => t.distanceKm === null || t.distanceKm <= MAX_NEAR_ME_KM)
        .sort((a, b) => {
          if (a.distanceKm === null && b.distanceKm === null) return 0;
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        })
    : [];

  const featured = withRatings.filter((t) => t.nowFeatured);
  const rest = withRatings.filter((t) => !t.nowFeatured);

  return (
    <HomeContent
      availableCategories={availableCategories}
      selectedCategory={selectedCategory}
      allTenantsCount={allTenants.length}
      filteredTenantsCount={filteredTenants.length}
      nearMeActive={nearMeActive}
      byDistance={byDistance}
      featured={featured}
      rest={rest}
    />
  );
}
