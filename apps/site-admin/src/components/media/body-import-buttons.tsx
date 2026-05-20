"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { parseMarkdownToSections } from "@/lib/md-to-sections";
import type { ArticleSection } from "@/lib/types";

interface BodyImportButtonsProps {
  /** Текущие секции тела — для подсчёта и предупреждения о перезаписи. */
  currentSections: ArticleSection[];
  /** Колбэк применения импортированных секций (полная замена body). */
  onImport: (sections: ArticleSection[]) => void;
}

const TEMPLATE_URL = "/templates/body-template.md";

/**
 * Две кнопки в шапке редактора статьи/термина:
 *   • «Шаблон MD» — скачивает готовый MD-скелет;
 *   • «Загрузить MD» — открывает file-picker, парсит, спрашивает
 *     подтверждение перезаписи (если в теле уже есть секции), потом
 *     заменяет `sections` в локальном draft (БД не трогается до Save).
 */
export function BodyImportButtons({
  currentSections,
  onImport,
}: BodyImportButtonsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSections, setPendingSections] = useState<ArticleSection[] | null>(null);

  function handleDownload() {
    const a = document.createElement("a");
    a.href = TEMPLATE_URL;
    a.download = "body-template.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handlePickFile() {
    inputRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // позволяем загружать тот же файл повторно
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".md")) {
      toast.error("Ожидается файл .md");
      return;
    }
    try {
      const text = await file.text();
      const sections = parseMarkdownToSections(text);
      if (sections.length === 0) {
        toast.error("В файле не найдено ни одной секции (## Heading)");
        return;
      }
      if (currentSections.length > 0) {
        // Просим подтвердить перезапись.
        setPendingSections(sections);
      } else {
        applyImport(sections);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? `Ошибка парсинга: ${err.message}` : "Не удалось прочитать файл",
      );
    }
  }

  function applyImport(sections: ArticleSection[]) {
    onImport(sections);
    toast.success(`Импортировано: ${sections.length} секц.`);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".md,text/markdown,text/plain"
        onChange={handleFile}
        className="hidden"
      />
      <Button variant="outline" size="sm" onClick={handleDownload} title="Скачать MD-шаблон тела">
        <Download className="mr-1 h-4 w-4" />
        Шаблон MD
      </Button>
      <Button variant="outline" size="sm" onClick={handlePickFile} title="Загрузить MD-файл и заменить тело">
        <Upload className="mr-1 h-4 w-4" />
        Загрузить MD
      </Button>

      <ConfirmDialog
        open={pendingSections !== null}
        onOpenChange={(v) => !v && setPendingSections(null)}
        title="Заменить тело на импортированное?"
        description={`В теле уже ${currentSections.length} секц. Импорт полностью заменит их на ${pendingSections?.length ?? 0} новых. Изменения попадут в редактор — сохранение остаётся за вами.`}
        confirmLabel="Заменить"
        cancelLabel="Отмена"
        variant="destructive"
        onConfirm={() => {
          if (pendingSections) applyImport(pendingSections);
          setPendingSections(null);
        }}
      />
    </>
  );
}
