"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import type { NavSection } from "../../content/site-nav";
import { MobileNav } from "./mobile-nav";
import { RocketmindMenu } from "./rocketmind-menu";
import { useFormModal } from "./form-modal";

export type SiteHeaderCta = {
  /** Текст кнопки (например, «Оставить заявку»). Если пусто — кнопка не рендерится. */
  buttonText?: string;
  /** ID формы, открывается по клику. Если пусто — кнопка не рендерится. */
  formId?: string;
};

export type SiteHeaderProps = {
  /** Base path for static assets (logo). Default: "" */
  basePath?: string;
  className?: string;
  /** Navigation tree. Falls back to the hardcoded HEADER_NAV when omitted. */
  nav?: NavSection[];
  /**
   * CTA-кнопка справа от меню (на мобиле — слева от бургера). Открывает форму
   * по `formId` через `ModalProvider`. Если `buttonText` или `formId` пусты —
   * не рендерится.
   */
  cta?: SiteHeaderCta;
};

export function SiteHeader({
  basePath = "",
  className,
  nav,
  cta,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isVisible, setIsVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const heroMidpoint = window.innerHeight / 2;
      setIsVisible(window.scrollY > heroMidpoint);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full h-16 bg-background border-b border-border flex items-center transition-all duration-300",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14">
        <Link href="/" className="flex items-center">
          <img
            src={`${basePath}/text_logo_dark_background_en.svg`}
            alt="Rocketmind"
            className="h-auto w-[120px] md:w-[144px]"
          />
        </Link>

        <RocketmindMenu
          className="hero-menu-desktop ml-auto flex-1 items-center justify-end gap-5 lg:gap-7"
          itemClassName="!text-[18px]"
          showDropdowns={true}
          nav={nav}
        />

        {/* Правая группа: CTA-кнопка + бургер. На мобиле — ml-auto толкает
            к правому краю (RocketmindMenu скрыт через display:none).
            На десктопе ml-auto безвреден: RocketmindMenu имеет flex-1
            и забирает всё свободное место. */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <HeaderCtaButton cta={cta} />
          <MobileNav nav={nav} />
        </div>
      </div>
    </header>
  );
}

function HeaderCtaButton({ cta }: { cta?: SiteHeaderCta }) {
  const { openForm } = useFormModal();
  if (!cta?.buttonText || !cta?.formId) return null;
  return (
    <button
      type="button"
      onClick={() => openForm(cta.formId!)}
      className="inline-flex shrink-0 items-center justify-center rounded-sm bg-[var(--rm-yellow-100)] px-4 py-2 font-['Loos_Condensed',sans-serif] text-[13px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#0A0A0A] transition-opacity hover:opacity-85 active:opacity-70 md:text-[14px]"
    >
      {cta.buttonText}
    </button>
  );
}
