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
    taglinePart1: "Descubre dónde comer,",
    taglinePart2: "¡ahora mismo!",
    all: "Todas",
    categoryTitle: "Categoría",
    priceRangeAll: "Precio",
    priceRangeTitle: "Rango de precio",
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
    landing: {
      nav: {
        webApp: "App Web",
        business: "Zertoo Businesses",
        contact: "Contacto",
        getApp: "Descargar App",
      },
      hero: {
        eyebrow: "Buena comida. Buenos lugares.",
        titlePrefix: "Encuentra tu próximo lugar",
        titleHighlight: "favorito.",
        subtitle: "Menús, lugares, promociones y más. Todo en una sola app.",
        handNote: ["Buena Comida", "Más Cerca", "de Ti"],
      },
      categories: {
        titlePrefix: "Todo lo que se te antoje,",
        titleHighlight: "aquí mismo.",
        subtitle: "Explora restaurantes por categoría, mirá menús, encontrá promociones y cómo llegar.",
        burgers: "Hamburguesas",
        pizza: "Pizza",
        sushi: "Sushi",
        bars: "Bares",
        cafes: "Cafés",
        more: "Y más",
      },
      appShowcase: {
        titleLine1: "Menús, Lugares",
        titleHighlight: "y Promociones.",
        subtitle: "Descubrí restaurantes increíbles en Aruba. Rápido, fácil y delicioso.",
        findNearby: "Cerca tuyo",
        viewMenus: "Ver menús",
        exclusiveDeals: "Promociones exclusivas",
        saveFavorites: "Guardá tus favoritos",
        getApp: "Descargar App",
        handNote: ["Buena", "Comida", "Sucede", "Aquí"],
      },
      discover: {
        titlePrefix: "Descubrí más.",
        titleHighlight: "Comé mejor.",
        subtitle: "De favoritos locales a joyas escondidas, ZertooEats trae lo mejor de Aruba a la palma de tu mano.",
        cta: "Explorar Restaurantes",
      },
      cta: {
        titlePrefix: "Tu próximo bocado está",
        titleHighlight: "más cerca de lo que creés.",
        subtitle: "Buena comida. Buenos lugares. Una búsqueda fácil.",
        download: "Descargar Ahora",
        handNote: ["Buena", "Comida", "Buen", "Ánimo"],
      },
      footer: {
        tagline: "Aruba sabe mejor en compañía",
        forBusiness: "Para Negocios",
        contact: "Contacto",
        privacy: "Privacidad",
        rights: "Todos los derechos reservados.",
      },
      storeBadges: {
        appStoreLine1: "Disponible en",
        appStoreLine2: "App Store",
        playStoreLine1: "Disponible en",
        playStoreLine2: "Google Play",
      },
    },
  },
  en: {
    taglinePart1: "Discover where to eat,",
    taglinePart2: "right now!",
    all: "All",
    categoryTitle: "Category",
    priceRangeAll: "Price",
    priceRangeTitle: "Price range",
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
    landing: {
      nav: {
        webApp: "Web App",
        business: "Zertoo Businesses",
        contact: "Contact",
        getApp: "Get the App",
      },
      hero: {
        eyebrow: "Good food. Great places.",
        titlePrefix: "Find your next favorite",
        titleHighlight: "spot.",
        subtitle: "Menus, places, deals and more. All in one app.",
        handNote: ["Good Food", "Closer", "to You"],
      },
      categories: {
        titlePrefix: "Everything you crave,",
        titleHighlight: "right here.",
        subtitle: "Explore restaurants by category, see menus, find deals and get directions.",
        burgers: "Burgers",
        pizza: "Pizza",
        sushi: "Sushi",
        bars: "Bars",
        cafes: "Cafés",
        more: "And more",
      },
      appShowcase: {
        titleLine1: "Menus, Places",
        titleHighlight: "& Deals.",
        subtitle: "Discover amazing restaurants in Aruba. Fast, easy and delicious.",
        findNearby: "Find nearby",
        viewMenus: "View menus",
        exclusiveDeals: "Exclusive deals",
        saveFavorites: "Save your favorites",
        getApp: "Get the App",
        handNote: ["Good", "Food", "Happens", "Here"],
      },
      discover: {
        titlePrefix: "Discover more.",
        titleHighlight: "Eat better.",
        subtitle: "From local favorites to hidden gems, ZertooEats brings the best of Aruba right to your fingertips.",
        cta: "Explore Restaurants",
      },
      cta: {
        titlePrefix: "Your next bite is closer",
        titleHighlight: "than you think.",
        subtitle: "Good food. Great places. One easy search.",
        download: "Download Now",
        handNote: ["Good", "Food", "Good", "Mood"],
      },
      footer: {
        tagline: "Aruba tastes better together",
        forBusiness: "For Business",
        contact: "Contact",
        privacy: "Privacy",
        rights: "All rights reserved.",
      },
      storeBadges: {
        appStoreLine1: "Download on the",
        appStoreLine2: "App Store",
        playStoreLine1: "Get it on",
        playStoreLine2: "Google Play",
      },
    },
  },
};
