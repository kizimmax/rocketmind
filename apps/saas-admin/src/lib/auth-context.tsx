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
  login: (login: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);
const TOKEN_KEY = "rm_admin_token";
const USER_KEY = "rm_admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [permissions, setPermissions] = useState<ClientPermission[]>([]);

  const refreshMe = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        // Session went stale (token invalidated, user frozen, etc.). Hard reset.
        setIsAuthed(false);
        setCurrentUser(null);
        setPermissions([]);
        try {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } catch { /* ignore */ }
        return;
      }
      const data = (await res.json()) as { user: CurrentUser; permissions: ClientPermission[] };
      setCurrentUser(data.user);
      setPermissions(data.permissions ?? []);
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch { /* ignore */ }
    } catch {
      /* keep current state on transient network errors */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      if (token) {
        setIsAuthed(true);
        if (userJson) setCurrentUser(JSON.parse(userJson) as CurrentUser);
      }
    } catch { /* ignore */ }
    setIsLoading(false);

    // Always re-fetch /me when there's a token, to pick up permission/role
    // changes the user couldn't see otherwise.
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        refreshMe().catch(() => { /* handled inside */ });
      }
    } catch { /* ignore */ }
    return () => { cancelled = true; void cancelled; };
  }, [refreshMe]);

  const login = useCallback(async (loginValue: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginValue, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        return { ok: false, error: body?.error };
      }
      const data = (await res.json()) as { token?: string; user?: CurrentUser };
      if (!data.token || !data.user) return { ok: false, error: "invalid_response" };
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setIsAuthed(true);
      setCurrentUser(data.user);
      await refreshMe();
      return { ok: true };
    } catch {
      return { ok: false, error: "network" };
    }
  }, [refreshMe]);

  const logout = useCallback(() => {
    setIsAuthed(false);
    setCurrentUser(null);
    setPermissions([]);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed, isLoading, currentUser, permissions, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
