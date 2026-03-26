"use client";

import React from "react";
import Image from "next/image";
import { Canvas3DCarousel } from "@/components/blocks/Canvas3DCarousel";

export function PlatformOverview() {
  return (
    <section className="relative w-full bg-background py-16 lg:py-24" id="platform-overview">
      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="relative flex w-full flex-col lg:flex-row items-stretch">
          
          {/* Background Golden Line Pulse */}
          <div className="pointer-events-none absolute inset-0 z-0 hidden lg:flex items-center justify-center -ml-[1px]">
            <div className="relative h-[865px] w-[1398px] max-w-none rotate-180 opacity-40 lg:opacity-100">
              <Image
                src="/images/platform-block/golden-line-pulse.svg"
                alt=""
                fill
                className="object-contain"
              />
              {/* Animated Glow overlay */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  maskImage: `url(/images/platform-block/golden-line-pulse.svg)`,
                  WebkitMaskImage: `url(/images/platform-block/golden-line-pulse.svg)`,
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              >
                <div className="animate-golden-sweep absolute -left-[200%] top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-[#fc0] to-transparent xl:w-[200px]" />
              </div>
            </div>
          </div>

          {/* Left Column */}
          <div className="relative z-10 flex w-full flex-col shrink-0 lg:w-[536px]">
            {/* Grey line 01 Background */}
            <div className="pointer-events-none absolute inset-[0_0.5px_2px_0] hidden items-center justify-center lg:flex">
              <div className="h-[865px] w-[536px] flex-none rotate-180">
                <Image src="/images/platform-block/grey-line-01.svg" alt="" fill className="object-cover opacity-60" />
              </div>
            </div>

          {/* Div 01: Methodology */}
          <div className="relative w-full overflow-hidden border border-[var(--border,#404040)] p-8 lg:h-[332px] lg:p-12">
            <div className="absolute inset-[-0.15%_-0.24%] opacity-50">
              <Image src="/images/platform-block/dop-line-bg.svg" alt="" fill className="object-cover" />
            </div>
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-col gap-2 uppercase">
                <p className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium leading-[1.16] tracking-[0.36px] text-[var(--accent,#fc0)]">
                  Методология
                </p>
                <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-bold leading-[1.16] tracking-[-0.32px] text-[var(--primary-text,#f0f0f0)]">
                  бизнес-дизайн
                </p>
              </div>
              <p className="font-['Roboto',sans-serif] text-[18px] font-normal leading-[1.2] text-[var(--primary-text,#f0f0f0)] pt-2 max-w-[400px]">
                Методология, которая помогает проектировать бизнес как систему: от ценности для клиента и модели дохода до логики роста,
                развития новых направлений и принятия стратегических решений.
              </p>
            </div>
          </div>

          {/* Div 02: AI Products */}
          <div className="relative flex w-full flex-col overflow-hidden border border-t-0 border-[var(--border,#404040)] p-8 lg:min-h-[535px] lg:p-12 pb-32">
            <div className="relative flex flex-col gap-4 z-10 w-full">
              <div className="flex flex-col gap-2 uppercase">
                <p className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium leading-[1.16] tracking-[0.36px] text-[var(--accent,#fc0)]">
                  AI-продукты и опыт экспертов
                </p>
                <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-bold leading-[1.16] tracking-[-0.32px] text-[var(--primary-text,#f0f0f0)]">
                  Синергия ОПЫТА с ИИ
                </p>
              </div>
              <p className="font-['Roboto',sans-serif] text-[18px] font-normal leading-[1.2] text-[var(--primary-text,#f0f0f0)] pt-2 max-w-[420px]">
                В работе с клиентами мы соединяем искусственный и естественный интеллект: ИИ ускоряет анализ и проработку решений, а эксперты добавляют стратегическое мышление и практику внедрения. Методология даёт путь к росту и запуску новых моделей развития.
              </p>
            </div>

            {/* Mascot Cards */}
            <div className="relative mt-12 flex flex-col gap-4 lg:absolute lg:top-[280px] lg:mt-0 lg:-ml-12 lg:h-[200px] lg:w-full">
              {/* Mascot 1 */}
              <div className="relative flex h-[80px] w-full max-w-[275px] items-center rounded-[3.5px] border border-[rgba(64,64,64,0.8)] bg-[#121212]">
                <div className="absolute -top-1 -left-1 h-full w-[100px] overflow-visible">
                  {/* Radial Gradient BG for Mascot */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.5)_0%,transparent_70%)] opacity-30 mix-blend-screen" />
                  <Image src="/images/platform-block/mascot-1.png" alt="Маскот" fill className="object-contain" />
                </div>
                <div className="relative ml-[90px] pr-2">
                  <div className="absolute inset-0 -z-10 bg-[url('/images/platform-block/rectangle-bg.svg')] bg-cover opacity-80" />
                  <p className="font-['Roboto',sans-serif] text-[12px] leading-[1.36] tracking-[0.24px] text-[#e0e0e0] py-2">
                    Предложи бизнес-модель для моего продукта
                  </p>
                </div>
              </div>

              {/* Mascot 2 */}
              <div className="relative flex h-[76px] w-full max-w-[244px] items-center rounded-[3.5px] border border-[rgba(64,64,64,0.8)] bg-[#121212] lg:ml-[128px]">
                <div className="absolute -top-[12px] -left-[10px] h-full w-[100px] overflow-visible">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.5)_0%,transparent_70%)] opacity-30 mix-blend-screen" />
                  <Image src="/images/platform-block/mascot-2.png" alt="Маскот 2" fill className="object-contain" />
                </div>
                <div className="relative ml-[85px] mr-2 flex items-center pr-2 py-2">
                  <p className="font-['Roboto',sans-serif] text-[12px] leading-[1.36] tracking-[0.24px] text-[#e0e0e0]">
                    Привет!<br />Я Лида, тестировщик гипотез. С чего начнём?
                  </p>
                  <Image src="/images/platform-block/mascot-icon.png" alt="" width={16} height={16} className="ml-2 h-4 w-4 shrink-0 object-contain" />
                </div>
              </div>
            </div>
            </div>
          </div>

        {/* Right Column (Canvas animation) */}
        <div className="relative flex w-full flex-col items-center justify-center shrink-0 lg:w-[864px]">
          {/* Grey Line 02 (Hidden on Mobile) */}
          <div className="pointer-events-none absolute inset-[1.25px_0_1.25px_2px] hidden items-center justify-center lg:flex">
            <div className="h-[864px] w-[862px] flex-none rotate-180">
              <Image src="/images/platform-block/grey-line-02.svg" alt="" fill className="object-contain" />
            </div>
          </div>

          <div className="relative flex w-full flex-col overflow-hidden border border-[var(--border,#404040)] lg:border-l-0 lg:h-[867px] lg:w-[864px]">
            {/* Header copy */}
            <div className="relative flex flex-col gap-4 p-8 lg:p-12 pb-0 z-20">
              <div className="flex flex-col gap-2 uppercase">
                <p className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium leading-[1.16] tracking-[0.36px] text-[var(--accent,#fc0)]">
                  Канвасы
                </p>
                <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-bold leading-[1.16] tracking-[-0.32px] text-[var(--primary-text,#f0f0f0)] max-w-[400px]">
                  цифровые платформы и экосистемы
                </p>
              </div>
              <p className="font-['Roboto',sans-serif] text-[18px] font-normal leading-[1.2] text-[var(--primary-text,#f0f0f0)] mt-2 max-w-[650px]">
                Особый фокус Rocketmind — цифровые платформы и бизнес-экосистемы. Мы используем и развиваем международную методологию Platform Innovation Kit, а также представляем её в России и странах Азии, помогая компаниям проектировать платформенные модели, находить новые точки роста и выстраивать более сильную архитектуру бизнеса.
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative mt-12 flex h-[500px] w-full items-center justify-center lg:absolute lg:top-[241px] lg:left-[47px] lg:mt-0 lg:h-[623px] lg:w-[768px] lg:justify-start">
              <div className="transform scale-[0.6] sm:scale-75 lg:scale-100 lg:origin-top-left -ml-16 sm:ml-0 lg:-ml-0 relative w-[768px]">
                <Canvas3DCarousel />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>


      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sweep {
          0% { left: -100%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-golden-sweep {
          animation: sweep 6s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}
