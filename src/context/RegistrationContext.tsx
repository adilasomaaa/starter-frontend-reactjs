// src/context/RegistrationContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type RegistrationContextType = {
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  clear: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

const KEY = "register:pendingEmail";
const TEN_MINUTES = 10 * 60 * 1000; // 10 menit dalam ms

type StoredValue = {
  email: string;
  expiresAt: number;
};

export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingEmail, setPendingEmailState] = useState<string | null>(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      const parsed: StoredValue = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(KEY);
        return null;
      }
      return parsed.email;
    } catch {
      return null;
    }
  });

  const setPendingEmail = (email: string | null) => {
    if (!email) {
      sessionStorage.removeItem(KEY);
      setPendingEmailState(null);
      return;
    }
    const value: StoredValue = {
      email,
      expiresAt: Date.now() + TEN_MINUTES,
    };
    sessionStorage.setItem(KEY, JSON.stringify(value));
    setPendingEmailState(email);
  };

  const clear = () => {
    sessionStorage.removeItem(KEY);
    setPendingEmailState(null);
  };

  // ⏱️ Timer untuk auto-clear ketika expired
  useEffect(() => {
    if (!pendingEmail) return;

    const raw = sessionStorage.getItem(KEY);
    if (!raw) return;

    const parsed: StoredValue = JSON.parse(raw);
    const timeout = parsed.expiresAt - Date.now();
    if (timeout <= 0) {
      clear();
      return;
    }

    const id = setTimeout(() => clear(), timeout);
    return () => clearTimeout(id);
  }, [pendingEmail]);

  return (
    <RegistrationContext.Provider
      value={{ pendingEmail, setPendingEmail, clear }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error("useRegistration must be used inside RegistrationProvider");
  return ctx;
}
