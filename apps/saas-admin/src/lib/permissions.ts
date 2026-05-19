import { AccessLevel, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PermissionRow {
  path: string;
  accessLevel: AccessLevel;
}

const LEVEL_RANK: Record<AccessLevel, number> = { VIEW: 1, EDIT: 2 };

function meetsLevel(granted: AccessLevel, required: AccessLevel): boolean {
  return LEVEL_RANK[granted] >= LEVEL_RANK[required];
}

function isAncestorOrSelf(grantedPath: string, requestedPath: string): boolean {
  if (grantedPath === requestedPath) return true;
  return requestedPath.startsWith(grantedPath + ".");
}

export function canManageUsers(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

/**
 * SUPER_ADMIN bypasses the tree entirely.
 * ADMIN and EDITOR are both governed by the permission tree — the only
 * difference is that ADMIN may create users (see canManageUsers).
 *
 * A path is granted when any stored permission whose path equals or is an
 * ancestor of the requested path has a level >= the required one.
 */
export function hasPermission(
  role: Role,
  permissions: PermissionRow[],
  path: string,
  required: AccessLevel,
): boolean {
  if (role === "SUPER_ADMIN") return true;
  for (const p of permissions) {
    if (isAncestorOrSelf(p.path, path) && meetsLevel(p.accessLevel, required)) {
      return true;
    }
  }
  return false;
}

export async function loadPermissions(userId: string): Promise<PermissionRow[]> {
  return prisma.userPermission.findMany({
    where: { userId },
    select: { path: true, accessLevel: true },
  });
}

/**
 * Returns the subset of `requested` that the grantor (a role + permission set)
 * is allowed to delegate. Enforces "cannot grant more than you have" for ADMIN.
 * SUPER_ADMIN can grant anything.
 */
export function filterGrantable(
  grantorRole: Role,
  grantorPermissions: PermissionRow[],
  requested: PermissionRow[],
): PermissionRow[] {
  if (grantorRole === "SUPER_ADMIN") return requested;
  if (grantorRole !== "ADMIN") return [];
  return requested.filter((r) => {
    for (const p of grantorPermissions) {
      if (isAncestorOrSelf(p.path, r.path) && meetsLevel(p.accessLevel, r.accessLevel)) {
        return true;
      }
    }
    return false;
  });
}
