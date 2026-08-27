export const CATEGORY_LABELS: Record<string, string> = {
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

// Para que buscar "restaurantes" encuentre cualquier negocio de ese
// tipo, sin importar su categoría específica (que puede ser
// "Steakhouse", "Criolla", etc.) — un segundo nivel de texto buscable,
// más general que la categoría.
export const BUSINESS_TYPE_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurante",
  SMALL_BUSINESS: "Citas y servicios",
  SMARTLINK: "Smartlink",
};
