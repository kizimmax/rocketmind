"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ClientPermission } from "@/lib/permissions-client";
import {
  getMe,
  logout as apiLogout,
  requestCode as apiRequestCode,
  verifyCode as apiVerifyCode,
} from "@/lib/ivan-client";

export interface CurrentUser {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  email: string | null;
}

interface AuthState {
  isAuthed: boolean;
  isLoading: boolean;
  currentUser: CurrentUser | null;
  permissions: ClientPermission[];
  pendingEmail: string | null;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [permissions, setPermissions] = useState<ClientPermission[]>([]);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const refreshMe = useCallback(async () => {
    const user = await getMe();
    setCurrentUser(user);
    setPermissions([]); // MVP: роль есть → полный доступ (SUPER_ADMIN байпасит слой)
  }, []);

  useEffect(() => {
    refreshMe().finally(() => setIsLoading(false));
  }, [refreshMe]);

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
      await refreshMe();
      setPendingEmail(null);
      return true;
    },
    [pendingEmail, refreshMe],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setCurrentUser(null);
    setPermissions([]);
    setPendingEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthed: currentUser !== null,
        isLoading,
        currentUser,
        permissions,
        pendingEmail,
        requestCode,
        verifyCode,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
