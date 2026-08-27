import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORY_LABELS } from "@/lib/categories";
import BusinessActions from "./business-actions";

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
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#e4f73e] px-5 py-6">
        <div className="max-w-xl mx-auto">
          <Link href="/" className="text-sm text-graphite/70 hover:text-graphite">
            ← Zertoo Eats
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-5">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col items-center text-center">
          {tenant.heroImageUrl ? (
            <div className="relative w-full aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tenant.heroImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2">
                {tenant.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-graphite text-white flex items-center justify-center text-2xl font-bold border-2 border-white shadow-lg">
                    {tenant.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ) : tenant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenant.logoUrl} alt={tenant.name} className="w-20 h-20 rounded-2xl object-cover mt-6" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-graphite text-white flex items-center justify-center text-2xl font-bold mt-6">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="p-6 pt-4 flex flex-col items-center text-center w-full">
            <p className="text-xl font-bold text-graphite">{tenant.name}</p>
            <div className="flex items-center gap-2 text-sm text-graphite/60 mt-2">
              {tenant.nowCategory && (
                <span className="bg-[#F7F8F4] px-2.5 py-1 rounded-full font-medium">
                  {CATEGORY_LABELS[tenant.nowCategory] ?? tenant.nowCategory}
                </span>
              )}
              {avgRating !== null && (
                <span>
                  ★ {avgRating.toFixed(1)} ({tenant.reviews.length})
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-3 w-full mt-4">
              <div className="text-left min-w-0 flex-1">
                {tenant.address && <p className="text-sm text-graphite/60">{tenant.address}</p>}
                {tenant.contactPhone && <p className="text-sm text-graphite/60 mt-1">{tenant.contactPhone}</p>}
              </div>
              <a
                href={`https://zertoo.app/menu/${tenant.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#e4f73e] text-graphite hover:brightness-95"
              >
                Ver menú
              </a>
            </div>
          </div>
        </div>

        <BusinessActions
          slug={tenant.slug}
          name={tenant.name}
          address={tenant.address}
          latitude={tenant.latitude}
          longitude={tenant.longitude}
          googleMapsUrl={tenant.googleMapsUrl}
        />
      </main>

      <footer className="text-center py-8 text-xs text-graphite/40">Un producto de Zertoo</footer>
    </div>
  );
}
