import { redirect } from "next/navigation";

// Deprecated: страница переехала в /manager (чат с R-менеджером).
export default function OnboardingChatPage() {
  redirect("/manager");
}
