import Link from "next/link";

import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
  LEGAL_LINKS,
} from "@/content/site-nav";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

const COMPANY_LINKS = [
  { href: "/about", label: "О Rocketmind" },
  { href: "/cases", label: "Кейсы" },
  { href: "/media", label: "Медиа" },
  ...LEGAL_LINKS.map((l) => ({ href: l.href, label: l.label })),
];

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

export function Footer() {
  const consultingLinks = CONSULTING_SERVICES.map((s) => ({
    href: s.href,
    label: s.title,
  }));
  const academyLinks = ACADEMY_COURSES.map((s) => ({
    href: s.href,
    label: s.title,
  }));
  const aiProductLinks = AI_PRODUCTS.map((s) => ({
    href: s.href,
    label: s.title,
  }));

  return (
    <footer className="border-t border-border bg-background">
      {/* Main footer */}
      <div className="mx-auto max-w-[1512px] px-5 py-12 md:px-8 md:py-16 xl:px-14">
        {/* Logo with descriptor */}
        <Link href="/" className="inline-flex items-center">
          <img
            src={`${BASE_PATH}/with_descriptor_dark_background_en.svg`}
            alt="Rocketmind"
            className="h-[42px] w-auto"
          />
        </Link>

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
          <FooterColumn title="Компания" links={COMPANY_LINKS} />
        </div>

        {/* Mobile copyright — at very bottom */}
        <p className="mt-10 text-[13px] text-muted-foreground/50 md:hidden">
          &copy; {new Date().getFullYear()} Rocketmind
        </p>
      </div>
    </footer>
  );
}
