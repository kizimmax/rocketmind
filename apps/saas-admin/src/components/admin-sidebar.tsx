"use client";

import { usePathname } from "next/navigation";
import { Bot, CalendarDays, ShieldCheck, ScrollText } from "lucide-react";
import {
  AdminSidebar as AdminSidebarShell,
  type AdminShellSection,
} from "@rocketmind/ui";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAuth } from "@/lib/auth-context";
import { isPathVisible } from "@/lib/permissions-client";

const allSections: (AdminShellSection & {
  rolesAllowed?: Array<"SUPER_ADMIN" | "ADMIN" | "EDITOR">;
  permissionPath?: string;
})[] = [
  { id: "ai-agents", href: "/ai-agents", label: "AI-эксперты", Icon: Bot, permissionPath: "ai-agents" },
  { id: "programs", href: "/programs", label: "Программы", Icon: CalendarDays, permissionPath: "programs" },
  { id: "users", href: "/users", label: "Управление админами", Icon: ShieldCheck, rolesAllowed: ["SUPER_ADMIN", "ADMIN"] },
  { id: "audit-log", href: "/audit-log", label: "Аудит-лог", Icon: ScrollText, rolesAllowed: ["SUPER_ADMIN"] },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "/";
  const { tryNavigate } = useNavigationGuard();
  const { logout, currentUser, permissions } = useAuth();
  const role = currentUser?.role;

  const sections = allSections.filter((s) => {
    if (s.rolesAllowed && !(role && s.rolesAllowed.includes(role))) return false;
    if (s.permissionPath && !isPathVisible(role, permissions, s.permissionPath)) return false;
    return true;
  });

  return (
    <AdminSidebarShell
      brand="CMS"
      iconDarkPath="/icon_dark_background.svg"
      iconLightPath="/icon_light_background.svg"
      sections={sections}
      pathname={pathname}
      user={currentUser ? { firstName: currentUser.firstName, lastName: currentUser.lastName } : null}
      onLogout={logout}
      tryNavigate={tryNavigate}
      pinKey="saas-admin-sidebar-pinned"
    />
  );
}
