import Link from "next/link";

export function CTASection() {
  return (
    <section id="contact" className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pb-14 xl:pb-20">
        {/* ─────────────────────────────────────────────────────────────────
         *  CTA container: 1400×424px in Figma
         *  - border #404040
         *  - dark bg #0A0A0A
         *  - overflow-hidden to clip the decorative circle
         * ──────────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border border-border bg-[#0A0A0A] min-h-[320px] xl:min-h-[424px]">

          {/* ── Decorative circle (right side) ──────────────────────────── */}
          {/*   Figma: 789×789px, x:555 y:-182 in 1400px container          */}
          {/*   Has a repeating dot pattern + subtle yellow radial glow      */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 789,
              height: 789,
              /* ~39.6% from left = 555/1400 */
              left: "calc(39.6%)",
              top: -182,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundImage: [
                  /* Yellow radial glow at the edge (Figma: rgba(219,200,0,0.14) at 100%) */
                  "radial-gradient(circle at 50% 50%, transparent 86%, rgba(219,200,0,0.14) 100%)",
                  /* Repeating dot grid pattern (~16% of 789px ≈ 126px tile → simplified to 24px) */
                  "radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)",
                ].join(", "),
                backgroundSize: "100% 100%, 24px 24px",
                backgroundRepeat: "no-repeat, repeat",
              }}
            />
          </div>

          {/* ── Gradient overlay: solid dark left → transparent right ──── */}
          {/*   Figma: linear-gradient(90deg, rgba(10,10,10,1) 38%, rgba(10,10,10,0) 100%) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,10,1) 38%, rgba(10,10,10,0) 80%)",
            }}
          />

          {/* ── Text and Button ─────────────────────────────────────────── */}
          {/*   Figma: x:56, y:56, width:764px, column, gap:36px            */}
          <div className="relative z-10 flex flex-col gap-9 p-8 xl:p-14 xl:max-w-[764px]">

            {/* Text block: H2 + Copy 18 */}
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-foreground">
                Хотите увидеть, как команда Rocketmind решит вашу стратегическую задачу?
              </h2>
              <p className="text-[15px] xl:text-[18px] leading-[1.2] text-muted-foreground xl:max-w-[672px]">
                Заполните форму — мы проведём экспресс-оценку ситуации, обозначим возможные сценарии решения и предложим следующий шаг
              </p>
            </div>

            {/* CTA button: Lable 16 — Loos Condensed Medium, 16px, 4% tracking, uppercase */}
            {/* Yellow bg (#FFCC00), dark text (#0A0A0A), border-radius 4px */}
            <Link
              href="#"
              className="w-fit flex items-center gap-3 bg-[var(--rm-yellow-100)] text-[#0A0A0A] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-[4px] transition-opacity hover:opacity-85 active:opacity-70"
            >
              Оставить заявку
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
