import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Mismos colores de marca que el resto de Zertoo.
        graphite: "#002D09",
        lime: "#E7FF00",
      },
    },
  },
  plugins: [],
};
export default config;
