"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Track visual viewport height to keep layout above virtual keyboard (iOS/Android)
  useEffect(() => {
    function updateHeight() {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${h}px`);
    }

    updateHeight();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateHeight);
      vv.addEventListener("scroll", updateHeight);
      return () => {
        vv.removeEventListener("resize", updateHeight);
        vv.removeEventListener("scroll", updateHeight);
      };
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-shell flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile: header + content stacked */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
