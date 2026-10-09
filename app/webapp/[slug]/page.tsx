import type { Metadata } from "next";
import BusinessDetailScreen from "./business-detail-screen";

export const dynamic = "force-dynamic";

// Los datos de la pantalla se cargan en el navegador (misma API que la
// app nativa); acá solo se arman los metadatos para que al compartir el
// link por WhatsApp/redes salga la foto y el nombre del negocio.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Misma API pública que usa la pantalla (y la app nativa), consultada
  // desde el servidor — la web ya no necesita acceso propio a la base.
  const res = await fetch(`https://zertoo.app/api/public/eats/${encodeURIComponent(params.slug)}`, { cache: "no-store" }).catch(
    () => null
  );
  if (!res?.ok) return { title: "Zertoo Eats!" };
  const tenant: { name: string; logoUrl: string | null; heroImageUrl: string | null } = await res.json();

  const title = `${tenant.name} | Zertoo Eats!`;
  const description = `Mira ${tenant.name} en Zertoo Eats — recomendaciones, calificación y cómo llegar.`;
  const image = tenant.heroImageUrl || tenant.logoUrl || undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default function BusinessPage({ params }: { params: { slug: string } }) {
  return <BusinessDetailScreen slug={params.slug} />;
}
