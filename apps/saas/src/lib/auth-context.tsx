"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { mockUser } from "./mock-data";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  /** Step 1: request code by email */
  requestCode: (email: string) => Promise<void>;
  /** Step 2: verify code */
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  /** Email stored between step 1 and step 2 */
  pendingEmail: string | null;
}

const AuthContext = createContext<AuthState | null>(null);

const AUTH_KEY = "rm_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Restore session from localStorage, or auto-login via ?autologin
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("autologin")) {
        const authedUser: User = {
          ...mockUser,
          last_login: new Date().toISOString(),
        };
        setUser(authedUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authedUser));
        setIsLoading(false);
        return;
      }

      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const requestCode = useCallback(async (email: string) => {
    // Mock: simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    setPendingEmail(email);
  }, []);

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      // Mock: simulate API delay
      await new Promise((r) => setTimeout(r, 800));

      // Mock: accept "123456" as valid code
      if (code === "123456") {
        const authedUser: User = {
          ...mockUser,
          email: pendingEmail ?? mockUser.email,
          last_login: new Date().toISOString(),
        };
        setUser(authedUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authedUser));
        setPendingEmail(null);
        return true;
      }
      return false;
    },
    [pendingEmail]
  );

  const logout = useCallback(() => {
    setUser(null);
    setPendingEmail(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, requestCode, verifyCode, logout, pendingEmail }}
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
