"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { NavigationGuardProvider } from "@/lib/navigation-guard";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { isPathVisible } from "@/lib/permissions-client";
import { ruleForPathname } from "@/lib/route-permissions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthed, isLoading, currentUser, permissions } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const access = useMemo(() => {
    if (!currentUser) return { allowed: false, reason: "no_user" as const };
    const rule = ruleForPathname(pathname);
    if (!rule) return { allowed: true } as const;
    if (rule.rolesAllowed && !rule.rolesAllowed.includes(currentUser.role)) {
      return { allowed: false, reason: "role" as const };
    }
    if (rule.permissionPath && !isPathVisible(currentUser.role, permissions, rule.permissionPath)) {
      return { allowed: false, reason: "permission" as const };
    }
    return { allowed: true } as const;
  }, [pathname, currentUser, permissions]);

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace("/login");
    }
  }, [isAuthed, isLoading, router]);

  useEffect(() => {
    if (isLoading || !isAuthed || !currentUser) return;
    if (access.allowed) return;
    // Forbidden: send to profile (always accessible) instead of login —
    // the user is authenticated, just lacks permission for this section.
    router.replace("/profile");
  }, [access.allowed, isLoading, isAuthed, currentUser, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  if (!isAuthed) return null;
  if (!access.allowed) return null;

  return (
    <NavigationGuardProvider>
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex flex-1 flex-col overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NavigationGuardProvider>
  );
}
