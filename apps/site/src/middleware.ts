import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Префиксы, под которыми могут быть preview-страницы (article/page черновики).
// Если pathname не попадает ни под один из них, а у юзера висит preview-кука
// от давнего захода на черновик — куки сбрасываем, чтобы баннер не липнул.
const PREVIEW_PATH_PREFIXES = [
  "/media", "/cases", "/consulting", "/products", "/ai-products", "/academy",
];

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

  // Авточистка прилипших preview-куки на не-preview страницах.
  // (`/api/preview/*` уже исключены выше через startsWith("/api").)
  const hasPreviewCookie =
    request.cookies.has("previewDraftId") ||
    request.cookies.has("__prerender_bypass");
  const onPreviewablePath = PREVIEW_PATH_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p + "/"),
  );
  if (hasPreviewCookie && !onPreviewablePath) {
    const res = NextResponse.next();
    res.cookies.set("previewDraftId", "", { path: "/", expires: new Date(0) });
    res.cookies.set("__prerender_bypass", "", { path: "/", expires: new Date(0) });
    res.cookies.set("__next_preview_data", "", { path: "/", expires: new Date(0) });
    res.headers.set("x-pathname", pathname);
    return res;
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

  // Пробрасываем pathname в server-component layout (там нет навигационного контекста).
  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
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
