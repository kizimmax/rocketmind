"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button, Input, InputOTP } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

const CODE_LENGTH = 6;
const RESEND_INTERVAL = 60;
const MAX_ATTEMPTS = 5;

type Step = "email" | "code";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Email step state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Code step state
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  const { requestCode, verifyCode, pendingEmail } = useAuth();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Email submit
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail) {
      setEmailError("Введите корректный email");
      return;
    }

    setEmailError("");
    setEmailLoading(true);

    try {
      await requestCode(email);
      setResendTimer(RESEND_INTERVAL);
      setDirection(1);
      setStep("code");
    } catch {
      setEmailError("Не удалось отправить код. Попробуйте позже.");
    } finally {
      setEmailLoading(false);
    }
  }

  // Code verify
  const handleVerify = useCallback(async () => {
    if (code.length !== CODE_LENGTH) return;
    if (attempts >= MAX_ATTEMPTS) {
      setCodeError("Слишком много попыток. Запросите новый код.");
      return;
    }

    setCodeError("");
    setCodeLoading(true);

    try {
      const success = await verifyCode(code);
      if (success) {
        window.location.href = "/";
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setCode("");
        if (newAttempts >= MAX_ATTEMPTS) {
          setCodeError("Слишком много попыток. Запросите новый код.");
        } else {
          setCodeError(
            `Неверный код. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`
          );
        }
      }
    } catch {
      setCodeError("Ошибка проверки. Попробуйте позже.");
    } finally {
      setCodeLoading(false);
    }
  }, [code, attempts, verifyCode]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (code.length === CODE_LENGTH && !codeLoading) {
      handleVerify();
    }
  }, [code, codeLoading, handleVerify]);

  async function handleResend() {
    if (resendTimer > 0) return;
    setAttempts(0);
    setCodeError("");
    setCode("");
    if (pendingEmail) {
      await requestCode(pendingEmail);
    }
    setResendTimer(RESEND_INTERVAL);
  }

  function handleBack() {
    setDirection(-1);
    setCode("");
    setCodeError("");
    setAttempts(0);
    setStep("email");
  }

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (d: number) => ({
      x: d > 0 ? -80 : 80,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "email" ? (
            <motion.div
              key="email"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <form onSubmit={handleEmailSubmit} noValidate className="space-y-6">
                <div className="space-y-3 text-center">
                  <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
                    Войти
                  </h1>
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    Введите email для получения кода доступа
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    type="text"
                    inputMode="email"
                    size="lg"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    aria-invalid={!!emailError}
                    autoFocus
                  />

                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[length:var(--text-12)] text-destructive"
                    >
                      {emailError}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full"
                    disabled={!email.trim() || emailLoading}
                  >
                    {emailLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      "Получить код"
                    )}
                  </Button>
                </div>

                <p className="text-center text-[length:var(--text-12)] text-muted-foreground">
                  Нажимая «Получить код», вы соглашаетесь с{" "}
                  <a
                    href="https://rocketmind.ru/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Политикой конфиденциальности
                  </a>{" "}
                  и{" "}
                  <a
                    href="https://rocketmind.ru/legal/data-consent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Обработкой персональных данных
                  </a>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="space-y-6">
                <div className="space-y-3 text-center">
                  <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
                    Введите код
                  </h1>
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    Код отправлен на{" "}
                    <span className="font-medium text-foreground">
                      {pendingEmail}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <InputOTP
                    length={CODE_LENGTH}
                    value={code}
                    onChange={setCode}
                    aria-invalid={!!codeError}
                    className="justify-center"
                  />

                  {codeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[length:var(--text-12)] text-destructive"
                    >
                      {codeError}
                    </motion.p>
                  )}

                  <Button
                    onClick={handleVerify}
                    size="lg"
                    className="h-12 w-full"
                    disabled={code.length !== CODE_LENGTH || codeLoading}
                  >
                    {codeLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </Button>

                  <div className="flex items-center gap-3 text-[length:var(--text-14)]">
                    <button
                      type="button"
                      onClick={handleBack}
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
                      {resendTimer > 0
                        ? `Повторно (${resendTimer}с)`
                        : "Отправить повторно"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 pb-6 text-[length:var(--text-12)] text-muted-foreground">
        <a
          href="https://rocketmind.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Rocketmind
        </a>
        <span className="text-rm-gray-3">·</span>
        <a
          href="https://rocketmind.ru/ai-products/business-modeling"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Подробнее о сервисе
        </a>
      </footer>
    </div>
  );
}
