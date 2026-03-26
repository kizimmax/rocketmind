"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const MENU_CHEVRON_ICON =
  "http://localhost:3845/assets/d0db95d68600a9f355b629d217908ef191f6c70e.svg";

type DropdownItem = {
  href: string;
  title: string;
  description: string;
};

type MenuItem =
  | {
      href: string;
      label: string;
      dropdownItems?: undefined;
    }
  | {
      href: string;
      label: string;
      dropdownItems: readonly DropdownItem[];
    };

const CONSULTING_ITEMS = [
  {
    href: "#focus",
    title: "AI-консалтинг",
    description: "Стратегия внедрения ИИ в бизнес и в операционные процессы.",
  },
  {
    href: "#focus",
    title: "Платформенная стратегия",
    description: "Переход от линейной модели к экосистемной архитектуре роста.",
  },
  {
    href: "#focus",
    title: "Кейс-система",
    description: "Проектируем работу с кейсами как управляемый цифровой контур.",
  },
  {
    href: "#focus",
    title: "Операционная аналитика",
    description: "Связываем управленческие гипотезы с данными и ритмом решений.",
  },
] as const satisfies readonly DropdownItem[];

const ONLINE_SCHOOL_ITEMS = [
  {
    href: "#focus",
    title: "Программы",
    description: "Обучение платформенному мышлению, AI и бизнес-дизайну.",
  },
  {
    href: "#focus",
    title: "Мастерские",
    description: "Практические интенсивы с разбором реальных бизнес-кейсов.",
  },
  {
    href: "#focus",
    title: "База знаний",
    description: "Материалы, шаблоны и framework'и для команд и лидеров.",
  },
  {
    href: "#focus",
    title: "Корпоративный трек",
    description: "Кастомные программы для управленческих и продуктовых команд.",
  },
] as const satisfies readonly DropdownItem[];

const AI_PRODUCT_ITEMS = [
  {
    href: "#focus",
    title: "AI-агенты",
    description: "Ролевые агенты для сопровождения кейсов и внутренних сценариев.",
  },
  {
    href: "#focus",
    title: "AI-аналитик",
    description: "Собирает сигналы, ищет паттерны и формулирует гипотезы.",
  },
  {
    href: "#focus",
    title: "AI-маркетолог",
    description: "Помогает с позиционированием, контентом и growth-итерациями.",
  },
  {
    href: "#focus",
    title: "AI-разработчик",
    description: "Ускоряет delivery, архитектурные решения и работу с кодом.",
  },
] as const satisfies readonly DropdownItem[];

export const rocketmindMenuItems = [
  {
    href: "#focus",
    label: "Консалтинг и стратегии",
    dropdownItems: CONSULTING_ITEMS,
  },
  {
    href: "#focus",
    label: "Онлайн-школа",
    dropdownItems: ONLINE_SCHOOL_ITEMS,
  },
  {
    href: "#focus",
    label: "AI-продукты",
    dropdownItems: AI_PRODUCT_ITEMS,
  },
  { href: "#about", label: "О Rocketmind" },
  { href: "#media", label: "Медиа" },
] as const satisfies readonly MenuItem[];

type RocketmindMenuProps = {
  className?: string;
  itemClassName?: string;
  showDropdowns?: boolean;
};

type DropdownTriggerProps = {
  item: Extract<MenuItem, { dropdownItems: readonly DropdownItem[] }>;
  itemClassName?: string;
};

function DropdownTrigger({ item, itemClassName }: DropdownTriggerProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="group/menu relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-3 whitespace-nowrap font-mono text-[18px] uppercase leading-[1.16] tracking-[0.36px] text-foreground transition-[color,opacity] duration-150 hover:opacity-[0.88] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          itemClassName,
        )}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        <span>{item.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-[6px] w-[10px] shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path d="M1 1L5 5L9 1" />
        </svg>
      </button>

      <div
        id={menuId}
        className={cn(
          "absolute right-0 top-full z-40 w-[420px] pt-3 text-popover-foreground transition-[opacity,transform,visibility] duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-sm border border-border bg-popover">
          <ul className="grid grid-cols-2 gap-1.5 p-3">
            {item.dropdownItems.map((dropdownItem) => (
              <li key={dropdownItem.title}>
                <Link
                  href={dropdownItem.href}
                  className="flex min-h-[84px] flex-col rounded-sm border border-transparent p-2.5 text-left transition-[background-color,border-color,color,opacity] duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-foreground">
                    {dropdownItem.title}
                  </span>
                  <span className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">
                    {dropdownItem.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RocketmindMenu({
  className,
  itemClassName,
  showDropdowns = true,
}: RocketmindMenuProps) {
  return (
    <nav className={className} aria-label="Rocketmind navigation">
      {rocketmindMenuItems.map((item) => {
        if (showDropdowns && 'dropdownItems' in item && item.dropdownItems) {
          return (
            <DropdownTrigger
              key={item.label}
              item={item}
              itemClassName={itemClassName}
            />
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-3 whitespace-nowrap font-mono text-[18px] uppercase leading-[1.16] tracking-[0.36px] text-foreground transition-[color,opacity] duration-150 hover:opacity-[0.88] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              itemClassName,
            )}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
