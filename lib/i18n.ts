export type Lang = "es" | "en";

const STORAGE_KEY = "zertoo_lang";

// Misma clave que usa el resto del ecosistema Zertoo (dashboard,
// landing, login) — aunque acá vive en un dominio distinto
// (zertooeats.com), así que en la práctica no comparte el valor
// guardado con esos otros sitios (localStorage es por dominio), pero
// mantiene el mismo patrón por consistencia.
export function getStoredLang(): Lang {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "es";
}

export function setStoredLang(lang: Lang) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, lang);
}

export const translations = {
  es: {
    tagline: "Descubre dónde comer, ahora mismo",
    all: "Todas",
    footer: "Un producto de Zertoo",
    nearMe: {
      searching: "Buscando tu ubicación...",
      activeLabel: "Cerca de mí ✓",
      label: "Cerca de mí",
      noGeolocation: "Tu navegador no permite compartir ubicación.",
      denied: "No pudimos acceder a tu ubicación — revisá el permiso en tu navegador.",
    },
    search: {
      placeholder: "Buscar por nombre, categoría o tipo (ej. Restaurantes)",
      noMatchQuery: (q: string) => `Nada coincide con "${q}" — probá con otra palabra.`,
      noNearby: "No encontramos restaurantes cerca tuyo — todavía no llegamos a tu zona.",
      noMatch: "Nada coincide con tu búsqueda.",
      nearestSection: "Más cerca tuyo",
      featuredSection: "Destacados",
      allBusinessesSection: "Todos los negocios",
      businessesSection: "Negocios",
    },
    empty: {
      noneInCategory: "Ningún negocio en esa categoría todavía —",
      viewAll: "ver todos",
      noneYet: "Todavía no hay negocios en Zertoo Eats — pronto vas a ver acá los mejores lugares.",
    },
    business: {
      backLink: "Zertoo Eats",
      viewMenu: "Ver menú",
    },
    actions: {
      directions: "Cómo llegar",
      shareWhatsapp: "Compartir por WhatsApp",
      share: "Compartir",
      shareText: (name: string) => `Mirá ${name} en Zertoo Eats`,
    },
  },
  en: {
    tagline: "Discover where to eat, right now",
    all: "All",
    footer: "A Zertoo product",
    nearMe: {
      searching: "Finding your location...",
      activeLabel: "Near me ✓",
      label: "Near me",
      noGeolocation: "Your browser doesn't support sharing location.",
      denied: "We couldn't access your location — check the permission in your browser.",
    },
    search: {
      placeholder: "Search by name, category, or type (e.g. Restaurants)",
      noMatchQuery: (q: string) => `Nothing matches "${q}" — try another word.`,
      noNearby: "We didn't find any restaurants near you — we haven't reached your area yet.",
      noMatch: "Nothing matches your search.",
      nearestSection: "Closest to you",
      featuredSection: "Featured",
      allBusinessesSection: "All businesses",
      businessesSection: "Businesses",
    },
    empty: {
      noneInCategory: "No businesses in that category yet —",
      viewAll: "view all",
      noneYet: "There aren't any businesses on Zertoo Eats yet — you'll soon see the best places here.",
    },
    business: {
      backLink: "Zertoo Eats",
      viewMenu: "View menu",
    },
    actions: {
      directions: "Get directions",
      shareWhatsapp: "Share on WhatsApp",
      share: "Share",
      shareText: (name: string) => `Check out ${name} on Zertoo Eats`,
    },
  },
};
