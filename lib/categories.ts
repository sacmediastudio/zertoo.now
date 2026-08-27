export const CATEGORY_LABELS: Record<string, string> = {
  ITALIAN: "Italiana",
  FRENCH: "Francesa",
  LOCAL: "Local",
  COLOMBIAN: "Colombiana",
  MEXICAN: "Mexicana",
  INTERNATIONAL: "Internacional",
  ASIAN: "Asiática",
  JAPANESE: "Japonesa",
  CHINESE: "China",
  INDIAN: "India",
  STEAKHOUSE: "Steakhouse",
  SEAFOOD: "Mariscos",
  SUSHI: "Sushi",
  PIZZERIA: "Pizzería",
  BURGERS: "Hamburguesas",
  FAST_FOOD: "Comida rápida",
  BBQ_GRILL: "BBQ & Grill",
  CAFE: "Café",
  BAKERY_PASTRY: "Bakery & Pastry",
  BREAKFAST_BRUNCH: "Desayuno & Brunch",
  ICE_CREAM_GELATO: "Helados & Gelato",
  DESSERTS: "Postres",
  VEGETARIAN_VEGAN: "Vegetariana & Vegana",
  BAR_PUB: "Bar & Pub",
  BEACH_BAR: "Beach Bar",
  FOOD_TRUCK: "Food Truck",
};

// Zertoo Eats es solo para restaurantes — este segundo nivel de
// búsqueda (para "restaurantes" encuentre cualquiera sin importar su
// categoría específica) queda con un solo valor por ahora, pero se
// deja el mecanismo armado por si en algún momento se suma otro tipo
// de negocio de comida (ej. food trucks) que también valga la pena
// distinguir así.
export const BUSINESS_TYPE_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurante",
};
