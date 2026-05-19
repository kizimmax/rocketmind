"use client";

import { usePathname } from "next/navigation";
import {
  Bot,
  CalendarDays,
  ShieldCheck,
  ScrollText,
  FileText,
  Newspaper,
  Users,
  Briefcase,
  MessageSquareQuote,
  MousePointerClick,
  Inbox,
  Settings,
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

type SaasAdminSection = AdminShellSection & {
  rolesAllowed?: Role[];
  permissionPath?: string;
};

const SITE_ADMIN_URL =
  process.env.NEXT_PUBLIC_SITE_ADMIN_URL ?? "http://localhost:3004";

const allSections: SaasAdminSection[] = [
  // ── SaaS-разделы (живут локально в saas-admin) ──
  { id: "ai-agents", href: "/ai-agents", label: "AI-эксперты", Icon: Bot, permissionPath: "ai-agents" },
  { id: "programs", href: "/programs", label: "Программы", Icon: CalendarDays, permissionPath: "programs" },
  { id: "users", href: "/users", label: "Управление админами", Icon: ShieldCheck, rolesAllowed: ["SUPER_ADMIN", "ADMIN"] },
  { id: "audit-log", href: "/audit-log", label: "Аудит-лог", Icon: ScrollText, rolesAllowed: ["SUPER_ADMIN"] },

  // ── Cross-links на сайтовый CMS (видны только SUPER_ADMIN) ──
  // Иллюзия единого пульта: те же визуальные вкладки + ExternalLink-иконка.
  {
    id: "site-pages",
    href: `${SITE_ADMIN_URL}/pages`,
    label: "Страницы",
    Icon: FileText,
    external: true,
    groupHeader: "site",
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-media",
    href: `${SITE_ADMIN_URL}/media`,
    label: "Медиа",
    Icon: Newspaper,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-experts",
    href: `${SITE_ADMIN_URL}/experts`,
    label: "Эксперты",
    Icon: Users,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-cases",
    href: `${SITE_ADMIN_URL}/cases`,
    label: "Кейсы",
    Icon: Briefcase,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-testimonials",
    href: `${SITE_ADMIN_URL}/testimonials`,
    label: "Отзывы",
    Icon: MessageSquareQuote,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-cta-forms",
    href: `${SITE_ADMIN_URL}/cta-forms`,
    label: "CTA и формы",
    Icon: MousePointerClick,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-submissions",
    href: `${SITE_ADMIN_URL}/submissions`,
    label: "Заявки",
    Icon: Inbox,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-system",
    href: `${SITE_ADMIN_URL}/system`,
    label: "Системные",
    Icon: Settings,
    external: true,
    rolesAllowed: ["SUPER_ADMIN"],
  },
  {
    id: "site-redirects",
    href: `${SITE_ADMIN_URL}/redirects`,
    label: "Редиректы",
    Icon: ArrowLeftRight,
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
      brandTag="saas"
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
