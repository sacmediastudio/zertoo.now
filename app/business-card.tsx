"use client";

import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";
import { useLang } from "@/lib/lang-context";

export interface BusinessCardData {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  address: string | null;
  nowCategory: string | null;
  avgRating: number | null;
  reviewCount: number;
  distanceKm?: number | null;
}

export default function BusinessCard({ tenant }: { tenant: BusinessCardData }) {
  const { lang } = useLang();

  return (
    <Link
      href={`/${tenant.slug}`}
      className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] overflow-hidden flex items-center gap-4 p-4 hover:brightness-[0.98] transition-[filter]"
    >
      {tenant.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tenant.logoUrl} alt={tenant.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-graphite text-white flex items-center justify-center text-lg font-bold shrink-0">
          {tenant.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-graphite truncate">{tenant.name}</p>
        <div className="flex items-center gap-2 text-xs text-graphite/60 mt-0.5">
          {tenant.nowCategory && (
            <span className="bg-[#F7F8F4] px-2 py-0.5 rounded-full font-medium">
              {CATEGORY_LABELS[lang][tenant.nowCategory] ?? tenant.nowCategory}
            </span>
          )}
          {tenant.avgRating !== null && (
            <span>
              ★ {tenant.avgRating.toFixed(1)} ({tenant.reviewCount})
            </span>
          )}
          {tenant.distanceKm !== null && tenant.distanceKm !== undefined && (
            <span className="font-medium text-graphite">
              {tenant.distanceKm < 1 ? `${Math.round(tenant.distanceKm * 1000)} m` : `${tenant.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>
        {tenant.address && <p className="text-xs text-graphite/50 truncate mt-1">{tenant.address}</p>}
      </div>
    </Link>
  );
}
