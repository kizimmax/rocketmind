import crypto from "node:crypto";

const SECRET = process.env.PREVIEW_SECRET || "";

export interface PreviewTokenPayload {
  id: string;
  exp: number;
  canPublish?: boolean;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

export function signPreviewToken(payload: PreviewTokenPayload): string {
  if (!SECRET) throw new Error("PREVIEW_SECRET не задан");
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyPreviewToken(token: string): PreviewTokenPayload | null {
  if (!SECRET || !token) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = b64url(crypto.createHmac("sha256", SECRET).update(body).digest());
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as PreviewTokenPayload;
    if (typeof payload.id !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
