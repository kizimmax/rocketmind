import { createHash, randomBytes } from "node:crypto";

/**
 * Token issuance: returns the raw token (only ever returned once, sent to the
 * user via email) plus its SHA-256 hash (stored in the DB). The middleware
 * never compares plaintext tokens — only hash equality, so a DB dump alone
 * cannot be used to claim password-resets / email-verifications.
 */
export interface IssuedToken {
  raw: string;
  hash: string;
}

export function issueToken(): IssuedToken {
  const raw = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Masks an email like "maxim@example.com" -> "ma***@e***.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const localKeep = Math.min(2, local.length);
  const [dHead, ...dRest] = domain.split(".");
  const dHeadKeep = Math.min(1, dHead.length);
  const maskedLocal = local.slice(0, localKeep) + "***";
  const maskedDomain = dHead.slice(0, dHeadKeep) + "***." + dRest.join(".");
  return `${maskedLocal}@${maskedDomain}`;
}
