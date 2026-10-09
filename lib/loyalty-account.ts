"use client";

import { useEffect, useState } from "react";
import { confirmLoyaltyCode, deleteLoyaltyAccount, requestLoyaltyCode } from "./eats-api";

// Misma lógica que useLoyaltyAccount de la app nativa, con
// localStorage en vez de AsyncStorage.
export const LOYALTY_ACCOUNT_STORAGE_KEY = "zertoo_loyalty_account";

export interface StoredLoyaltyAccount {
  email: string;
  accessToken: string;
}

export type LoyaltyAccountStep = "loading" | "email" | "code" | "verified";

export function useLoyaltyAccount() {
  const [step, setStep] = useState<LoyaltyAccountStep>("loading");
  const [account, setAccount] = useState<StoredLoyaltyAccount | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOYALTY_ACCOUNT_STORAGE_KEY);
      if (!raw) {
        setStep("email");
        return;
      }
      const stored: StoredLoyaltyAccount = JSON.parse(raw);
      setAccount(stored);
      setEmail(stored.email);
      setStep("verified");
    } catch {
      setStep("email");
    }
  }, []);

  async function sendCode() {
    setError(null);
    setLoading(true);
    try {
      await requestLoyaltyCode(email.trim());
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : null);
    } finally {
      setLoading(false);
    }
  }

  async function confirmCode(onVerified?: (account: StoredLoyaltyAccount) => void | Promise<void>) {
    setError(null);
    setLoading(true);
    try {
      const accessToken = await confirmLoyaltyCode(email.trim(), code.trim());
      const stored: StoredLoyaltyAccount = { email: email.trim(), accessToken };
      window.localStorage.setItem(LOYALTY_ACCOUNT_STORAGE_KEY, JSON.stringify(stored));
      setAccount(stored);
      setCode("");
      setStep("verified");
      if (onVerified) await onVerified(stored);
    } catch (err) {
      setError(err instanceof Error ? err.message : null);
    } finally {
      setLoading(false);
    }
  }

  function changeEmail() {
    window.localStorage.removeItem(LOYALTY_ACCOUNT_STORAGE_KEY);
    setAccount(null);
    setEmail("");
    setCode("");
    setError(null);
    setStep("email");
  }

  function invalidate(message: string | null) {
    window.localStorage.removeItem(LOYALTY_ACCOUNT_STORAGE_KEY);
    setAccount(null);
    setStep("email");
    setError(message);
  }

  // Eliminar la cuenta desde adentro (Apple 5.1.1). El error se deja
  // propagar para que quien llama no borre datos locales si falló.
  async function deleteAccount() {
    if (!account) return;
    setError(null);
    setLoading(true);
    try {
      await deleteLoyaltyAccount(account.email, account.accessToken);
      window.localStorage.removeItem(LOYALTY_ACCOUNT_STORAGE_KEY);
      setAccount(null);
      setEmail("");
      setCode("");
      setStep("email");
    } finally {
      setLoading(false);
    }
  }

  return { step, account, email, setEmail, code, setCode, loading, error, sendCode, confirmCode, changeEmail, invalidate, deleteAccount };
}
