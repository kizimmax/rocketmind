import Link from "next/link";
import type { CaseEntry } from "@/lib/cases";

/** Replace spaces after ≤2-letter words with non-breaking spaces. */
function nb(text: string): string {
  const apply = (t: string) =>
    t.replace(/(^|[ \t\u00A0])([а-яёА-ЯЁa-zA-Z]{1,2}) (?=\S)/gm, "$1$2\u00A0");
  return apply(apply(apply(text)));
}

/**
 * Arrow indicator (top-right of stats box). Same visual as product-card arrow:
 *  - 11×11 svg, color #404040 → white on hover
 *  - 40×40 wrapper, position offset by +2px → −2px (shift up & right) and scale-110 on group hover
 *  - Only rendered for big cases (which have an internal page).
 */
export function CaseArrow() {
  return (
    <div
      className="
        absolute top-[2px] right-[2px] z-10
        flex items-center justify-center w-10 h-10 rounded-[4px]
        text-[#404040] transition-all duration-200
        group-hover:text-[#F0F0F0]
        group-hover:-top-[2px] group-hover:-right-[2px]
        group-hover:scale-110
      "
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path
          d="M1 10L10 1M10 1H3M10 1V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Single case card — title, description, 3-stat grid, result.
 *
 * For `big` cases (have internal page): wrapped in <Link>, stats box gets
 * yellow border on hover and shows an arrow indicator in top-right that turns
 * white, shifts up/right and slightly scales — mirroring the product-card hover.
 *
 * For `mini` cases: no link, no arrow, no hover state.
 */
export function CaseCard({ entry }: { entry: CaseEntry }) {
  const { card, caseType, slug } = entry;
  const isBig = caseType === "big";

  const inner = (
    <div className="flex flex-col gap-5 lg:gap-11">
      <div className="flex flex-col gap-2 lg:gap-5">
        <h2 className="font-heading text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
          {nb(card.title)}
        </h2>
        <p className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] max-w-none xl:max-w-[70%]">
          {nb(card.description)}
        </p>
      </div>

      <div
        className={[
          "relative border p-5 sm:p-6 xl:p-8 transition-[border-color] duration-200",
          isBig
            ? "border-[#404040] group-hover:border-[var(--rm-yellow-100)]"
            : "border-[#404040]",
        ].join(" ")}
      >
        {isBig && <CaseArrow />}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {card.stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1 sm:gap-5 xl:justify-between">
              <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1 xl:flex-row xl:items-center xl:gap-3">
                <div className="font-heading text-[52px] sm:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                  {stat.value}
                </div>
                <div className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap">
                  {stat.label}
                </div>
              </div>
              <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                {nb(stat.description)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0] xl:max-w-[70%]">
        {nb(card.result)}
      </p>
    </div>
  );

  if (isBig) {
    // Big-cases теперь хранятся как Article с `type: "case"` и живут на
    // /media/<slug>. Стрелка `CaseArrow` остаётся (визуал не меняется).
    return (
      <Link href={`/media/${slug}`} className="block group">
        {inner}
      </Link>
    );
  }
  return inner;
}
