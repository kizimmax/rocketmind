import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, Next.js internals, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Browser-encoded путь (`/consulting/%D1%82%D0%B5%D1%81%D1%82`) и БД-вариант
  // (`/consulting/тест`) не совпадают строкой — приводим оба к decoded форме.
  // `findFirst` вместо `findUnique`: в where был не-уникальный `isActive`, что
  // тихо падало в Prisma 7 → catch → редирект не отдавался.
  let lookupPath = pathname;
  try { lookupPath = decodeURIComponent(pathname); } catch { /* malformed encoding */ }

  try {
    const candidates = [lookupPath];
    if (lookupPath !== pathname) candidates.push(pathname);

    const redirect = await prisma.redirect.findFirst({
      where: { fromUrl: { in: candidates }, isActive: true },
      select: { toUrl: true, statusCode: true },
    });

    if (redirect) {
      const url = request.nextUrl.clone();
      url.pathname = redirect.toUrl;
      return NextResponse.redirect(url, { status: redirect.statusCode });
    }
  } catch {
    // DB unavailable — let the request through rather than breaking the site
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
