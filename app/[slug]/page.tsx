import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import BusinessDetail from "./business-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tenant = await db.tenant.findUnique({
    where: { slug: params.slug },
    select: { name: true, logoUrl: true, heroImageUrl: true, nowEnabled: true },
  });
  if (!tenant || !tenant.nowEnabled) return { title: "Zertoo Eats!" };

  const title = `${tenant.name} | Zertoo Eats!`;
  const description = `Mirá ${tenant.name} en Zertoo Eats — recomendaciones, calificación y cómo llegar.`;
  const image = tenant.heroImageUrl || tenant.logoUrl || undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const tenant = await db.tenant.findUnique({
    where: { slug: params.slug },
    include: { reviews: { where: { status: "PUBLISHED" } } },
  });
  if (!tenant || !tenant.nowEnabled) notFound();

  const avgRating =
    tenant.reviews.length > 0 ? tenant.reviews.reduce((sum, r) => sum + r.rating, 0) / tenant.reviews.length : null;

  return (
    <BusinessDetail
      tenant={{
        slug: tenant.slug,
        name: tenant.name,
        logoUrl: tenant.logoUrl,
        heroImageUrl: tenant.heroImageUrl,
        nowCategory: tenant.nowCategory,
        address: tenant.address,
        contactPhone: tenant.contactPhone,
        latitude: tenant.latitude,
        longitude: tenant.longitude,
        googleMapsUrl: tenant.googleMapsUrl,
      }}
      avgRating={avgRating}
      reviewCount={tenant.reviews.length}
    />
  );
}
