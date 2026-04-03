"use client";

import { Accordion } from "@base-ui/react";
import { cn } from "../../lib/utils";

export type AccordionFAQItem = {
  id: string;
  q: string;
  a: string;
};

export type AccordionFAQProps = {
  items?: AccordionFAQItem[];
  /** Which items are open by default (by id). Default: ["3"] */
  defaultOpen?: string[];
  className?: string;
};

const DEFAULT_ITEMS: AccordionFAQItem[] = [
  { id: "1", q: "Что такое Rocketmind?", a: "Rocketmind — SaaS-платформа с готовыми AI-агентами для ведения кейсов. Каждый агент специализируется на конкретной задаче: анализ, стратегия, исследование рынка, тестирование гипотез." },
  { id: "2", q: "Как начать работу?", a: "Перейдите по ссылке /a/{agent_slug}, введите email — и сразу начинайте диалог. Никаких долгих регистраций и настроек." },
  { id: "3", q: "Что умеют агенты?", a: "Агенты ведут структурированный диалог, задают уточняющие вопросы и в конце формируют готовый результат: отчёт, стратегию или ссылку на следующий шаг." },
  { id: "4", q: "Безопасны ли мои данные?", a: "Все данные зашифрованы и хранятся изолированно. Агент видит только историю вашего конкретного кейса — ничего больше." },
  { id: "5", q: "Какие тарифы?", a: "Первый кейс — бесплатно. Далее подписка от 990 ₽/мес, включает неограниченные диалоги с выбранными агентами." },
];

export function AccordionFAQ({
  items = DEFAULT_ITEMS,
  defaultOpen = ["3"],
  className,
}: AccordionFAQProps) {
  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <Accordion.Root defaultValue={defaultOpen} className="w-full">
        {items.map((item) => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            className="border-b border-border"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full text-left py-5 pl-6 md:pl-14 flex items-start gap-4 cursor-pointer text-foreground/20 transition-colors duration-200 data-[panel-open]:text-primary hover:text-foreground/50">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] mt-2 shrink-0 tabular-nums">
                  {item.id}
                </span>
                <span className="font-[family-name:var(--font-heading-family)] font-bold uppercase text-3xl md:text-[length:var(--text-52)] leading-none tracking-[-0.02em]">
                  {item.q}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="accordion-05-panel">
              <div className="overflow-hidden">
                <p className="pb-6 pl-6 md:px-20 text-[length:var(--text-14)] text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
