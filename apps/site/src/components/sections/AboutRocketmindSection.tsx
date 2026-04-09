"use client";

import Image from "next/image";
import { MascotCarousel } from "@/components/blocks/MascotCarousel";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AboutRocketmindVariant = "dark" | "light";

export interface AboutRmFeature {
  title: string;
  text: string;
}

export type AboutRocketmindSectionProps = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  features: [AboutRmFeature, AboutRmFeature, AboutRmFeature];
  variant?: AboutRocketmindVariant;
};

// ── Default content ────────────────────────────────────────────────────────────

export const ABOUT_RM_DEFAULTS: AboutRocketmindSectionProps = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
  features: [
    {
      title: "Доступ к ИИ-агентам",
      text: "Встроенные интеллектуальные ассистенты, которые усиливают командную работу. Работают внутри каждого продукта Rocketmind.",
    },
    {
      title: "Более 20 лет в IT",
      text: "Мы создавали онлайн-продукты, сервисы и платформы, выступали с лекциями для научного и бизнес-сообщества в России и за рубежом.",
    },
    {
      title: "Экспертная команда",
      text: "Над исследованиями работают аналитики и маркетологи, команда редакторов делает материалы простыми для восприятия.",
    },
  ],
  variant: "dark",
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── Component ──────────────────────────────────────────────────────────────────

export function AboutRocketmindSection({
  heading,
  founderName,
  founderBio,
  founderRole,
  features = ABOUT_RM_DEFAULTS.features,
  variant = "dark",
}: AboutRocketmindSectionProps) {
  return (
    <section className="w-full bg-[#0A0A0A] border-t border-border">
      {/* ── Desktop (lg+) ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] border border-[#404040]">
        {/* Left: Photo + Text */}
        <div className="w-1/2 shrink-0 flex border-r border-[#404040] p-8 gap-8 min-h-[460px]">
          {/* Founder photo — flex-1, splits evenly with text */}
          <div className="relative flex-1 min-w-0">
            <Image
              src={`${BASE_PATH}/images/about/alexey-eremin.png`}
              alt={founderName}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1512px) 302px, 25vw"
            />
          </div>

          {/* Text content — flex-1, splits evenly with photo */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            {/* Logo + heading */}
            <div className="flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
                alt="Rocketmind"
                className="h-14 w-auto self-start"
              />
              <h2 className="h2 text-[#F0F0F0] whitespace-pre-line">{heading}</h2>
            </div>

            {/* Founder info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <span className="h4 text-[#F0F0F0]">{founderName}</span>
                <p className="text-[length:var(--text-14)] leading-[1.28] text-[#F0F0F0]">
                  {founderBio}
                </p>
              </div>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {founderRole}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Feature cards */}
        <div className="w-1/2 flex flex-col">
          {/* AI Agents card (top) */}
          <div className="flex-1 flex flex-col gap-4 border-b border-[#404040] p-8">
            <div className="flex gap-12">
              <h3 className="h4 text-[#F0F0F0] shrink-0">{features[0].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[0].text}
              </p>
            </div>
            <MascotCarousel />
          </div>

          {/* Bottom row: 2 cards side by side */}
          <div className="flex">
            <div className="w-1/2 flex flex-col gap-2 border-r border-[#404040] p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[1].text}
              </p>
            </div>
            <div className="w-1/2 flex flex-col gap-2 p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[2].text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tablet (md → lg) ── */}
      <div className="hidden md:flex lg:hidden flex-col mx-auto border border-[#404040]">
        <div className="flex">
          {/* Left: Photo + heading */}
          <div className="w-1/2 shrink-0 flex flex-col border-r border-[#404040]">
            {/* Logo + heading */}
            <div className="flex flex-col gap-4 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
                alt="Rocketmind"
                className="h-12 w-auto self-start"
              />
              <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0] whitespace-pre-line">
                {heading}
              </h2>
            </div>

            {/* Photo */}
            <div className="relative flex-1 min-h-[300px]">
              <Image
                src={`${BASE_PATH}/images/about/alexey-eremin.png`}
                alt={founderName}
                fill
                className="object-cover object-top"
                sizes="50vw"
              />
            </div>

            {/* Founder info */}
            <div className="flex flex-col gap-2 p-8">
              <span className="h4 text-[#F0F0F0]">{founderName}</span>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#F0F0F0]">
                {founderBio}
              </p>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {founderRole}
              </p>
            </div>
          </div>

          {/* Right: Feature cards stacked */}
          <div className="w-1/2 flex flex-col">
            {/* AI Agents */}
            <div className="flex flex-col gap-4 border-b border-[#404040] p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[0].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[0].text}
              </p>
              <MascotCarousel size="compact" />
            </div>

            {/* 20 лет */}
            <div className="flex flex-col gap-2 border-b border-[#404040] p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[1].text}
              </p>
            </div>

            {/* Экспертная команда */}
            <div className="flex flex-col gap-2 p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                {features[2].text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col">
        {/* Logo + heading */}
        <div className="flex flex-col gap-3 px-5 pt-8 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
            alt="Rocketmind"
            className="h-8 w-auto self-start"
          />
          <h2 className="h1 text-[#F0F0F0] whitespace-pre-line">{heading}</h2>
        </div>

        {/* Founder photo */}
        <div className="relative w-full aspect-[4/5]">
          <Image
            src={`${BASE_PATH}/images/about/alexey-eremin.png`}
            alt={founderName}
            fill
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>

        {/* Founder info */}
        <div className="flex flex-col gap-2 px-5 py-6">
          <span className="h4 text-[#F0F0F0]">{founderName}</span>
          <p className="text-[length:var(--text-14)] leading-[1.28] text-[#F0F0F0]">
            {founderBio}
          </p>
          <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
            {founderRole}
          </p>
        </div>

        {/* Feature cards stacked */}
        <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
          <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
          <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
            {features[1].text}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
          <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
          <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
            {features[2].text}
          </p>
        </div>

        {/* AI Agents — last on mobile */}
        <div className="flex flex-col gap-4 border-t border-[#404040] px-5 py-6">
          <h3 className="h4 text-[#F0F0F0]">{features[0].title}</h3>
          <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
            {features[0].text}
          </p>
          <MascotCarousel size="compact" />
        </div>
      </div>
    </section>
  );
}
