// Cliente de la API pública de Zertoo Eats (saas-platform,
// /api/public/eats/*) — la misma que usa la app nativa. En el navegador
// se pasa por el proxy de este servidor (ver next.config.js).
const API_BASE = "/eats-api";

export interface CategoryOption {
  value: string;
  labelEs: string;
  labelEn: string;
}
export interface PriceRangeOption {
  value: string;
  label: string;
}
export type HoursStatus = "OPEN" | "CLOSED" | "OPENING_SOON" | "CLOSING_SOON";

export interface Listing {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  address: string | null;
  nowCategory: string | null;
  categoryLabelEs: string | null;
  categoryLabelEn: string | null;
  nowSecondaryCategory: string | null;
  secondaryCategoryLabelEs: string | null;
  secondaryCategoryLabelEn: string | null;
  nowPriceRange: string | null;
  priceRangeLabel: string | null;
  avgRating: number | null;
  reviewCount: number;
  distanceKm: number | null;
  nowFeatured: boolean;
  hasPromo: boolean;
  promoKind: "PROMO" | "SPECIAL" | null;
  hoursStatus: HoursStatus;
  hoursStatusLabelEs: string;
  hoursStatusLabelEn: string;
}

export interface ListingsResponse {
  spotlight: Listing[];
  featured: Listing[];
  rest: Listing[];
  nearby: Listing[] | null;
  nearMeActive: boolean;
  availableCategories: CategoryOption[];
  availablePriceRanges: PriceRangeOption[];
}

export interface PromotionSummary {
  id: string;
  kind: "PROMO" | "SPECIAL";
  title: string;
  description: string | null;
  imageUrl: string | null;
}

export interface BusinessDetailData {
  slug: string;
  name: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  categoryLabelEs: string | null;
  categoryLabelEn: string | null;
  address: string | null;
  contactPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  reservationUrl: string | null;
  avgRating: number | null;
  reviewCount: number;
  menuUrl: string;
  promotions: PromotionSummary[];
}

export interface ListingsParams {
  category?: string | null;
  secondaryCategory?: string | null;
  priceRange?: string | null;
  q?: string;
  lat?: number | null;
  lng?: number | null;
}

export async function fetchListings(params: ListingsParams = {}): Promise<ListingsResponse> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.secondaryCategory) search.set("secondaryCategory", params.secondaryCategory);
  if (params.priceRange) search.set("priceRange", params.priceRange);
  if (params.q) search.set("q", params.q);
  if (params.lat != null && params.lng != null) {
    search.set("lat", String(params.lat));
    search.set("lng", String(params.lng));
  }
  const qs = search.toString();
  const res = await fetch(`${API_BASE}/listings${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`listings failed: ${res.status}`);
  return res.json();
}

export async function fetchBusinessDetail(slug: string): Promise<BusinessDetailData> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`detail failed: ${res.status}`);
  return res.json();
}

export interface SubscribePayload {
  name?: string;
  email?: string;
  phone?: string;
  notificationsEnabled?: boolean;
  lang?: "es" | "en";
}

export async function subscribe(payload: SubscribePayload): Promise<void> {
  const res = await fetch(`${API_BASE}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
}

export interface MyLoyaltyCard {
  cardId: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
  active: boolean;
  stamps: number;
  visitsNeeded: number;
  reward: string;
  rewardsRedeemed: number;
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.error === "string") return body.error;
  } catch {
    // sin cuerpo JSON
  }
  return fallback;
}

export async function requestLoyaltyCode(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/loyalty-account/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo enviar el código."));
}

export async function confirmLoyaltyCode(email: string, code: string): Promise<string> {
  const res = await fetch(`${API_BASE}/loyalty-account/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo confirmar el código."));
  const body = await res.json();
  return body.accessToken as string;
}

export async function fetchMyLoyaltyCards(email: string, token: string): Promise<MyLoyaltyCard[]> {
  const search = new URLSearchParams({ email, token });
  const res = await fetch(`${API_BASE}/loyalty-account/cards?${search.toString()}`);
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudieron cargar tus sellos."));
  const body = await res.json();
  return body.cards as MyLoyaltyCard[];
}

export async function deleteLoyaltyAccount(email: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/loyalty-account/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo eliminar la cuenta."));
}
