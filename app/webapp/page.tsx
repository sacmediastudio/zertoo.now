import HomeScreen from "./home-screen";

// La lista, los filtros y la búsqueda se resuelven en el navegador contra
// la misma API pública que usa la app nativa (ver lib/eats-api.ts) — así
// la web y la app muestran siempre exactamente lo mismo.
export default function HomePage() {
  return <HomeScreen />;
}
