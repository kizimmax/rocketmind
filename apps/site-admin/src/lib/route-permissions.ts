/**
 * Maps the first URL segment of an admin route to the permission tree path
 * that grants access. Kept in sync with the sidebar config and the server
 * codemod (gate-routes). Sections without a mapping (or marked `null`) are
 * universally accessible to authed users — typically profile/utility pages.
 */

import type { Role } from "@/lib/permissions-client";

export interface RouteRule {
  /** Permission path required to view the section. */
  permissionPath?: string;
  /** Role-only gate (in addition to / instead of permission). */
  rolesAllowed?: Role[];
}

const RULES: Record<string, RouteRule> = {
  pages: { permissionPath: "pages" },
  media: { permissionPath: "media" },
  experts: { permissionPath: "experts" },
  cases: { permissionPath: "cases" },
  testimonials: { permissionPath: "testimonials" },
  "cta-forms": { permissionPath: "cta-forms" },
  submissions: { permissionPath: "submissions" },
  "ai-agents": { permissionPath: "ai-agents" },
  programs: { permissionPath: "programs" },
  redirects: { permissionPath: "redirects" },
  system: { permissionPath: "system" },
  users: { rolesAllowed: ["SUPER_ADMIN", "ADMIN"] },
  "audit-log": { rolesAllowed: ["SUPER_ADMIN"] },
  profile: {}, // always accessible to any authed user
};

/** Returns the rule for a given pathname, or null if no gate applies. */
export function ruleForPathname(pathname: string): RouteRule | null {
  // Strip leading slash, take the first segment.
  const seg = pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  if (!seg) return null;
  return RULES[seg] ?? null;
}
