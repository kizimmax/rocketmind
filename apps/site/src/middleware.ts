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

  try {
    const redirect = await prisma.redirect.findUnique({
      where: { fromUrl: pathname, isActive: true },
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
