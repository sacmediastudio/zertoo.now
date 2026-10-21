"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { subscribe } from "@/lib/eats-api";
import { useLoyaltyAccount } from "@/lib/loyalty-account";
import AuthForm from "../_components/auth-form";

const STORAGE_KEY = "zertoo_profile";

// Port web de ProfileScreen de la app nativa. Los avisos push de
// promos/specials solo existen en la app móvil.
export default function ProfileScreen() {
  const { lang, t } = useLang();
  const router = useRouter();
  const loyaltyAccount = useLoyaltyAccount();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Se llama una sola vez, apenas se confirma el código (registro inicial).
  async function registerSubscription(email: string, name: string | null) {
    setError(null);
    setSaved(false);
    try {
      await subscribe({
        name: name?.trim() || undefined,
        email,
        notificationsEnabled: false,
        lang,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(t.profile.saveFailed);
    }
  }

  async function handleDelete() {
    setConfirmDelete(false);
    try {
      await loyaltyAccount.deleteAccount();
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setError(t.profile.deleteAccountFailed);
    }
  }

  return (
    <div className="min-h-screen bg-eats-bg">
      <header className="bg-eats-header px-5 py-4">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <h1 className="text-base font-bold text-graphite">{t.profile.title}</h1>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
            aria-label="Close"
            className="text-base font-semibold text-graphite/60"
          >
            ✕
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-4 p-5">
        {loyaltyAccount.step !== "verified" ? (
          <AuthForm
            account={loyaltyAccount}
            introText={t.profile.verifyIntro}
            onVerified={(account) => registerSubscription(account.email, account.name)}
          />
        ) : (
          <>
            {loyaltyAccount.account?.name && (
              <p className="text-lg font-bold text-graphite">{t.profile.hello(loyaltyAccount.account.name)}</p>
            )}

            <Link
              href="/profile/loyalty"
              className="flex items-center justify-between rounded-xl bg-white px-3.5 py-3.5 text-sm font-semibold text-graphite"
            >
              {t.profile.viewLoyalty}
              <span className="text-lg text-graphite/50">›</span>
            </Link>

            <p className="rounded-xl bg-white px-3.5 py-3 text-[13px] leading-[19px] text-graphite/60">{t.profile.appOnlyAlerts}</p>

            {error && <p className="text-xs text-eats-special">{error}</p>}
            {saved && <p className="text-xs font-semibold text-graphite">{t.profile.saved}</p>}

            <button
              type="button"
              onClick={loyaltyAccount.logout}
              className="rounded-[14px] border border-graphite/10 bg-white py-3.5 text-sm font-bold text-graphite"
            >
              {t.profile.logout}
            </button>

            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="mt-2 self-center text-xs font-semibold text-eats-special"
            >
              {t.profile.deleteAccount}
            </button>
          </>
        )}
      </main>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={() => setConfirmDelete(false)}>
          <div className="w-full max-w-[340px] rounded-[20px] bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-graphite">{t.profile.deleteAccountConfirmTitle}</p>
            <p className="mt-2 text-[13px] leading-[19px] text-graphite/60">{t.profile.deleteAccountConfirmBody}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-[14px] border border-graphite/10 py-3 text-[13px] font-semibold text-graphite"
              >
                {t.profile.deleteAccountCancel}
              </button>
              <button type="button" onClick={handleDelete} className="flex-1 rounded-[14px] bg-eats-special py-3 text-[13px] font-bold text-white">
                {t.profile.deleteAccountConfirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
