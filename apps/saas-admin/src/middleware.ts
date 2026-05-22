import { NextRequest, NextResponse } from "next/server";

export const config = {
  // Публичные (без сессии): admin/login + admin/verify (OTP-вход),
  // admin/maintenance/cleanup (cron). Реальная проверка сессии — в requireAuth
  // каждого роута (через /profile Ивана); здесь только лёгкий edge-гейт.
  matcher: ["/api/((?!admin/login|admin/verify|admin/maintenance/cleanup).*)"],
};

export function middleware(req: NextRequest) {
  // На нашем домене куки бывают только Ивановские auth (relay). Их отсутствие =
  // точно не авторизован. Валидность токена проверяет requireAuth у Ивана.
  if (req.cookies.getAll().length === 0) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}
