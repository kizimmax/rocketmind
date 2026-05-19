"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type StudentProgramSummary = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  /** false = программа закрыта супер-админом → read-only режим + плашка подписки. */
  isActive: boolean;
  place: { id: string; name: string } | null;
};

export type StudentProjectSummary = {
  id: string;
  name: string;
  profile: Record<string, unknown> | null;
};

export type Student = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null; // «Роль в бизнесе»
  industry: string | null; // «Сфера деятельности»
  region: string | null; // «Регион»
  isActive: boolean;
  program: StudentProgramSummary | null;
  project: StudentProjectSummary | null;
};

interface AuthState {
  student: Student | null;
  isLoading: boolean;
  pendingEmail: string | null;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setStudent(null);
        return;
      }
      const data = await res.json();
      setStudent(data.student ?? null);
    } catch {
      setStudent(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const requestCode = useCallback(async (email: string) => {
    const res = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "request_failed");
    }
    setPendingEmail(email);
  }, []);

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!pendingEmail) return false;
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code }),
      });
      if (!res.ok) return false;
      await refresh();
      setPendingEmail(null);
      return true;
    },
    [pendingEmail, refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setStudent(null);
    setPendingEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ student, isLoading, pendingEmail, requestCode, verifyCode, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
