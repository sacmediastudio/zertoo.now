"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { fetchMyLoyaltyCards, type MyLoyaltyCard } from "@/lib/eats-api";
import { useLoyaltyAccount } from "@/lib/loyalty-account";
import AccountVerificationForm from "../../_components/account-verification-form";

// Port web de MyLoyaltyScreen de la app nativa ("Mis sellos").
export default function MyLoyaltyScreen() {
  const { t } = useLang();
  const router = useRouter();
  const loyaltyAccount = useLoyaltyAccount();
  const [cards, setCards] = useState<MyLoyaltyCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);

  useEffect(() => {
    if (loyaltyAccount.step !== "verified" || !loyaltyAccount.account) return;
    const acc = loyaltyAccount.account;
    setLoadingCards(true);
    setCardsError(null);
    fetchMyLoyaltyCards(acc.email, acc.accessToken)
      .then(setCards)
      .catch((err) => {
        // El token guardado ya no sirve: se limpia y se vuelve a pedir el correo.
        const message = err instanceof Error ? err.message : t.loyalty.genericError;
        setCardsError(message);
        loyaltyAccount.invalidate(message);
      })
      .finally(() => setLoadingCards(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loyaltyAccount.step, loyaltyAccount.account?.email]);

  return (
    <div className="min-h-screen bg-eats-bg">
      <header className="bg-eats-header px-5 py-4">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <h1 className="text-base font-bold text-graphite">{t.loyalty.title}</h1>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/profile"))}
            aria-label="Close"
            className="text-base font-semibold text-graphite/60"
          >
            ✕
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-3.5 p-5">
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
            onConfirmCode={() => loyaltyAccount.confirmCode()}
            introText={t.loyalty.subtitle}
          />
        ) : (
          <>
            {loadingCards && (
              <div className="flex justify-center py-6">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />
              </div>
            )}
            {!loadingCards && cards.length === 0 && <p className="text-[13px] leading-[19px] text-graphite/60">{t.loyalty.empty}</p>}
            {!loadingCards &&
              cards.map((card) => {
                const progress = Math.min(1, card.stamps / Math.max(1, card.visitsNeeded));
                return (
                  <div key={card.cardId} className="flex flex-col gap-2 rounded-[20px] bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-3">
                      {card.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.logoUrl} alt="" className="h-11 w-11 rounded-[10px] object-cover" />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-graphite text-base font-bold text-white">
                          {card.businessName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-graphite">{card.businessName}</p>
                        <p className="mt-0.5 text-xs text-graphite/60">{t.loyalty.stampsOf(card.stamps, card.visitsNeeded)}</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-eats-chip">
                      <div className="h-2 rounded bg-lime" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <p className="text-xs text-graphite/60">{card.reward}</p>
                    {!card.active && <p className="text-[11px] font-semibold text-eats-special">{t.loyalty.inactiveTag}</p>}
                  </div>
                );
              })}

            {cardsError && <p className="text-xs text-eats-special">{cardsError}</p>}
            <button type="button" onClick={loyaltyAccount.changeEmail} className="mt-2 text-center text-[13px] font-semibold text-graphite/60">
              {t.loyalty.changeEmail}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
