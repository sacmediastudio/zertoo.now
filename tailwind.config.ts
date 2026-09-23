import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Mismos colores de marca que el resto de Zertoo.
        graphite: "#002D09",
        lime: "#E7FF00",
        // Sumados para la landing — mismo rojo/coral que ya usa el
        // logo (logo.svg) y el resto de la marca como color de acento.
        coral: "#dd5152",
        charcoal: "#383738",
      },
    },
  },
  plugins: [],
};
export default config;
