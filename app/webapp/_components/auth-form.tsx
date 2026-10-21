"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import type { LoyaltyAccountState } from "@/lib/loyalty-account";

const INPUT = "w-full rounded-xl border border-graphite/10 bg-white px-3.5 py-3 text-sm text-graphite outline-none placeholder:text-graphite/50";
const PRIMARY = "w-full rounded-[14px] bg-lime py-3.5 text-center text-sm font-bold text-graphite disabled:opacity-60";
const LINK = "text-[13px] font-semibold text-graphite/60";

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-graphite/30 border-t-graphite" />;
}

// Registro / ingreso de la cuenta de Zertoo Eats: pestañas Ingresar y
// Registrarse, código de verificación por correo y recuperación de
// contraseña (port de AuthForm de la app nativa).
export default function AuthForm({
  account,
  introText,
  onVerified,
}: {
  account: LoyaltyAccountState;
  introText: string;
  // Corre solo cuando una cuenta NUEVA queda activada (no en cada ingreso).
  onVerified?: Parameters<LoyaltyAccountState["verify"]>[0];
}) {
  const { t } = useLang();
  const [showPassword, setShowPassword] = useState(false);
  const { step, loading, error, notice } = account;

  if (step === "loading") {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  const messages = (
    <>
      {error && (
        <p role="alert" className="text-xs text-eats-special">
          {error}
        </p>
      )}
      {notice && !error && <p className="text-xs text-graphite/60">{notice}</p>}
    </>
  );

  const emailField = (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-graphite/60">{t.auth.emailLabel}</span>
      <input
        type="email"
        value={account.email}
        onChange={(e) => account.setEmail(e.target.value)}
        placeholder={t.auth.emailPlaceholder}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="email"
        className={INPUT}
      />
    </label>
  );

  const passwordField = (label: string, mode: "login" | "new") => (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-graphite/60">{label}</span>
      <span className="relative block">
        <input
          type={showPassword ? "text" : "password"}
          value={account.password}
          onChange={(e) => account.setPassword(e.target.value)}
          placeholder={mode === "new" ? t.auth.passwordPlaceholder : undefined}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete={mode === "new" ? "new-password" : "current-password"}
          className={`${INPUT} pr-20`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 py-1.5 text-xs font-bold text-graphite/60"
        >
          {showPassword ? t.auth.hidePassword : t.auth.showPassword}
        </button>
      </span>
    </label>
  );

  const codeField = (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-graphite/60">{t.auth.codeLabel}</span>
      <input
        value={account.code}
        onChange={(e) => account.setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        className={`${INPUT} text-lg font-bold tracking-[4px]`}
      />
    </label>
  );

  const submit = (label: string, disabled = false) => (
    <button type="submit" disabled={loading || disabled} className={PRIMARY}>
      {loading ? <Spinner /> : label}
    </button>
  );

  if (step === "verifyCode") {
    return (
      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          account.verify(onVerified);
        }}
      >
        <p className="text-[13px] leading-[19px] text-graphite/60">{t.auth.codeSentMessage(account.email.trim())}</p>
        {codeField}
        {messages}
        {submit(t.auth.verifyButton, account.code.length !== 6)}
        <button type="button" onClick={account.resendCode} disabled={loading} className={LINK}>
          {t.auth.resendCode}
        </button>
        <button type="button" onClick={() => account.goTo("register")} className={LINK}>
          {t.auth.useOtherEmail}
        </button>
      </form>
    );
  }

  if (step === "forgot") {
    return (
      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          account.sendResetCode();
        }}
      >
        <p className="text-base font-bold text-graphite">{t.auth.forgotTitle}</p>
        <p className="text-[13px] leading-[19px] text-graphite/60">{t.auth.forgotIntro}</p>
        {emailField}
        {messages}
        {submit(t.auth.sendResetCode, !account.email.trim())}
        <button type="button" onClick={() => account.goTo("login")} className={LINK}>
          {t.auth.backToLogin}
        </button>
      </form>
    );
  }

  if (step === "resetCode") {
    return (
      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          account.confirmReset();
        }}
      >
        <p className="text-base font-bold text-graphite">{t.auth.forgotTitle}</p>
        <p className="text-[13px] leading-[19px] text-graphite/60">{t.auth.codeSentMessage(account.email.trim())}</p>
        {codeField}
        {passwordField(t.auth.newPasswordLabel, "new")}
        {messages}
        {submit(t.auth.resetButton, account.code.length !== 6 || !account.password)}
        <button type="button" onClick={account.resendCode} disabled={loading} className={LINK}>
          {t.auth.resendCode}
        </button>
        <button type="button" onClick={() => account.goTo("login")} className={LINK}>
          {t.auth.backToLogin}
        </button>
      </form>
    );
  }

  const isRegister = step === "register";
  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (isRegister) account.register();
        else account.login();
      }}
    >
      <div role="tablist" className="flex rounded-[14px] bg-eats-chip p-1">
        {(["login", "register"] as const).map((tab) => {
          const active = step === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => !active && account.goTo(tab)}
              className={`flex-1 rounded-[12px] py-2.5 text-[13px] ${active ? "bg-white font-bold text-graphite" : "font-semibold text-graphite/60"}`}
            >
              {tab === "login" ? t.auth.tabLogin : t.auth.tabRegister}
            </button>
          );
        })}
      </div>

      <p className="text-[13px] leading-[19px] text-graphite/60">{introText}</p>

      {isRegister && (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-graphite/60">{t.auth.nameLabel}</span>
          <input
            value={account.name}
            onChange={(e) => account.setName(e.target.value)}
            placeholder={t.auth.namePlaceholder}
            autoComplete="name"
            className={INPUT}
          />
        </label>
      )}
      {emailField}
      {passwordField(t.auth.passwordLabel, isRegister ? "new" : "login")}
      {messages}
      {submit(isRegister ? t.auth.registerButton : t.auth.loginButton)}
      {!isRegister && (
        <button type="button" onClick={() => account.goTo("forgot")} className={LINK}>
          {t.auth.forgotLink}
        </button>
      )}
    </form>
  );
}
