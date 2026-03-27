"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, InputOTP, Note } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

const CODE_LENGTH = 6;
const RESEND_INTERVAL = 60;
const MAX_ATTEMPTS = 5;

export default function LoginCodePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(RESEND_INTERVAL);
  const { verifyCode, pendingEmail, requestCode } = useAuth();
  const router = useRouter();

  // Redirect if no pending email
  useEffect(() => {
    if (!pendingEmail) {
      router.replace("/login");
    }
  }, [pendingEmail, router]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = useCallback(async () => {
    if (code.length !== CODE_LENGTH) return;
    if (attempts >= MAX_ATTEMPTS) {
      setError("Слишком много попыток. Запросите новый код.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const success = await verifyCode(code);
      if (success) {
        router.replace("/");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setCode("");
        if (newAttempts >= MAX_ATTEMPTS) {
          setError("Слишком много попыток. Запросите новый код.");
        } else {
          setError(
            `Неверный код. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`
          );
        }
      }
    } catch {
      setError("Ошибка проверки. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  }, [code, attempts, verifyCode, router]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === CODE_LENGTH && !isLoading) {
      handleVerify();
    }
  }, [code, isLoading, handleVerify]);

  async function handleResend() {
    if (!pendingEmail || resendTimer > 0) return;
    setAttempts(0);
    setError("");
    setCode("");
    await requestCode(pendingEmail);
    setResendTimer(RESEND_INTERVAL);
  }

  if (!pendingEmail) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight">
          Введите код
        </h2>
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Код отправлен на{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          length={CODE_LENGTH}
          value={code}
          onChange={setCode}
          aria-invalid={!!error}
        />

        {error && <Note variant="error">{error}</Note>}

        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={code.length !== CODE_LENGTH || isLoading}
        >
          {isLoading ? "Проверка..." : "Подтвердить"}
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-[length:var(--text-14)] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendTimer > 0
            ? `Отправить повторно (${resendTimer}с)`
            : "Отправить код повторно"}
        </button>
      </div>
    </div>
  );
}
