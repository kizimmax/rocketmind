"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Align app shell with visual viewport (handles iOS virtual keyboard)
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    function update() {
      const vv = window.visualViewport;
      if (vv) {
        shell!.style.height = `${vv.height}px`;
        shell!.style.transform = `translateY(${vv.offsetTop}px)`;
      } else {
        shell!.style.height = `${window.innerHeight}px`;
        shell!.style.transform = "";
      }
    }

    update();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
      return () => {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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
    <div
      ref={shellRef}
      className="fixed inset-x-0 top-0 flex overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
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
