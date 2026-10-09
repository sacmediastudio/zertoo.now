import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      colors: {
        // Mismos colores de marca que el resto de Zertoo.
        graphite: "#002D09",
        lime: "#E7FF00",
        // Sumados para la landing — mismo rojo/coral que ya usa el
        // logo (logo.svg) y el resto de la marca como color de acento.
        coral: "#dd5152",
        charcoal: "#2D2B2C",
        cream: "#FCFCF7",
        // Paleta de la app de consumidor (mismos valores que la app nativa).
        eats: {
          header: "#e4f73e",
          bg: "#F5F5F5",
          chip: "#F7F8F4",
          secondary: "#0a2808",
          promo: "#FF7A1A",
          special: "#E5352B",
          open: "#1E8E3E",
          amber: "#C98A00",
          whatsapp: "#25D366",
        },
      },
    },
  },
  plugins: [],
};
export default config;
