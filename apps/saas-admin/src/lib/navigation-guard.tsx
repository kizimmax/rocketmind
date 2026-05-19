"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface NavigationGuardContextValue {
  /** Editor calls this to sync dirty state */
  setDirty: (dirty: boolean) => void;
  /** Links call this — returns true if safe to navigate, false if blocked */
  tryNavigate: (href: string) => boolean;
  /** Href that was blocked (EditorShell watches this to show dialog) */
  pendingHref: string | null;
  /** Clear pending navigation (cancel) */
  clearPending: () => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue>({
  setDirty: () => {},
  tryNavigate: () => true,
  pendingHref: null,
  clearPending: () => {},
});

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const dirtyRef = useRef(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const tryNavigate = useCallback((href: string): boolean => {
    if (!dirtyRef.current) return true;
    setPendingHref(href);
    return false;
  }, []);

  const clearPending = useCallback(() => setPendingHref(null), []);

  return (
    <NavigationGuardContext.Provider
      value={{ setDirty, tryNavigate, pendingHref, clearPending }}
    >
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}
