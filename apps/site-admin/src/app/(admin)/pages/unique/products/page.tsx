"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { ProductCategoriesEditor } from "@/components/system/product-categories-editor";

const BACK_HREF = "/pages?section=unique";

/**
 * Уникальная страница «Продукты» — кастомный редактор для SEO-настроек
 * tag-страниц `/products/<категория>`. Отдельный route, потому что страница
 * не имеет блочной структуры — стандартный EditorShell тут не подходит.
 *
 * Точный сегмент `pages/unique/products` имеет приоритет над catch-all
 * `pages/[...pageId]`, который рендерит обычный редактор через
 * `PageEditorClient`.
 *
 * Стрелка выхода и переходы из шапки одинаково проходят через
 * navigation-guard: если в редакторе есть несохранённые правки, появляется
 * модалка `UnsavedChangesDialog` (ловится внутри ProductCategoriesEditor по
 * `pendingHref`).
 */
export default function UniqueProductsPage() {
  const router = useRouter();
  const { tryNavigate } = useNavigationGuard();

  function handleBack() {
    if (tryNavigate(BACK_HREF)) {
      router.push(BACK_HREF);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-[length:var(--text-18)] font-semibold text-foreground">
            Продукты
          </h1>
          <p className="text-[length:var(--text-12)] text-muted-foreground">
            SEO-настройки tag-страниц <code className="font-mono">/products/&lt;категория&gt;</code>
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <ProductCategoriesEditor />
        </div>
      </div>
    </div>
  );
}
