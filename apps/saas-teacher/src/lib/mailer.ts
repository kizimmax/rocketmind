/**
 * Минимальный mailer для OTP. В dev режиме логирует код в консоль,
 * чтобы можно было войти без настройки SMTP. В production требует
 * SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS и SMTP_FROM.
 */

interface SendArgs {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendArgs) {
  if (
    process.env.NODE_ENV !== "production" &&
    !process.env.SMTP_HOST
  ) {
    console.log(`[mailer dev] to=${to} subject=${subject}\n${text}`);
    return;
  }

  // Lazy import — nodemailer не нужен в dev
  const { default: nodemailer } = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@rocketmind.local",
    to,
    subject,
    text,
  });
}
