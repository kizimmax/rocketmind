"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { RichText } from "./rich-text";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  type StyledParagraph,
} from "./styled-paragraphs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { VkIcon } from "../icons/socials/vk";
import { TelegramIcon } from "../icons/socials/telegram";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SocialKind = "vk" | "telegram" | "custom";

export type ContactSocial = {
  id: string;
  kind: SocialKind;
  /** For custom kind — URL/data-URL to SVG or PNG icon. */
  iconSrc?: string;
  username: string;
  url: string;
};

export type ContactPersonData = {
  /** Rendered avatar URL (resolved by the host app from an expert slug or custom upload). */
  avatar: string | null;
  name: string;
  role: string;
  phone?: string;
  social?: {
    kind: SocialKind;
    iconSrc?: string;
    username: string;
    url: string;
  };
};

export type ContactCardItem =
  | { id: string; kind: "paragraph"; paragraph: StyledParagraph }
  | { id: string; kind: "socials"; socials: ContactSocial[] }
  | { id: string; kind: "person"; person: ContactPersonData };

export type ContactCard = {
  id: string;
  title: string;
  items: ContactCardItem[];
};

export type ContactsSectionProps = {
  tag: string;
  title: string;
  titleSecondary?: string;
  subtitle?: string;
  paragraphs?: StyledParagraph[];
  cards: ContactCard[];
  className?: string;
};

// ── Social icon resolver ──────────────────────────────────────────────────────

function SocialIcon({
  kind,
  iconSrc,
  className,
}: {
  kind: SocialKind;
  iconSrc?: string;
  className?: string;
}) {
  if (kind === "vk") return <VkIcon className={className} />;
  if (kind === "telegram") return <TelegramIcon className={className} />;
  // Custom — render provided src inside the same 40×40 rounded square with currentColor border.
  if (!iconSrc) return null;
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-sm border border-current",
        className,
      )}
    >
      <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
    </span>
  );
}

function socialTooltipText(social: ContactSocial | NonNullable<ContactPersonData["social"]>) {
  const username = social.username || "";
  if (!username) return "";
  if (social.kind === "telegram") {
    return username.startsWith("@") ? username : `@${username}`;
  }
  if (social.kind === "vk") {
    return `vk.com/${username.replace(/^\//, "")}`;
  }
  return username;
}

// ── Item renderers ────────────────────────────────────────────────────────────

function ParagraphItem({ paragraph }: { paragraph: StyledParagraph }) {
  const color = paragraph.color === "primary" ? "text-[#0A0A0A]" : "text-[#404040]";
  const caps = paragraph.uppercase
    ? "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase tracking-[0.02em]"
    : "text-[length:var(--text-16)] leading-[1.28]";
  return (
    <RichText
      text={paragraph.text}
      className={cn(caps, color, "max-w-[480px]")}
    />
  );
}

function SocialsItem({ socials }: { socials: ContactSocial[] }) {
  if (!socials.length) return null;
  return (
    <TooltipProvider delay={150}>
      <div className="flex flex-wrap items-center gap-2 text-[#0A0A0A]">
        {socials.map((s) => {
          const label = socialTooltipText(s);
          const icon = (
            <SocialIcon
              kind={s.kind}
              iconSrc={s.iconSrc}
              className="transition-colors group-hover/social:text-[#404040]"
            />
          );
          const trigger = s.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label || s.username}
              className="group/social inline-flex text-[#0A0A0A] hover:text-[#404040]"
            >
              {icon}
            </a>
          ) : (
            <span aria-label={label || s.username} className="group/social inline-flex">
              {icon}
            </span>
          );
          if (!label) return <React.Fragment key={s.id}>{trigger}</React.Fragment>;
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger render={trigger} />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function PersonItem({ person }: { person: ContactPersonData }) {
  const socialLabel = person.social ? socialTooltipText(person.social) : "";
  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div
        className="h-14 w-14 shrink-0 rounded-sm bg-[#E0E0E0] bg-cover bg-center"
        style={person.avatar ? { backgroundImage: `url(${person.avatar})` } : undefined}
      />
      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-[length:var(--text-16)] font-medium leading-[1.28] text-[#0A0A0A]">
          {person.name}
        </div>
        {person.role ? (
          <div className="text-[length:var(--text-14)] leading-[1.32] text-[#404040]">
            {person.role}
          </div>
        ) : null}
        {person.phone ? (
          <a
            href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}
            className="text-[length:var(--text-14)] leading-[1.32] text-[#0A0A0A] hover:text-[#404040]"
          >
            {person.phone}
          </a>
        ) : null}
        {person.social && (person.social.url || person.social.username) ? (
          <TooltipProvider delay={150}>
            <div className="mt-1 inline-flex text-[#0A0A0A]">
              <Tooltip>
                <TooltipTrigger
                  render={
                    person.social.url ? (
                      <a
                        href={person.social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLabel || person.social.username}
                        className="inline-flex hover:text-[#404040]"
                      >
                        <SocialIcon
                          kind={person.social.kind}
                          iconSrc={person.social.iconSrc}
                        />
                      </a>
                    ) : (
                      <span className="inline-flex">
                        <SocialIcon
                          kind={person.social.kind}
                          iconSrc={person.social.iconSrc}
                        />
                      </span>
                    )
                  }
                />
                {socialLabel ? <TooltipContent>{socialLabel}</TooltipContent> : null}
              </Tooltip>
            </div>
          </TooltipProvider>
        ) : null}
      </div>
    </div>
  );
}

function CardItemRenderer({ item }: { item: ContactCardItem }) {
  if (item.kind === "paragraph") return <ParagraphItem paragraph={item.paragraph} />;
  if (item.kind === "socials") return <SocialsItem socials={item.socials} />;
  return <PersonItem person={item.person} />;
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ContactCardView({ card }: { card: ContactCard }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end">
        <h4 className="h4 text-[#0A0A0A]">{card.title}</h4>
      </div>
      <div className="h-0 w-full border-t border-[#404040]" />
      <div className="flex flex-col gap-4">
        {card.items.map((item) => (
          <CardItemRenderer key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function ContactsSection({
  tag,
  title,
  titleSecondary,
  subtitle,
  paragraphs,
  cards,
  className,
}: ContactsSectionProps) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, subtitle, {
    uppercase: true,
    color: "primary",
  });
  const hasParagraphs = resolvedParagraphs.length > 0;

  // Split cards into two balanced columns for desktop.
  const splitIndex = Math.ceil(cards.length / 2);
  const leftCards = cards.slice(0, splitIndex);
  const rightCards = cards.slice(splitIndex);

  return (
    <section className={cn("w-full bg-[#F0F0F0] py-10 md:py-16 lg:py-20", className)}>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <div className="flex">
            <div className="w-1/2 shrink-0 pr-8">
              <h2 className="h2">
                <span className="text-[#0A0A0A]">{title}</span>
                {titleSecondary ? (
                  <>
                    <span className="text-[#0A0A0A]"> </span>
                    <span className="text-[#666666]">{titleSecondary}</span>
                  </>
                ) : null}
              </h2>
            </div>
            {hasParagraphs && (
              <div className="w-1/2">
                <div className="max-w-[480px]">
                  <StyledParagraphs paragraphs={resolvedParagraphs} theme="light" size="18" />
                </div>
              </div>
            )}
          </div>
        </div>

        {cards.length > 0 && (
          <div className="flex">
            <div className="w-1/2 flex gap-4 pr-4">
              {leftCards.map((card) => (
                <div key={card.id} className="flex-1">
                  <ContactCardView card={card} />
                </div>
              ))}
            </div>
            <div className="w-1/2 flex gap-4">
              {rightCards.map((card) => (
                <div key={card.id} className="flex-1">
                  <ContactCardView card={card} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile / tablet */}
      <div className="flex lg:hidden flex-col gap-16 px-5 md:px-8">
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <h2 className="h3">
            <span className="text-[#0A0A0A]">{title}</span>
            {titleSecondary ? (
              <>
                <span className="text-[#0A0A0A]"> </span>
                <span className="text-[#666666]">{titleSecondary}</span>
              </>
            ) : null}
          </h2>
          {hasParagraphs && (
            <div className="mt-1">
              <StyledParagraphs paragraphs={resolvedParagraphs} theme="light" size="16" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-7">
          {cards.map((card) => (
            <ContactCardView key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
