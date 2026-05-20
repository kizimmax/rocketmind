"use client";

import { usePathname } from "next/navigation";
import {
  FileText,
  Newspaper,
  Users,
  Briefcase,
  MessageSquareQuote,
  MousePointerClick,
  Inbox,
  Bot,
  CalendarDays,
  Settings,
  ShieldCheck,
  ScrollText,
  ArrowLeftRight,
} from "lucide-react";
import {
  AdminSidebar as AdminSidebarShell,
  type AdminShellSection,
} from "@rocketmind/ui";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAuth } from "@/lib/auth-context";
import { isPathVisible } from "@/lib/permissions-client";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

type SiteAdminSection = AdminShellSection & {
  rolesAllowed?: Role[];
  permissionPath?: string;
};

const SAAS_ADMIN_URL =
  process.env.NEXT_PUBLIC_SAAS_ADMIN_URL ?? "http://localhost:3006";

const allSections: SiteAdminSection[] = [
  { id: "pages", href: "/pages", label: "Страницы", Icon: FileText, permissionPath: "pages" },
  { id: "media", href: "/media", label: "Медиа", Icon: Newspaper, permissionPath: "media" },
  { id: "experts", href: "/experts", label: "Эксперты", Icon: Users, permissionPath: "experts" },
  { id: "cases", href: "/cases", label: "Кейсы", Icon: Briefcase, permissionPath: "cases" },
  { id: "testimonials", href: "/testimonials", label: "Отзывы", Icon: MessageSquareQuote, permissionPath: "testimonials" },
  { id: "cta-forms", href: "/cta-forms", label: "CTA и формы", Icon: MousePointerClick, permissionPath: "cta-forms" },
  { id: "submissions", href: "/submissions", label: "Заявки", Icon: Inbox, permissionPath: "submissions" },
  { id: "users", href: "/users", label: "Доступы к CMS сайта", Icon: ShieldCheck, rolesAllowed: ["SUPER_ADMIN", "ADMIN"] },
  { id: "audit-log", href: "/audit-log", label: "Аудит-лог", Icon: ScrollText, rolesAllowed: ["SUPER_ADMIN"] },
  { id: "system", href: "/system", label: "Системные", Icon: Settings, permissionPath: "system" },
  { id: "redirects", href: "/redirects", label: "Редиректы", Icon: ArrowLeftRight, permissionPath: "redirects" },
  // SaaS admin cross-links (видны только SUPER_ADMIN). Управление AI-экспертами
  // и программами теперь живёт в saas-admin — отсюда только переходы.
  {
    id: "saas-ai-agents",
    href: `${SAAS_ADMIN_URL}/ai-agents`,
    label: "AI-эксперты",
    Icon: Bot,
    external: true,
    groupHeader: "saas",
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "saas-programs",
    href: `${SAAS_ADMIN_URL}/programs`,
    label: "Программы",
    Icon: CalendarDays,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "saas-users",
    href: `${SAAS_ADMIN_URL}/users`,
    label: "Доступы к CMS SaaS",
    Icon: ShieldCheck,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
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
      brandTag="site"
      iconDarkPath="/icon_dark_background.svg"
      iconLightPath="/icon_light_background.svg"
      sections={sections}
      pathname={pathname}
      user={currentUser ? { firstName: currentUser.firstName, lastName: currentUser.lastName } : null}
      onLogout={logout}
      tryNavigate={tryNavigate}
      pinKey="cms-sidebar-pinned"
    />
  );
}
