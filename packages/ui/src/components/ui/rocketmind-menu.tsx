"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "../../lib/utils";
import { HEADER_NAV, type NavSection } from "../../content/site-nav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

export { HEADER_NAV as rocketmindMenuItems };

type RocketmindMenuProps = {
  className?: string;
  itemClassName?: string;
  showDropdowns?: boolean;
};

export function RocketmindMenu({
  className,
  itemClassName,
  showDropdowns = true,
}: RocketmindMenuProps) {
  const dropdownItems = showDropdowns
    ? HEADER_NAV.filter((item) => item.items && item.items.length > 0)
    : [];
  const plainItems = HEADER_NAV.filter(
    (item) => !showDropdowns || !item.items || item.items.length === 0,
  );

  const linkClass = cn(
    "inline-flex items-center gap-3 whitespace-nowrap px-3 py-2 rounded-sm",
    "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
    "text-foreground transition-[color,opacity] duration-150 hover:opacity-[0.88]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    itemClassName,
  );

  return (
    <div className={cn("relative z-10 flex items-center", className)}>
      {/* Inner wrapper: gap-5/7 from className applies between children of the outer div,
          but outer div has only this one child — so that gap has no effect.
          Here gap-0.5 gives the same 12px+2px+12px = 26px visual spacing between
          the two sub-groups as within each sub-group. */}
      <div className="flex items-center gap-0.5">
        {dropdownItems.length > 0 && (
          <NavigationMenu
            className={cn(
              "relative flex max-w-max items-center",
              "[&>div]:left-auto [&>div]:right-0 [&>div]:justify-end",
            )}
          >
            <NavigationMenuList className="flex list-none items-center gap-0.5">
              {dropdownItems.map((item, i) => (
                <DropdownSection
                  key={item.label}
                  item={item as NavSection & { items: NonNullable<NavSection["items"]> }}
                  itemClassName={cn(itemClassName, i === dropdownItems.length - 1 && "pr-0")}
                />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {plainItems.length > 0 && (
          <nav className="flex list-none items-center gap-0.5">
            {plainItems.map((item, i) => (
              <Link key={item.label} href={item.href} className={cn(linkClass, i === 0 && "pl-0")}>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

/* ── Dropdown section with Radix sliding viewport ── */

function DropdownSection({
  item,
  itemClassName,
}: {
  item: NavSection & { items: NonNullable<NavSection["items"]> };
  itemClassName?: string;
}) {
  const router = useRouter();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "inline-flex items-center gap-3 whitespace-nowrap px-3 py-2 rounded-sm",
          "font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px]",
          "text-foreground bg-transparent hover:bg-transparent hover:opacity-[0.88]",
          "data-[state=open]:bg-transparent data-[state=open]:opacity-[0.88]",
          "transition-[color,opacity] duration-150 cursor-pointer select-none",
          itemClassName,
        )}
        onClick={() => router.push(item.href)}
      >
        <span>{item.label}</span>
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <ul
          className={cn(
            "grid gap-0.5 p-2",
            item.items.length > 4 ? "w-[680px] grid-cols-3" : "w-[420px] grid-cols-2",
          )}
        >
          {item.items.map((navItem) => (
            <li key={navItem.href}>
              <NavigationMenuLink asChild>
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
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
