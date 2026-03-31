import { CasesSection } from "./CasesSection";
import { CTASection } from "./CTASection";

/**
 * Стандартный нижний блок страницы:
 *   Кейсы + отзывы + логотипы партнёров → CTA
 *
 * Добавляется на всех страницах, кроме /cases и /media.
 */
export function PageBottom() {
  return (
    <>
      <CasesSection />
      <CTASection />
    </>
  );
}
