"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getProfile,
  logout as apiLogout,
  requestCode as apiRequestCode,
  verifyCode as apiVerifyCode,
} from "./ivan-client";

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
      setStudent(await getProfile());
    } catch {
      setStudent(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const requestCode = useCallback(async (email: string) => {
    await apiRequestCode(email);
    setPendingEmail(email);
  }, []);

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!pendingEmail) return false;
      try {
        await apiVerifyCode(pendingEmail, code);
      } catch {
        return false;
      }
      await refresh();
      setPendingEmail(null);
      return true;
    },
    [pendingEmail, refresh],
  );

  const logout = useCallback(async () => {
    await apiLogout();
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
