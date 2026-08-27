import { db } from "@/lib/db";
import NearMeButton from "./near-me-button";

// Fuerza que esto se genere en cada visita (tiempo de ejecución), NO
// durante `next build` — la base de datos solo es alcanzable en
// tiempo de ejecución (red privada de Railway), mismo motivo por el
// que el sitemap del proyecto principal necesitó este mismo fix.
export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ITALIAN: "Italiana",
  FRENCH: "Francesa",
  INTERNATIONAL: "Internacional",
  ASIAN: "Asiática",
  CRIOLLA: "Criolla",
  STEAKHOUSE: "Steakhouse",
  SEAFOOD: "Mariscos",
  FAST_FOOD: "Comida rápida",
  CAFE_DESSERTS: "Café y postres",
  PIZZERIA: "Pizzería",
  SUSHI: "Sushi",
  BAR_PUB: "Bar",
  VEGETARIAN: "Vegetariana",
  HAIR_SALON: "Peluquería",
  NAIL_SALON: "Salón de uñas",
  SPA_WELLNESS: "Spa y bienestar",
  BARBERSHOP: "Barbería",
  OTHER_SERVICES: "Otros servicios",
};

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
    new Set(allTenants.map((t) => t.nowCategory).filter((c): c is string => Boolean(c)))
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
      <header className="bg-graphite text-white px-5 py-6 sticky top-0 z-10">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Zertoo <span className="text-lime">Now!</span>
          </h1>
          <p className="text-sm text-white/70 mt-1">Descubre dónde ir, ahora mismo</p>
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

      <main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-8">
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
            Todavía no hay negocios en Zertoo Now — pronto vas a ver acá los mejores lugares.
          </p>
        )}

        {nearMeActive && filteredTenants.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">Más cerca tuyo</h2>
            <div className="flex flex-col gap-3">
              {byDistance.map((t) => (
                <BusinessCard key={t.id} tenant={t} />
              ))}
            </div>
          </section>
        )}

        {!nearMeActive && featured.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">Destacados</h2>
            <div className="flex flex-col gap-3">
              {featured.map((t) => (
                <BusinessCard key={t.id} tenant={t} />
              ))}
            </div>
          </section>
        )}

        {!nearMeActive && rest.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-graphite/50 mb-3">
              {featured.length > 0 ? "Todos los negocios" : "Negocios"}
            </h2>
            <div className="flex flex-col gap-3">
              {rest.map((t) => (
                <BusinessCard key={t.id} tenant={t} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-graphite/40">Un producto de Zertoo</footer>
    </div>
  );
}

function BusinessCard({
  tenant,
}: {
  tenant: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
    heroImageUrl: string | null;
    address: string | null;
    nowCategory: string | null;
    avgRating: number | null;
    reviewCount: number;
    distanceKm?: number | null;
  };
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] overflow-hidden flex items-center gap-4 p-4">
      {tenant.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tenant.logoUrl} alt={tenant.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-graphite text-white flex items-center justify-center text-lg font-bold shrink-0">
          {tenant.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-graphite truncate">{tenant.name}</p>
        <div className="flex items-center gap-2 text-xs text-graphite/60 mt-0.5">
          {tenant.nowCategory && (
            <span className="bg-[#F7F8F4] px-2 py-0.5 rounded-full font-medium">
              {CATEGORY_LABELS[tenant.nowCategory] ?? tenant.nowCategory}
            </span>
          )}
          {tenant.avgRating !== null && (
            <span>
              ★ {tenant.avgRating.toFixed(1)} ({tenant.reviewCount})
            </span>
          )}
          {tenant.distanceKm !== null && tenant.distanceKm !== undefined && (
            <span className="font-medium text-graphite">
              {tenant.distanceKm < 1 ? `${Math.round(tenant.distanceKm * 1000)} m` : `${tenant.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>
        {tenant.address && <p className="text-xs text-graphite/50 truncate mt-1">{tenant.address}</p>}
      </div>
    </div>
  );
}
