import { redirect } from "next/navigation";

// Deprecated: онбординг переехал в чат с R-менеджером.
// Оставляем редирект для обратной совместимости.
export default function OnboardingIndexPage() {
  redirect("/manager");
}
