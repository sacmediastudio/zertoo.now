"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  deleteLoyaltyAccount,
  loginAccount,
  registerAccount,
  requestPasswordReset,
  resetPassword,
  verifyAccount,
  type AccountSession,
} from "./eats-api";
import { useLang } from "./lang-context";

// Misma lógica que useLoyaltyAccount de la app nativa (cuenta con
// contraseña), con localStorage en vez de AsyncStorage.
export const LOYALTY_ACCOUNT_STORAGE_KEY = "zertoo_loyalty_account";

export interface StoredLoyaltyAccount {
  email: string;
  accessToken: string;
  name: string | null;
}

// loading → carga la sesión guardada
// login / register / forgot → formularios (pestañas Ingresar / Registrarse
//   y "olvidé mi contraseña")
// verifyCode → código del registro (activa la cuenta)
// resetCode → código + contraseña nueva (recuperación)
// verified → sesión iniciada
export type LoyaltyAccountStep = "loading" | "login" | "register" | "forgot" | "verifyCode" | "resetCode" | "verified";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoyaltyAccount() {
  const { lang, t } = useLang();
  const [step, setStep] = useState<LoyaltyAccountStep>("loading");
  const [account, setAccount] = useState<StoredLoyaltyAccount | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOYALTY_ACCOUNT_STORAGE_KEY);
      if (!raw) {
        setStep("login");
        return;
      }
      const stored: StoredLoyaltyAccount = JSON.parse(raw);
      if (!stored.email || !stored.accessToken) throw new Error("bad session");
      setAccount({ ...stored, name: stored.name ?? null });
      setEmail(stored.email);
      setStep("verified");
    } catch {
      setStep("login");
    }
  }, []);

  function fail(err: unknown) {
    setError(err instanceof Error && err.message ? err.message : t.auth.errors.generic);
  }

  function goTo(next: "login" | "register" | "forgot") {
    setError(null);
    setNotice(null);
    setCode("");
    setPassword("");
    setStep(next);
  }

  function saveSession(session: AccountSession, fallbackName?: string): StoredLoyaltyAccount {
    const stored: StoredLoyaltyAccount = {
      email: email.trim().toLowerCase(),
      accessToken: session.accessToken,
      name: session.name ?? fallbackName ?? null,
    };
    window.localStorage.setItem(LOYALTY_ACCOUNT_STORAGE_KEY, JSON.stringify(stored));
    setAccount(stored);
    setCode("");
    setPassword("");
    setNotice(null);
    setStep("verified");
    return stored;
  }

  function validateEmail(): boolean {
    if (!EMAIL_RE.test(email.trim())) {
      setError(t.auth.errors.emailInvalid);
      return false;
    }
    return true;
  }

  async function register() {
    setError(null);
    setNotice(null);
    if (!name.trim()) return setError(t.auth.errors.nameRequired);
    if (!validateEmail()) return;
    if (password.length < 8) return setError(t.auth.errors.passwordShort);
    setLoading(true);
    try {
      await registerAccount({ name: name.trim(), email: email.trim(), password, lang });
      setCode("");
      setStep("verifyCode");
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  // onVerified corre justo después de guardar la sesión (solo al activar
  // una cuenta nueva) — el perfil lo usa para registrar el contacto.
  async function verify(onVerified?: (account: StoredLoyaltyAccount) => void | Promise<void>) {
    setError(null);
    setLoading(true);
    try {
      const session = await verifyAccount(email.trim(), code.trim());
      const stored = saveSession(session, name.trim());
      if (onVerified) await onVerified(stored);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setError(null);
    setNotice(null);
    if (!validateEmail()) return;
    if (!password) return setError(t.auth.errors.passwordRequired);
    setLoading(true);
    try {
      saveSession(await loginAccount(email.trim(), password, lang));
    } catch (err) {
      // Se registró pero nunca confirmó el correo: el servidor ya le mandó
      // un código nuevo, se lo pedimos directo.
      if (err instanceof ApiError && err.code === "UNVERIFIED" && err.status === 403) {
        setCode("");
        setStep("verifyCode");
        setNotice(t.auth.codeResent);
      } else {
        fail(err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendResetCode() {
    setError(null);
    setNotice(null);
    if (!validateEmail()) return;
    setLoading(true);
    try {
      await requestPasswordReset(email.trim(), lang);
      setCode("");
      setPassword("");
      setStep("resetCode");
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  async function confirmReset() {
    setError(null);
    if (password.length < 8) return setError(t.auth.errors.passwordShort);
    setLoading(true);
    try {
      saveSession(await resetPassword(email.trim(), code.trim(), password));
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  // Reenvía el código del paso actual: recuperación, registro (con el
  // nombre ya escrito) o registro retomado desde "Ingresar" (sin nombre
  // en memoria — ahí el servidor reenvía al intentar el login).
  async function resendCode() {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (step === "resetCode") {
        await requestPasswordReset(email.trim(), lang);
      } else if (name.trim()) {
        await registerAccount({ name: name.trim(), email: email.trim(), password, lang });
      } else {
        await loginAccount(email.trim(), password, lang);
      }
      setNotice(t.auth.codeResent);
    } catch (err) {
      // 403 + UNVERIFIED = el servidor sí reenvió el código (el 429 es el enfriamiento).
      if (err instanceof ApiError && err.code === "UNVERIFIED" && err.status === 403) {
        setNotice(t.auth.codeResent);
      } else {
        fail(err);
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem(LOYALTY_ACCOUNT_STORAGE_KEY);
    setAccount(null);
    setEmail("");
    setName("");
    setPassword("");
    setCode("");
    setError(null);
    setNotice(null);
    setStep("login");
  }

  // Cuando el accessToken guardado ya no sirve (ej. se cambió la
  // contraseña desde otro dispositivo) — se limpia y se vuelve a pedir.
  function invalidate(message: string | null) {
    window.localStorage.removeItem(LOYALTY_ACCOUNT_STORAGE_KEY);
    setAccount(null);
    setPassword("");
    setStep("login");
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
      setName("");
      setPassword("");
      setCode("");
      setStep("login");
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    account,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    loading,
    error,
    notice,
    goTo,
    register,
    verify,
    login,
    sendResetCode,
    confirmReset,
    resendCode,
    logout,
    invalidate,
    deleteAccount,
  };
}

export type LoyaltyAccountState = ReturnType<typeof useLoyaltyAccount>;
