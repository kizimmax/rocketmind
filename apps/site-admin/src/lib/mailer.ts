/**
 * Email transport stub. Real provider (Amvera SMTP / Resend) wires in later;
 * the rest of the app already calls this interface so the swap is one file.
 */

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  /** For diagnostics — what triggered this (e.g. "password.send", "email.verify"). */
  reason: string;
}

export interface SendResult {
  ok: boolean;
  stubbed: boolean;
  error?: string;
}

export async function sendEmail(email: OutgoingEmail): Promise<SendResult> {
  // TODO: replace with real provider once Amvera SMTP creds are wired.
  console.log(
    `[mailer:STUB] reason=${email.reason} to=${email.to} subject="${email.subject}"\n--- body ---\n${email.text}\n--- end ---`,
  );
  return { ok: true, stubbed: true };
}
