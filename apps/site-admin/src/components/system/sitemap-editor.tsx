"use client";

import { useEffect, useRef, useState } from "react";
import { Save, RotateCcw, ExternalLink, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@rocketmind/ui";

type Source = "auto" | "override";
type Toast = { type: "success" | "error"; message: string };

export function SitemapEditor() {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [source, setSource] = useState<Source>("auto");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== savedContent;

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/sitemap");
      const text = await res.text();
      const src =
        (res.headers.get("X-Sitemap-Source") as Source | null) ?? "auto";
      setContent(text);
      setSavedContent(text);
      setSource(src);
    } catch {
      showToast("error", "Не удалось загрузить sitemap");
    } finally {
      setLoading(false);
    }
  }

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/sitemap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSavedContent(content);
      setSource("override");
      showToast("success", "sitemap.xml сохранён");
    } catch {
      showToast("error", "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  function handleResetEdits() {
    setContent(savedContent);
    textareaRef.current?.focus();
  }

  async function handleRevertToAuto() {
    if (
      !confirm(
        "Удалить ручную правку и вернуться к автогенерации? Текущая ручная версия будет потеряна.",
      )
    ) {
      return;
    }
    setReverting(true);
    try {
      const del = await fetch("/api/sitemap", { method: "DELETE" });
      if (!del.ok) throw new Error(await del.text());
      await load();
      showToast("success", "Вернулись к автогенерации");
    } catch {
      showToast("error", "Не удалось сбросить");
    } finally {
      setReverting(false);
    }
  }

  async function handleRegenerate() {
    if (
      isDirty &&
      !confirm(
        "Вставить свежесгенерированную версию вместо текущего текста? Несохранённые правки будут потеряны.",
      )
    ) {
      return;
    }
    setRegenerating(true);
    try {
      const res = await fetch("/api/sitemap?source=auto");
      const text = await res.text();
      setContent(text);
      showToast("success", "Сгенерировано из контента");
      textareaRef.current?.focus();
    } catch {
      showToast("error", "Не удалось сгенерировать");
    } finally {
      setRegenerating(false);
    }
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
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[length:var(--text-16)] font-semibold text-foreground">
            sitemap.xml
          </h2>
          <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground">
            Карта сайта для поисковых роботов.{" "}
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-foreground underline underline-offset-2 hover:no-underline"
            >
              /sitemap.xml
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <p className="mt-2 flex items-center gap-2 text-[length:var(--text-12)] text-muted-foreground">
            Источник:{" "}
            {source === "auto" ? (
              <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono text-[length:var(--text-11)] text-foreground">
                автогенерация
              </span>
            ) : (
              <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 font-mono text-[length:var(--text-11)] text-amber-600 dark:text-amber-400">
                ручная правка
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isDirty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetEdits}
              disabled={saving || reverting || regenerating}
              className="gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Отменить
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || reverting || regenerating || !isDirty}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[length:var(--text-11)] text-muted-foreground">
              sitemap.xml
            </span>
            {isDirty && (
              <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 font-mono text-[length:var(--text-10)] text-amber-600 dark:text-amber-400">
                несохранённые изменения
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleRegenerate}
              disabled={saving || reverting || regenerating}
              className="gap-1.5 text-muted-foreground"
              title="Подставить свежий XML, собранный из текущего контента"
            >
              <Wand2 className="h-3 w-3" />
              {regenerating ? "Генерация…" : "Сгенерировать заново"}
            </Button>
            {source === "override" && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleRevertToAuto}
                disabled={saving || reverting || regenerating}
                className="gap-1.5 text-muted-foreground"
                title="Удалить ручную правку и вернуться к автогенерации"
              >
                <RefreshCw className="h-3 w-3" />
                {reverting ? "Сброс…" : "Вернуть автогенерацию"}
              </Button>
            )}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="w-full flex-1 resize-none bg-background p-4 font-mono text-[length:var(--text-12)] text-foreground outline-none placeholder:text-muted-foreground"
          style={{ minHeight: "420px" }}
          rows={Math.max(20, content.split("\n").length + 2)}
        />
      </div>

      <p className="mt-3 text-[length:var(--text-12)] text-muted-foreground">
        По умолчанию карта собирается автоматически из контента. После
        «Сохранить» применится ручная версия — она будет отдаваться как есть,
        пока не нажмёте «Вернуть автогенерацию».
      </p>

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
    </div>
  );
}
