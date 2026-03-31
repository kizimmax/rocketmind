import Image from "next/image";
import Link from "next/link";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

/**
 * CTA Yellow — жёлтый вариант с золотым сечением.
 *
 * Figma: 458-436 (desktop 646×400, fill #F0F0F0) / 458-437 (mobile 353×571, fill white)
 * - Фон: #FFCC00 (--rm-yellow-100)
 * - Текст и кнопка: #0A0A0A (тёмный)
 * - Кнопка: #0A0A0A bg, #F0F0F0 текст; hug width (w-fit) на всех брейкпоинтах
 * - Декор desktop: спираль 646×400 px, правые ~47%, масштабируется по высоте блока
 * - Декор mobile:  спираль 353×571 px, абсолютная, проявляется под контентом
 * - Блок с rounded-[20px] и отступами от краёв (gaps)
 */
export function CTASectionYellow() {
  return (
    <section className="px-5 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <div className="bg-[#FFCC00] relative overflow-hidden rounded-none">

          {/* ── Spiral — height-bound, anchored right on all breakpoints ── */}
          <div
            className="absolute right-0 top-0 bottom-0 pointer-events-none flex items-center"
            aria-hidden="true"
          >
            <Image
              src={`${BASE_PATH}/images/cta/golden-spiral-mobile.svg`}
              alt=""
              width={353}
              height={571}
              className="h-full w-auto object-contain md:hidden"
              unoptimized
            />
            <Image
              src={`${BASE_PATH}/images/cta/golden-spiral-desktop.svg`}
              alt=""
              width={646}
              height={400}
              className="h-full w-auto object-contain hidden md:block"
              unoptimized
            />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10 p-5 md:px-8 md:py-11 xl:px-14">
            <div className="flex flex-col gap-9 max-w-[764px]">

              {/* H2 + body copy */}
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-[24px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.2] md:leading-[1.08] tracking-[-0.01em] md:tracking-[-0.02em] text-[#0A0A0A]">
                  Хотите увидеть, как команда Rocketmind решит вашу стратегическую задачу?
                </h2>
                <p className="text-[14px] md:text-[15px] xl:text-[18px] leading-[1.32] text-[#0A0A0A] xl:max-w-[672px]">
                  Заполните форму — мы проведём экспресс‑оценку ситуации, обозначим возможные сценарии решения и предложим следующий шаг
                </p>
              </div>

              {/* Button — mobile: full-width, desktop: hug width */}
              <Link
                href="#contact"
                className="w-fit flex items-center justify-center bg-[#0A0A0A] text-[#F0F0F0] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-sm transition-opacity hover:opacity-85 active:opacity-70"
              >
                оставить заявку
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
