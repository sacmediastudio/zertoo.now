"use client";

import type { ReactNode } from "react";
import { useLang } from "@/lib/lang-context";
import type { LoyaltyAccountStep } from "@/lib/loyalty-account";

const INPUT = "w-full rounded-xl border border-graphite/10 bg-white px-3.5 py-3 text-sm text-graphite outline-none placeholder:text-graphite/50";
const PRIMARY = "w-full rounded-[14px] bg-lime py-3.5 text-center text-sm font-bold text-graphite disabled:opacity-60";

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />;
}

// Paso de verificación de correo — compartido entre Perfil y Mis sellos
// (port de AccountVerificationForm de la app nativa).
export default function AccountVerificationForm({
  step,
  email,
  setEmail,
  code,
  setCode,
  loading,
  error,
  onSendCode,
  onConfirmCode,
  introText,
  beforeEmail,
  afterEmail,
  sendCodeLabel,
  footerHint,
  canSubmit,
}: {
  step: LoyaltyAccountStep;
  email: string;
  setEmail: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSendCode: () => void;
  onConfirmCode: () => void;
  introText: string;
  beforeEmail?: ReactNode;
  afterEmail?: ReactNode;
  sendCodeLabel?: string;
  footerHint?: string;
  canSubmit?: boolean;
}) {
  const { t } = useLang();

  if (step === "loading") {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (step === "code") {
    return (
      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          onConfirmCode();
        }}
      >
        <p className="text-[13px] leading-[19px] text-graphite/60">{t.loyalty.codeSentMessage(email.trim())}</p>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-graphite/60">{t.loyalty.codeLabel}</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className={`${INPUT} text-lg font-bold tracking-[4px]`}
          />
        </label>
        {error && <p className="text-xs text-eats-special">{error}</p>}
        <button type="submit" disabled={loading || code.length !== 6} className={PRIMARY}>
          {loading ? <Spinner /> : t.loyalty.confirmCode}
        </button>
        <button type="button" onClick={onSendCode} disabled={loading} className="text-[13px] font-semibold text-graphite/60">
          {t.loyalty.resendCode}
        </button>
      </form>
    );
  }

  const disabled = loading || !email.trim() || canSubmit === false;
  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSendCode();
      }}
    >
      <p className="text-[13px] leading-[19px] text-graphite/60">{introText}</p>
      {beforeEmail}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-graphite/60">{t.loyalty.emailLabel}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.loyalty.emailPlaceholder}
          autoCapitalize="none"
          className={INPUT}
        />
      </label>
      {afterEmail}
      {error && <p className="text-xs text-eats-special">{error}</p>}
      <button type="submit" disabled={disabled} className={PRIMARY}>
        {loading ? <Spinner /> : sendCodeLabel ?? t.loyalty.sendCode}
      </button>
      {footerHint && <p className="text-center text-[11px] leading-[15px] text-graphite/50">{footerHint}</p>}
    </form>
  );
}
