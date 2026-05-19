/**
 * Client-side mirror of the server permission check. Kept tiny and dep-free so
 * it can run in the sidebar / page guards without importing Prisma.
 *
 * Authoritative check still happens server-side — this only drives UI
 * visibility and routing hints.
 */

export type AccessLevel = "VIEW" | "EDIT";
export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface ClientPermission {
  path: string;
  accessLevel: AccessLevel;
}

const RANK: Record<AccessLevel, number> = { VIEW: 1, EDIT: 2 };

function isAncestorOrSelf(grantedPath: string, requestedPath: string): boolean {
  if (grantedPath === requestedPath) return true;
  return requestedPath.startsWith(grantedPath + ".");
}

export function hasClientPermission(
  role: Role | undefined,
  permissions: ClientPermission[],
  path: string,
  required: AccessLevel = "VIEW",
): boolean {
  if (role === "SUPER_ADMIN") return true;
  if (!role) return false;
  for (const p of permissions) {
    if (isAncestorOrSelf(p.path, path) && RANK[p.accessLevel] >= RANK[required]) {
      return true;
    }
  }
  return false;
}

/**
 * Nav-visibility check: a section node is visible if the user has permission
 * on it OR on any descendant. Lets a per-item grant ("media.articles.<id>")
 * keep the parent nav entry ("media") reachable.
 */
export function isPathVisible(
  role: Role | undefined,
  permissions: ClientPermission[],
  path: string,
): boolean {
  if (role === "SUPER_ADMIN") return true;
  if (!role) return false;
  const prefix = path + ".";
  for (const p of permissions) {
    if (p.path === path) return true;
    if (isAncestorOrSelf(p.path, path)) return true;       // granted ancestor
    if (p.path.startsWith(prefix)) return true;            // granted descendant
  }
  return false;
}
