import type { Lang } from "./i18n";

export const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  es: {
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
  },
  en: {
    ITALIAN: "Italian",
    FRENCH: "French",
    LOCAL: "Local",
    COLOMBIAN: "Colombian",
    MEXICAN: "Mexican",
    INTERNATIONAL: "International",
    ASIAN: "Asian",
    JAPANESE: "Japanese",
    CHINESE: "Chinese",
    INDIAN: "Indian",
    STEAKHOUSE: "Steakhouse",
    SEAFOOD: "Seafood",
    SUSHI: "Sushi",
    PIZZERIA: "Pizzeria",
    BURGERS: "Burgers",
    FAST_FOOD: "Fast Food",
    BBQ_GRILL: "BBQ & Grill",
    CAFE: "Café",
    BAKERY_PASTRY: "Bakery & Pastry",
    BREAKFAST_BRUNCH: "Breakfast & Brunch",
    ICE_CREAM_GELATO: "Ice Cream & Gelato",
    DESSERTS: "Desserts",
    VEGETARIAN_VEGAN: "Vegetarian & Vegan",
    BAR_PUB: "Bar & Pub",
    BEACH_BAR: "Beach Bar",
    FOOD_TRUCK: "Food Truck",
  },
};

// Zertoo Eats es solo para restaurantes — este segundo nivel de
// búsqueda (para "restaurantes"/"restaurants" encuentre cualquiera sin
// importar su categoría específica) queda con un solo valor por
// ahora, pero se deja el mecanismo armado por si en algún momento se
// suma otro tipo de negocio de comida que también valga la pena
// distinguir así.
export const BUSINESS_TYPE_LABELS: Record<Lang, Record<string, string>> = {
  es: {
    RESTAURANT: "Restaurante",
  },
  en: {
    RESTAURANT: "Restaurant",
  },
};
