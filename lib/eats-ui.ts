import type { HoursStatus, Listing } from "./eats-api";
import type { Lang } from "./i18n";

// Color del punto + texto de "Abierto / Cerrado..." — mismos valores que la app nativa.
export function hoursStatusColor(status: HoursStatus): string {
  if (status === "OPEN") return "#1E8E3E";
  if (status === "OPENING_SOON" || status === "CLOSING_SOON") return "#C98A00";
  return "rgba(0,45,9,0.5)";
}

export function listingLabels(tenant: Listing, lang: Lang) {
  return {
    category: lang === "es" ? tenant.categoryLabelEs : tenant.categoryLabelEn,
    secondary: lang === "es" ? tenant.secondaryCategoryLabelEs : tenant.secondaryCategoryLabelEn,
    hours: lang === "es" ? tenant.hoursStatusLabelEs : tenant.hoursStatusLabelEn,
  };
}

export const SOFT_SHADOW = "shadow-[0_8px_20px_rgba(0,0,0,0.06)]";
