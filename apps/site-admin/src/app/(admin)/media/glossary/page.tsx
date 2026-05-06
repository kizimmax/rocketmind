import { redirect } from "next/navigation";

/**
 * /media/glossary раньше падал в /media/[slug] и рендерил «Статья не найдена».
 * Теперь — редирект на /media?tab=glossary (там уже есть таб «Глоссарий»).
 */
export default function GlossaryRedirect() {
  redirect("/media?tab=glossary");
}
