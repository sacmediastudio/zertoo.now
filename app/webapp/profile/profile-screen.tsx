"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { subscribe } from "@/lib/eats-api";
import { useLoyaltyAccount } from "@/lib/loyalty-account";
import AccountVerificationForm from "../_components/account-verification-form";

const STORAGE_KEY = "zertoo_profile";
const INPUT = "w-full rounded-xl border border-graphite/10 bg-white px-3.5 py-3 text-sm text-graphite outline-none placeholder:text-graphite/50";

// Port web de ProfileScreen de la app nativa. Los avisos push de
// promos/specials solo existen en la app móvil.
export default function ProfileScreen() {
  const { lang, t } = useLang();
  const router = useRouter();
  const loyaltyAccount = useLoyaltyAccount();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as { name?: string; phone?: string };
      setName(stored.name ?? "");
      setPhone(stored.phone ?? "");
    } catch {
      // datos corruptos: se ignora y arranca en blanco
    }
  }, []);

  // Se llama una sola vez, apenas se confirma el código (registro inicial).
  async function registerSubscription(email: string) {
    setError(null);
    setSaved(false);
    try {
      await subscribe({
        name: name.trim() || undefined,
        email,
        phone: phone.trim() || undefined,
        notificationsEnabled: false,
        lang,
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone }));
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
      setName("");
      setPhone("");
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
          <AccountVerificationForm
            step={loyaltyAccount.step}
            email={loyaltyAccount.email}
            setEmail={loyaltyAccount.setEmail}
            code={loyaltyAccount.code}
            setCode={loyaltyAccount.setCode}
            loading={loyaltyAccount.loading}
            error={loyaltyAccount.error}
            onSendCode={loyaltyAccount.sendCode}
            onConfirmCode={() => loyaltyAccount.confirmCode((account) => registerSubscription(account.email))}
            introText={t.profile.verifyIntro}
            canSubmit={name.trim().length > 0}
            sendCodeLabel={t.profile.save}
            footerHint={t.profile.registerHint}
            beforeEmail={
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-graphite/60">{t.profile.name}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.profile.namePlaceholder} className={INPUT} />
              </label>
            }
            afterEmail={
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-graphite/60">{t.profile.phone}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.profile.phonePlaceholder}
                  className={INPUT}
                />
              </label>
            }
          />
        ) : (
          <>
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
