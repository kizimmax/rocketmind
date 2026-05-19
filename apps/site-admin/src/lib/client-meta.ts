import { NextRequest } from "next/server";

export interface ClientMeta {
  ip: string | null;
  userAgent: string | null;
}

export function getClientMeta(req: NextRequest): ClientMeta {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null;
  const userAgent = req.headers.get("user-agent") || null;
  return { ip, userAgent };
}
