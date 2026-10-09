"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { fetchBusinessDetail, type BusinessDetailData } from "@/lib/eats-api";
import EatsLangSwitch from "../_components/eats-lang-switch";
import BottomNavBar from "../_components/bottom-nav-bar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zertooeats.com";

// Port web de BusinessDetailScreen de la app nativa.
export default function BusinessDetailScreen({ slug }: { slug: string }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [tenant, setTenant] = useState<BusinessDetailData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [promoOpen, setPromoOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetchBusinessDetail(slug)
      .then((data) => {
        if (cancelled) return;
        setTenant(data);
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const bottomNav = (
    <BottomNavBar
      onHomePress={() => router.push("/")}
      nearMeActive={false}
      onNearMeActivate={() => {}}
      onNearMeDeactivate={() => {}}
      onNearMePress={() => router.push("/")}
      onProfilePress={() => router.push("/profile")}
    />
  );

  if (state !== "ready" || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-eats-bg">
        {state === "loading" ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />
        ) : (
          <div className="flex flex-col items-center gap-3 px-5 text-center">
            <p className="text-[13px] text-graphite/60">{t.errors.loadFailed}</p>
            <Link href="/" className="rounded-[14px] bg-graphite px-4 py-2 text-[13px] font-semibold text-white">
              {t.business.backLink}
            </Link>
          </div>
        )}
        {bottomNav}
      </div>
    );
  }

  const categoryLabel = lang === "es" ? tenant.categoryLabelEs : tenant.categoryLabelEn;
  const hasSpecial = tenant.promotions.some((p) => p.kind === "SPECIAL");
  const shareUrl = `${SITE_URL}/${tenant.slug}`;
  const shareText = t.actions.shareText(tenant.name);

  // Prioridad: el link de Google Maps que cargó el negocio (su pin real) →
  // coordenadas geocodificadas → dirección en texto.
  const directionsUrl =
    tenant.googleMapsUrl ||
    (tenant.latitude !== null && tenant.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${tenant.latitude},${tenant.longitude}`
      : tenant.address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(tenant.address)}`
        : null);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`;

  async function handleShare() {
    try {
      await navigator.share({ title: tenant!.name, text: shareText, url: shareUrl });
    } catch {
      // el usuario canceló, no es un error real
    }
  }

  const logo = (cls: string, fallbackCls: string) =>
    tenant.logoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={tenant.logoUrl} alt={tenant.name} className={cls} />
    ) : (
      <div className={`${fallbackCls} flex items-center justify-center bg-graphite text-[26px] font-bold text-white`}>
        {tenant.name.charAt(0).toUpperCase()}
      </div>
    );

  return (
    <div className="min-h-screen bg-eats-bg pb-24">
      <header className="rounded-b-3xl bg-eats-header px-5 pb-4 pt-4">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="text-[13px] font-semibold text-graphite/60">
            ← {t.business.backLink}
          </Link>
          <EatsLangSwitch />
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-4 px-5 pt-5">
        <div className="flex flex-col items-center overflow-hidden rounded-[20px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          {tenant.heroImageUrl ? (
            <div className="relative aspect-square w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tenant.heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-1/2 top-5 -translate-x-1/2">
                {logo("h-20 w-20 rounded-2xl border-2 border-white object-cover", "h-20 w-20 rounded-2xl border-2 border-white")}
              </div>
            </div>
          ) : (
            <div className="mt-6">{logo("h-20 w-20 rounded-2xl object-cover", "h-20 w-20 rounded-2xl")}</div>
          )}

          <div className="flex w-full flex-col items-center p-5 pt-4">
            <p className="text-center text-[19px] font-bold text-graphite">{tenant.name}</p>
            <div className="mt-2 flex items-center gap-2">
              {categoryLabel && (
                <span className="rounded-full bg-eats-chip px-2.5 py-1 text-xs font-semibold text-graphite/60">{categoryLabel}</span>
              )}
              {tenant.avgRating !== null && (
                <span className="text-[13px] text-graphite/60">
                  ★ {tenant.avgRating.toFixed(1)} ({tenant.reviewCount})
                </span>
              )}
            </div>

            <div className="mt-4 flex w-full items-start gap-3">
              <div className="min-w-0 flex-1">
                {tenant.address && <p className="text-[13px] text-graphite/60">{tenant.address}</p>}
                {tenant.contactPhone && <p className="text-[13px] text-graphite/60">{tenant.contactPhone}</p>}
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {tenant.promotions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPromoOpen(true)}
                    className={`rounded-[10px] px-3.5 py-2 text-xs font-bold text-white ${hasSpecial ? "bg-eats-special" : "bg-eats-promo"}`}
                  >
                    {hasSpecial ? t.business.viewSpecial : t.business.viewPromo}
                  </button>
                )}
                <a
                  href={tenant.menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[10px] bg-lime px-3.5 py-2 text-xs font-bold text-graphite"
                >
                  {t.business.viewMenu}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-[14px] bg-graphite py-3.5 text-center text-[13px] font-bold text-white"
            >
              📍 {t.actions.directions}
            </a>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-[14px] bg-eats-whatsapp py-3.5 text-center text-[13px] font-bold text-white"
          >
            {t.actions.shareWhatsapp}
          </a>
          {tenant.reservationUrl ? (
            <a
              href={tenant.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-[14px] bg-lime py-3.5 text-center text-[13px] font-bold text-graphite"
            >
              {t.actions.bookNow}
            </a>
          ) : (
            canNativeShare && (
              <button
                type="button"
                onClick={handleShare}
                className="w-full rounded-[14px] border border-graphite/10 py-3.5 text-center text-[13px] font-bold text-graphite"
              >
                {t.actions.share}
              </button>
            )
          )}
        </div>

        <p className="py-6 text-center text-[11px] text-graphite/50">{t.footer}</p>
      </main>

      {bottomNav}

      {promoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={() => setPromoOpen(false)}>
          <div
            className="max-h-[85vh] w-full max-w-[360px] overflow-y-auto rounded-[20px] bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite/50">{t.business.promoTitle}</p>
              <button type="button" onClick={() => setPromoOpen(false)} className="text-base font-semibold text-graphite/50" aria-label="Close">
                ✕
              </button>
            </div>
            {tenant.promotions.map((promo, idx) => (
              <div key={promo.id} className={`flex flex-col gap-1.5 ${idx > 0 ? "mt-4 border-t border-graphite/10 pt-4" : ""}`}>
                {promo.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.imageUrl} alt="" className="mb-1 aspect-video w-full rounded-xl object-cover" />
                )}
                <span
                  className={`self-start rounded-full px-[9px] py-[3px] text-[10px] font-bold uppercase tracking-[0.3px] text-white ${
                    promo.kind === "SPECIAL" ? "bg-eats-special" : "bg-eats-promo"
                  }`}
                >
                  {promo.kind === "SPECIAL" ? t.business.specialTag : t.business.promoTag}
                </span>
                <p className="text-base font-bold text-graphite">{promo.title}</p>
                {promo.description && <p className="text-[13px] leading-[19px] text-graphite/60">{promo.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
