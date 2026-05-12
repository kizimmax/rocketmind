"use client";

import { useState } from "react";
import { Check, Zap, Users, Sparkles, CreditCard, X } from "lucide-react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "@rocketmind/ui";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0 ₽",
    period: "навсегда",
    description: "Для знакомства с сервисом",
    highlight: false,
    icon: Sparkles,
    features: [
      "1 проект",
      "R1 и R2 (рынок + аудитория)",
      "Базовые артефакты",
      "Экспорт в текст",
    ],
    cta: "Текущий план",
    ctaDisabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₽4 900",
    period: "в месяц",
    description: "Полный пайплайн R1–R5",
    highlight: true,
    icon: Zap,
    features: [
      "5 проектов",
      "Все 6 экспертов (R1–R5 + R+)",
      "Синтетические интервью",
      "Бизнес-модель + юнит-экономика",
      "Питч-дек и инвест-пакет",
      "Экспорт в PDF и PPTX",
      "Приоритетная поддержка",
    ],
    cta: "Перейти на Pro",
    ctaDisabled: false,
  },
  {
    id: "team",
    name: "Team",
    price: "₽12 900",
    period: "в месяц",
    description: "Для команд и агентств",
    highlight: false,
    icon: Users,
    features: [
      "Безлимит проектов",
      "Все функции Pro",
      "До 10 участников команды",
      "Shared workspace",
      "Командные роли и права",
      "Выделенный онбординг",
      "API доступ",
    ],
    cta: "Связаться с нами",
    ctaDisabled: false,
  },
];

export default function UpgradePage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);

  function handleCta(planId: string) {
    if (planId === "pro") {
      setSelectedPlan("Pro");
      setPaymentOpen(true);
    }
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    setPaymentOpen(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="mb-12 space-y-3 text-center">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-40)] font-bold uppercase tracking-tight">
            Выберите план
          </h1>
          <p className="text-[length:var(--text-16)] text-muted-foreground">
            От первичного маркет-анализа до готового инвест-пакета
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-sm border bg-background p-6 transition-shadow ${
                  plan.highlight
                    ? "border-[var(--rm-yellow-100)] shadow-[0_0_0_1px_var(--rm-yellow-100)]"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-sm bg-[var(--rm-yellow-100)] px-3 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] font-medium uppercase tracking-[0.08em] text-black">
                      Рекомендуем
                    </span>
                  </div>
                )}

                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                      {plan.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-40)] font-bold leading-none">
                      {plan.price}
                    </span>
                    <span className="ml-1.5 text-[length:var(--text-14)] text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rm-yellow-100)]" />
                      <span className="text-[length:var(--text-14)] text-foreground">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  className="w-full"
                  disabled={plan.ctaDisabled}
                  onClick={() => handleCta(plan.id)}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Fine print */}
        <p className="mt-8 text-center text-[length:var(--text-12)] text-muted-foreground">
          Оплата в рублях. Можно отменить в любой момент. НДС включён.
        </p>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-heading-family)] uppercase">
              Оплата {selectedPlan}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">
                Номер карты
              </label>
              <div className="relative">
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
                <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">
                  Срок
                </label>
                <Input
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={7}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.08em] text-muted-foreground">
                  CVC
                </label>
                <Input
                  placeholder="•••"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={paying}>
              {paying ? "Обработка..." : "Оплатить ₽4 900"}
            </Button>
            <p className="text-center text-[length:var(--text-11)] text-muted-foreground">
              Защищено. Данные карты не хранятся.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
