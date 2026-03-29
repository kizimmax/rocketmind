"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { HEADER_NAV, type NavSection } from "@/content/site-nav";

export { HEADER_NAV as rocketmindMenuItems };

type RocketmindMenuProps = {
  className?: string;
  itemClassName?: string;
  showDropdowns?: boolean;
};

type DropdownTriggerProps = {
  item: NavSection & { items: NonNullable<NavSection["items"]> };
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
          "absolute right-0 top-full z-50 pt-3 text-popover-foreground transition-[opacity,transform,visibility] duration-200",
          item.items.length > 4 ? "w-[620px]" : "w-[420px]",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-sm border border-border bg-popover">
          <ul className={cn(
            "grid gap-0.5 p-2",
            item.items.length > 4 ? "grid-cols-3" : "grid-cols-2",
          )}>
            {item.items.map((navItem) => (
              <li key={navItem.href}>
                <Link
                  href={navItem.href}
                  className="flex flex-col rounded-sm px-2.5 py-2 text-left transition-[background-color,color,opacity] duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground">
                    {navItem.title}
                  </span>
                  <span className="mt-0.5 text-[12px] leading-[1.4] text-muted-foreground">
                    {navItem.description}
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
      {HEADER_NAV.map((item) => {
        if (showDropdowns && item.items && item.items.length > 0) {
          return (
            <DropdownTrigger
              key={item.label}
              item={item as DropdownTriggerProps["item"]}
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
