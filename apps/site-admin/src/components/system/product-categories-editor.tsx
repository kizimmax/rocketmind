"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw } from "lucide-react";
import { Button, Input, Textarea } from "@rocketmind/ui";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { UnsavedChangesDialog } from "@/components/page-editor/unsaved-changes-dialog";
import { NbspInput } from "@/components/system/nbsp-input";

const CATEGORY_DEFS: Array<{ id: CategoryId; label: string; route: string }> = [
  {
    id: "consulting",
    label: "Консалтинг и стратегия",
    route: "/products/consulting",
  },
  { id: "academy", label: "Онлайн-школа", route: "/products/academy" },
  { id: "expert", label: "Экспертные продукты", route: "/products/expert" },
  { id: "ai-products", label: "AI-продукты", route: "/products/ai-products" },
];

type CategoryId = "consulting" | "academy" | "expert" | "ai-products";

interface CategorySeo {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
}

type Toast = { type: "success" | "error"; message: string };

const EMPTY: Required<CategorySeo> = {
  pageTitlePrefix: "",
  pageTitleAccent: "",
  metaTitle: "",
  metaDescription: "",
  intro: "",
};

function fromServer(seo: CategorySeo | undefined): Required<CategorySeo> {
  return {
    pageTitlePrefix: seo?.pageTitlePrefix ?? "",
    pageTitleAccent: seo?.pageTitleAccent ?? "",
    metaTitle: seo?.metaTitle ?? "",
    metaDescription: seo?.metaDescription ?? "",
    intro: seo?.intro ?? "",
  };
}

function toServer(seo: Required<CategorySeo>): CategorySeo | undefined {
  const out: CategorySeo = {};
  for (const k of [
    "pageTitlePrefix",
    "pageTitleAccent",
    "metaTitle",
    "metaDescription",
    "intro",
  ] as const) {
    if (seo[k].trim()) out[k] = seo[k].trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function ProductCategoriesEditor() {
  const router = useRouter();
  const { setDirty, pendingHref, clearPending } = useNavigationGuard();

  const [draft, setDraft] = useState<Record<CategoryId, Required<CategorySeo>>>(
    () =>
      Object.fromEntries(CATEGORY_DEFS.map((c) => [c.id, EMPTY])) as Record<
        CategoryId,
        Required<CategorySeo>
      >,
  );
  const [saved, setSaved] = useState<Record<CategoryId, Required<CategorySeo>>>(
    draft,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [navigateTarget, setNavigateTarget] = useState<string | null>(null);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync dirty state to navigation guard so header tabs trigger the dialog.
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Cleanup on unmount: snimaem dirty, чтобы guard не висел после ухода.
  useEffect(() => {
    return () => setDirty(false);
  }, [setDirty]);

  // Перехватываем попытки навигации из шапки при наличии правок.
  useEffect(() => {
    if (pendingHref) {
      setNavigateTarget(pendingHref);
      setShowUnsaved(true);
      clearPending();
    }
  }, [pendingHref, clearPending]);

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/product-categories");
      const data = (await res.json()) as {
        categories?: Array<{ id: CategoryId; seo?: CategorySeo }>;
      };
      const next = Object.fromEntries(
        CATEGORY_DEFS.map((c) => {
          const found = (data.categories ?? []).find((x) => x.id === c.id);
          return [c.id, fromServer(found?.seo)];
        }),
      ) as Record<CategoryId, Required<CategorySeo>>;
      setDraft(next);
      setSaved(next);
    } catch {
      showToast("error", "Не удалось загрузить категории");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(): Promise<boolean> {
    setSaving(true);
    try {
      const payload = {
        categories: CATEGORY_DEFS.map((c) => ({
          id: c.id,
          seo: toServer(draft[c.id]),
        })),
      };
      const res = await fetch("/api/product-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(draft);
      showToast("success", "Категории сохранены");
      return true;
    } catch {
      showToast("error", "Ошибка при сохранении");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setDraft(saved);
  }

  // ── Unsaved-changes dialog handlers ───────────────────────────────────────

  async function handleSaveAndNavigate() {
    const ok = await handleSave();
    if (!ok) return; // ошибка сохранения — модалку оставляем открытой
    setShowUnsaved(false);
    if (navigateTarget) router.push(navigateTarget);
    setNavigateTarget(null);
  }

  function handleDiscardAndNavigate() {
    setDraft(saved);
    setShowUnsaved(false);
    if (navigateTarget) router.push(navigateTarget);
    setNavigateTarget(null);
  }

  function handleCancelDialog() {
    setShowUnsaved(false);
    setNavigateTarget(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-background shadow-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
            Категории каталога
          </h2>
          <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground">
            SEO-настройки для tag-страниц <code className="font-mono">/products/&lt;slug&gt;</code>.
            Пустые поля = дефолты («Продукты» + название категории).
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isDirty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={saving}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Отменить
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => void handleSave()}
            disabled={saving || !isDirty}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-lg border border-border bg-background p-5 shadow-sm">
        {CATEGORY_DEFS.map((cat) => {
          const d = draft[cat.id];
          const update = (patch: Partial<Required<CategorySeo>>) =>
            setDraft((prev) => ({ ...prev, [cat.id]: { ...prev[cat.id], ...patch } }));
          return (
            <div key={cat.id} className="flex flex-col gap-3 border-b border-border pb-6 last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[length:var(--text-14)] font-semibold text-foreground">
                  {cat.label}
                </h3>
                <code className="font-mono text-[length:var(--text-11)] text-muted-foreground">
                  {cat.route}
                </code>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                    H1 — основная часть
                  </span>
                  <NbspInput
                    size="sm"
                    placeholder="Продукты"
                    value={d.pageTitlePrefix}
                    onChange={(v) => update({ pageTitlePrefix: v })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                    H1 — акцент (секондари)
                  </span>
                  <NbspInput
                    size="sm"
                    placeholder={cat.label}
                    value={d.pageTitleAccent}
                    onChange={(v) => update({ pageTitleAccent: v })}
                  />
                </label>
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                    Meta title
                  </span>
                  <Input
                    size="sm"
                    placeholder="Авто из H1 + | Rocketmind"
                    value={d.metaTitle}
                    onChange={(e) => update({ metaTitle: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                    Meta description
                  </span>
                  <Textarea
                    rows={2}
                    placeholder="Короткое описание для выдачи."
                    value={d.metaDescription}
                    onChange={(e) => update({ metaDescription: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                    Лид-текст под H1 (опционально)
                  </span>
                  <Textarea
                    rows={3}
                    placeholder="Один абзац лида, виден на странице."
                    value={d.intro}
                    onChange={(e) => update({ intro: e.target.value })}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-[length:var(--text-13)] shadow-lg transition-all ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <UnsavedChangesDialog
        open={showUnsaved}
        onCancel={handleCancelDialog}
        onDiscard={handleDiscardAndNavigate}
        onSave={handleSaveAndNavigate}
      />
    </div>
  );
}
