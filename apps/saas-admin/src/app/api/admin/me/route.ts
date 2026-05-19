import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Returns the freshest copy of the authenticated user + their permissions.
 * Called on app boot so the client sees up-to-date role/permissions even if
 * an admin changed them while the user was offline.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const [user, permissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        status: true,
      },
    }),
    prisma.userPermission.findMany({
      where: { userId: auth.id },
      select: { path: true, accessLevel: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ user, permissions });
}
