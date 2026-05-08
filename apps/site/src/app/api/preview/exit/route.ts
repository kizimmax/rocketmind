import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const back = url.searchParams.get("back") || "/";

  const dm = await draftMode();
  dm.disable();

  const safeBack = back.startsWith("/") ? back : "/";
  const res = NextResponse.redirect(new URL(safeBack, url.origin), 302);
  res.cookies.set("previewDraftId", "", { path: "/", expires: new Date(0) });
  return res;
}
