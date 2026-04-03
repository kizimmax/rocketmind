import { cn } from "../../lib/utils";

/* ── CTASectionDark ── */

export type CTASectionDarkProps = {
  /** Heading text */
  heading?: string;
  /** Body text below heading */
  body?: string;
  /** Button label */
  buttonText?: string;
  /** Button href */
  href?: string;
  className?: string;
};

/**
 * CTA Dark — тёмный блок с жёлтой кнопкой и декоративным кругом.
 *
 * Figma: 1400×424 px
 * - Фон: #0A0A0A (dark bg)
 * - Кнопка: --rm-yellow-100 (#FFCC00)
 * - Декор: круг 789×789 px с dot-pattern и yellow radial glow
 */
export function CTASectionDark({
  heading = "Хотите увидеть, как команда Rocketmind решит вашу стратегическую задачу?",
  body = "Заполните форму — мы проведём экспресс\u2011оценку ситуации, обозначим возможные сценарии решения и предложим следующий шаг",
  buttonText = "Оставить заявку",
  href = "#contact",
  className,
}: CTASectionDarkProps) {
  return (
    <section className={cn("dark bg-background text-foreground", className)}>
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pb-14 xl:pb-20">
        <div className="relative overflow-hidden border border-border bg-[#0A0A0A] min-h-[320px] xl:min-h-[424px]">

          {/* Decorative circle — 789×789, dot pattern + yellow glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 789,
              height: 789,
              left: "calc(39.6%)",
              top: -182,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundImage: [
                  "radial-gradient(circle at 50% 50%, transparent 86%, rgba(219,200,0,0.14) 100%)",
                  "radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)",
                ].join(", "),
                backgroundSize: "100% 100%, 24px 24px",
                backgroundRepeat: "no-repeat, repeat",
              }}
            />
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,10,1) 38%, rgba(10,10,10,0) 80%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-9 p-8 xl:p-14 xl:max-w-[764px]">
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-foreground">
                {heading}
              </h2>
              <p className="text-[15px] xl:text-[18px] leading-[1.2] text-muted-foreground xl:max-w-[672px]">
                {body}
              </p>
            </div>

            <a
              href={href}
              className="w-fit flex items-center gap-3 bg-[var(--rm-yellow-100)] text-[#0A0A0A] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-[4px] transition-opacity hover:opacity-85 active:opacity-70"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
