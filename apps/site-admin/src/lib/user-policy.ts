import { Role } from "@prisma/client";
import { AuthedUser } from "@/lib/auth";

interface TargetUser {
  id: string;
  role: Role;
  createdById: string | null;
}

/**
 * Can `actor` perform a management action (edit fields, change permissions,
 * regenerate password, freeze, delete) on `target`?
 *
 * Rules:
 * - SUPER_ADMIN: any user except themselves for destructive ops (see canDelete/canFreeze)
 * - ADMIN: only users they created, and only EDITORs
 * - EDITOR: no
 */
export function canManageUser(actor: AuthedUser, target: TargetUser): boolean {
  if (actor.id === target.id) return false;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role !== "ADMIN") return false;
  if (target.role !== "EDITOR") return false;
  return target.createdById === actor.id;
}

/**
 * Which roles can `actor` assign when creating a new user?
 */
export function assignableRoles(actor: AuthedUser): Role[] {
  if (actor.role === "SUPER_ADMIN") return ["ADMIN", "EDITOR"];
  if (actor.role === "ADMIN") return ["EDITOR"];
  return [];
}

export function canCreateRole(actor: AuthedUser, role: Role): boolean {
  return assignableRoles(actor).includes(role);
}

/**
 * Destructive: delete account entirely. Only SUPER_ADMIN, never self.
 */
export function canDelete(actor: AuthedUser, target: TargetUser): boolean {
  if (actor.id === target.id) return false;
  if (target.role === "SUPER_ADMIN") return false;
  return actor.role === "SUPER_ADMIN";
}

/**
 * Freeze/unfreeze. Same matrix as canManageUser but explicitly forbids
 * freezing the last active SUPER_ADMIN — checked at the route layer with
 * a count query, not here.
 */
export function canFreeze(actor: AuthedUser, target: TargetUser): boolean {
  return canManageUser(actor, target);
}
