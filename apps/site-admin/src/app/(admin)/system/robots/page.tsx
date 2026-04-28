"use client";

import { useEffect, useRef, useState } from "react";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@rocketmind/ui";

export default function RobotsPage() {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== savedContent;

  useEffect(() => {
    fetch("/api/robots")
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setSavedContent(text);
      })
      .catch(() => showToast("error", "Не удалось загрузить файл"))
      .finally(() => setLoading(false));
  }, []);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/robots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSavedContent(content);
      showToast("success", "robots.txt сохранён");
    } catch {
      showToast("error", "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setContent(savedContent);
    textareaRef.current?.focus();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">
            robots.txt
          </h1>
          <p className="mt-1 text-[length:var(--text-13)] text-muted-foreground">
            Инструкции для поисковых роботов. Файл доступен по адресу{" "}
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-foreground underline underline-offset-2 hover:no-underline"
            >
              /robots.txt
              <ExternalLink className="h-3 w-3" />
            </a>
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
              Сбросить
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
          <span className="font-mono text-[length:var(--text-11)] text-muted-foreground">
            robots.txt
          </span>
          {isDirty && (
            <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 font-mono text-[length:var(--text-10)] text-amber-600 dark:text-amber-400">
              несохранённые изменения
            </span>
          )}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="w-full resize-none bg-background p-4 font-mono text-[length:var(--text-13)] text-foreground outline-none placeholder:text-muted-foreground"
          style={{ minHeight: "320px" }}
          rows={Math.max(16, content.split("\n").length + 2)}
          placeholder="User-agent: *&#10;Disallow: /admin/&#10;Allow: /&#10;Sitemap: https://example.com/sitemap.xml"
        />
      </div>

      {/* Hint */}
      <p className="mt-3 text-[length:var(--text-12)] text-muted-foreground">
        Изменения вступят в силу после следующего деплоя, если сайт собирается статически. При серверном рендеринге — немедленно.
      </p>

      {/* Toast */}
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
