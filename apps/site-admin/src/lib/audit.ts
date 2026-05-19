import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientMeta } from "@/lib/client-meta";

export type AuditAction =
  | "login.success"
  | "login.failed"
  | "logout"
  | "password.reset_requested"
  | "password.reset_completed"
  | "password.regenerated_by_admin"
  | "password.changed_self"
  | "email.verification_requested"
  | "email.verified"
  | "email.secondary_added"
  | "email.secondary_removed"
  | "email.changed_by_admin"
  | "user.created"
  | "user.frozen"
  | "user.unfrozen"
  | "user.deleted"
  | "user.login_changed"
  | "permissions.updated"
  | "role.changed";

interface LogAuditArgs {
  actorId: string | null;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  req?: NextRequest;
  ip?: string | null;
  userAgent?: string | null;
}

export async function logAudit(args: LogAuditArgs): Promise<void> {
  const meta = args.req ? getClientMeta(args.req) : { ip: args.ip, userAgent: args.userAgent };
  try {
    await prisma.auditLog.create({
      data: {
        actorId: args.actorId,
        action: args.action,
        targetType: args.targetType,
        targetId: args.targetId,
        metadata: args.metadata as never,
        ip: meta.ip ?? null,
        userAgent: meta.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to write log", args.action, err);
  }
}
