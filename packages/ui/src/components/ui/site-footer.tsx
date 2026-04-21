"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronUp } from "lucide-react";

import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
  LEGAL_LINKS,
  type NavItem,
  type NavSection,
} from "../../content/site-nav";

const DottedSurface = dynamic(
  () => import("./dotted-surface").then((m) => m.DottedSurface),
  { ssr: false, loading: () => null },
);

const DEFAULT_COMPANY_LINKS = [
  { href: "/about", label: "О Rocketmind" },
  { href: "/cases", label: "Кейсы" },
  { href: "/media", label: "Медиа" },
];

const CONSULTING_HREF = "/products?filter=consulting";
const ACADEMY_HREF = "/products?filter=academy";
const AI_PRODUCTS_HREF = "/products?filter=ai-products";

function pickItems(nav: NavSection[] | undefined, hrefMatch: string): NavItem[] | null {
  if (!nav) return null;
  const section = nav.find((s) => s.href === hrefMatch || s.href.endsWith(hrefMatch));
  return section?.items ?? null;
}

type FooterColumnProps = {
  title: string;
  links: { href: string; label: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] leading-[1.5] text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type SiteFooterProps = {
  /** Base path for static assets (logo). Default: "" */
  basePath?: string;
  className?: string;
  /** Content rendered on top of the DottedSurface area (e.g. chat widget) */
  children?: React.ReactNode;
  /** Navigation tree (header sections). When omitted, falls back to hardcoded constants. */
  nav?: NavSection[];
  /** Company column links. When omitted, falls back to hardcoded defaults + LEGAL_LINKS. */
  companyLinks?: { href: string; label: string }[];
  /** Legal column links. When omitted, falls back to LEGAL_LINKS. */
  legalLinks?: { href: string; label: string }[];
};

export function SiteFooter({
  basePath = "",
  className,
  children,
  nav,
  companyLinks,
  legalLinks,
}: SiteFooterProps) {
  const consultingItems = pickItems(nav, CONSULTING_HREF) ?? CONSULTING_SERVICES;
  const academyItems = pickItems(nav, ACADEMY_HREF) ?? ACADEMY_COURSES;
  const aiProductItems = pickItems(nav, AI_PRODUCTS_HREF) ?? AI_PRODUCTS;

  const consultingLinks = consultingItems.map((s) => ({ href: s.href, label: s.title }));
  const academyLinks = academyItems.map((s) => ({ href: s.href, label: s.title }));
  const aiProductLinks = aiProductItems.map((s) => ({ href: s.href, label: s.title }));

  const resolvedLegalLinks = legalLinks ?? LEGAL_LINKS.map((l) => ({ href: l.href, label: l.label }));
  const resolvedCompanyLinks = [
    ...(companyLinks ?? DEFAULT_COMPANY_LINKS),
    ...resolvedLegalLinks,
  ];

  return (
    <footer className={className ?? "relative overflow-hidden border-t border-border bg-background"}>
      <div className="relative z-10 mx-auto max-w-[1512px] px-5 py-12 md:px-8 md:py-16 xl:px-14">
        {/* Logo + scroll-to-top */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img
              src={`${basePath}/with_descriptor_dark_background_en.svg`}
              alt="Rocketmind"
              className="h-[42px] w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Наверх"
            className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-secondary text-secondary-foreground transition-opacity duration-150 hover:opacity-[0.88] cursor-pointer"
          >
            <ChevronUp size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Nav columns */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="flex flex-col justify-between">
            <FooterColumn title="Консалтинг" links={consultingLinks.slice(0, 4)} />
            <p className="mt-8 text-[13px] text-muted-foreground/50 hidden md:block">
              &copy; {new Date().getFullYear()} Rocketmind
            </p>
          </div>
          <FooterColumn title={"\u00A0"} links={consultingLinks.slice(4)} />
          <div className="flex flex-col gap-10">
            <FooterColumn title="Онлайн-школа" links={academyLinks} />
            <FooterColumn title="AI-продукты" links={aiProductLinks} />
          </div>
          <FooterColumn title="Компания" links={resolvedCompanyLinks} />
        </div>

        {/* Mobile copyright */}
        <p className="mt-10 text-[13px] text-muted-foreground/50 md:hidden">
          &copy; {new Date().getFullYear()} Rocketmind
        </p>
      </div>

      {/* Dotted surface background + optional overlay content */}
      <div className="relative h-[440px] md:h-[460px]">
        <DottedSurface />
        {children && (
          <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col justify-end">
            {children}
          </div>
        )}
      </div>
    </footer>
  );
}
