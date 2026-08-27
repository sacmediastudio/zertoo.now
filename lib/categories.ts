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
