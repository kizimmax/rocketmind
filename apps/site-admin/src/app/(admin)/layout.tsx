"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminStoreProvider } from "@/lib/store";
import { NavigationGuardProvider } from "@/lib/navigation-guard";
import { AdminHeader } from "@/components/admin-header";
import { DemoBanner } from "@/components/demo-banner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthed, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace("/login");
    }
  }, [isAuthed, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <AdminStoreProvider>
      <NavigationGuardProvider>
        <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
          <DemoBanner />
          <AdminHeader />
          <main className="flex flex-1 flex-col overflow-y-auto">
            {children}
          </main>
        </div>
      </NavigationGuardProvider>
    </AdminStoreProvider>
  );
}
