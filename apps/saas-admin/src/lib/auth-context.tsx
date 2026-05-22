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
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      if (!res.ok) {
        setCurrentUser(null);
        setPermissions([]);
        return;
      }
      const data = (await res.json()) as { user: CurrentUser; permissions: ClientPermission[] };
      setCurrentUser(data.user);
      setPermissions(data.permissions ?? []);
    } catch {
      /* keep current state on transient network errors */
    }
  }, []);

  useEffect(() => {
    refreshMe().finally(() => setIsLoading(false));
  }, [refreshMe]);

  const requestCode = useCallback(async (email: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? "request_failed");
    }
    setPendingEmail(email);
  }, []);

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!pendingEmail) return false;
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code }),
      });
      if (!res.ok) return false;
      await refreshMe();
      setPendingEmail(null);
      return true;
    },
    [pendingEmail, refreshMe],
  );

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
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
