"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, InputOTP } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

const CODE_LENGTH = 6;
const RESEND_INTERVAL = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { requestCode, verifyCode, pendingEmail } = useAuth();
  const router = useRouter();

  const isValidEmail = EMAIL_RE.test(email);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail || loading) return;
    setLoading(true);
    setError("");
    try {
      await requestCode(email.trim().toLowerCase());
      setResendTimer(RESEND_INTERVAL);
      setStep("code");
    } catch {
      setError("Не удалось отправить код. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = useCallback(async () => {
    if (code.length !== CODE_LENGTH || loading) return;
    setLoading(true);
    setError("");
    try {
      const ok = await verifyCode(code);
      if (ok) {
        router.replace("/ai-agents");
      } else {
        setError("Неверный код. Попробуйте ещё раз.");
        setCode("");
      }
    } catch {
      setError("Ошибка проверки. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, [code, loading, verifyCode, router]);

  useEffect(() => {
    if (code.length === CODE_LENGTH && !loading) handleVerify();
  }, [code, loading, handleVerify]);

  async function handleResend() {
    if (resendTimer > 0 || !pendingEmail) return;
    setCode("");
    setError("");
    await requestCode(pendingEmail);
    setResendTimer(RESEND_INTERVAL);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="space-y-3 text-center">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
            CMS Rocketmind
          </h1>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            {step === "email"
              ? "Введите email для получения кода доступа"
              : `Код отправлен на ${pendingEmail}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} noValidate className="space-y-3">
            <Input
              type="text"
              inputMode="email"
              size="lg"
              placeholder="email@example.com"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={!!error}
              autoFocus
            />
            {error && <p className="text-[length:var(--text-12)] text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="h-12 w-full" disabled={!isValidEmail || loading}>
              {loading ? "Отправка…" : "Получить код"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <InputOTP
              length={CODE_LENGTH}
              value={code}
              onChange={setCode}
              aria-invalid={!!error}
              className="justify-center"
            />
            {error && <p className="text-[length:var(--text-12)] text-destructive">{error}</p>}
            <Button
              onClick={handleVerify}
              size="lg"
              className="h-12 w-full"
              disabled={code.length !== CODE_LENGTH || loading}
            >
              {loading ? "Проверка…" : "Подтвердить"}
            </Button>
            <div className="flex items-center gap-3 text-[length:var(--text-14)]">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Назад
              </button>
              <span className="text-rm-gray-3">|</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendTimer > 0 ? `Повторно (${resendTimer}с)` : "Отправить повторно"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
