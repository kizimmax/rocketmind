"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Palette,
} from "lucide-react";
import { Button, Input, Textarea } from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { NbspInput } from "@/components/system/nbsp-input";
import type { DsAccentColor, MediaTagSeo } from "@/lib/types";

const DS_ACCENT_COLORS: ReadonlyArray<{
  id: DsAccentColor;
  label: string;
  /** CSS-токен для swatch (фон бейджа на карточке). */
  cssVar: string;
}> = [
  { id: "yellow",     label: "Жёлтый",     cssVar: "--rm-yellow-100" },
  { id: "violet",     label: "Фиолетовый", cssVar: "--rm-violet-100" },
  { id: "sky",        label: "Бирюзовый",  cssVar: "--rm-sky-100" },
  { id: "terracotta", label: "Терракотовый", cssVar: "--rm-terracotta-100" },
  { id: "pink",       label: "Розовый",    cssVar: "--rm-pink-100" },
  { id: "blue",       label: "Синий",      cssVar: "--rm-blue-100" },
  { id: "red",        label: "Красный",    cssVar: "--rm-red-100" },
  { id: "green",      label: "Зелёный",    cssVar: "--rm-green-100" },
];

/**
 * Менеджер тегов медиа-раздела — справочник.
 * Создание, переименование, деактивация (скрытие с публичных страниц),
 * удаление (с удалением тега у всех статей).
 */
type SeoDraft = Required<{
  pageTitlePrefix: string;
  pageTitleAccent: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
}>;

const EMPTY_SEO: SeoDraft = {
  pageTitlePrefix: "",
  pageTitleAccent: "",
  metaTitle: "",
  metaDescription: "",
  intro: "",
};

function seoFrom(seo: MediaTagSeo | undefined): SeoDraft {
  return {
    pageTitlePrefix: seo?.pageTitlePrefix ?? "",
    pageTitleAccent: seo?.pageTitleAccent ?? "",
    metaTitle: seo?.metaTitle ?? "",
    metaDescription: seo?.metaDescription ?? "",
    intro: seo?.intro ?? "",
  };
}

export function TagManager() {
  const {
    mediaTags,
    articles,
    upsertMediaTag,
    renameMediaTag,
    deleteMediaTag,
    toggleMediaTagDisabled,
    updateMediaTagSeo,
    setMediaTagCardColor,
  } = useAdminStore();

  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [seoEditingId, setSeoEditingId] = useState<string | null>(null);
  const [seoDraft, setSeoDraft] = useState<SeoDraft>(EMPTY_SEO);

  const usage = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of articles) for (const t of a.tagIds) map[t] = (map[t] ?? 0) + 1;
    // Системные теги: учитываем статьи с подходящим article.type
    // (фильтр на /media читает type, а не tagIds).
    map.lesson =
      (map.lesson ?? 0) +
      articles.filter((a) => a.type === "lesson").length;
    map.case =
      (map.case ?? 0) + articles.filter((a) => a.type === "case").length;
    return map;
  }, [articles]);

  const [colorPickerId, setColorPickerId] = useState<string | null>(null);

  function handleCreate() {
    const t = newLabel.trim();
    if (!t) return;
    const tag = upsertMediaTag(t);
    toast.success(`Тег «${tag.label}» добавлен`);
    setNewLabel("");
  }

  function handleStartEdit(id: string, label: string) {
    setEditingId(id);
    setEditLabel(label);
  }

  function handleSaveEdit() {
    if (!editingId) return;
    const t = editLabel.trim();
    if (!t) return;
    renameMediaTag(editingId, t);
    toast.success("Тег переименован");
    setEditingId(null);
  }

  function handleToggleDisabled(id: string, currentlyDisabled: boolean) {
    toggleMediaTagDisabled(id);
    const tag = mediaTags.find((x) => x.id === id);
    if (currentlyDisabled) {
      toast.success(`Тег «${tag?.label}» снова активен`);
    } else {
      toast.info(`Тег «${tag?.label}» скрыт с публичных страниц`);
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const tag = mediaTags.find((x) => x.id === deleteTarget);
    deleteMediaTag(deleteTarget);
    setDeleteTarget(null);
    toast.success(`Тег «${tag?.label}» удалён`);
  }

  function handleStartSeoEdit(id: string) {
    const tag = mediaTags.find((x) => x.id === id);
    setSeoEditingId(id);
    setSeoDraft(seoFrom(tag?.seo));
  }

  function handleSaveSeo() {
    if (!seoEditingId) return;
    updateMediaTagSeo(seoEditingId, seoDraft);
    setSeoEditingId(null);
    toast.success("SEO для тега сохранено");
  }

  function handleCancelSeo() {
    setSeoEditingId(null);
    setSeoDraft(EMPTY_SEO);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder="Название тега"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreate}
          disabled={!newLabel.trim()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Добавить тег
        </Button>
      </div>

      {mediaTags.length === 0 ? (
        <p className="py-8 text-center text-[length:var(--text-14)] text-muted-foreground">
          Справочник тегов пуст.
        </p>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border">
          <table className="w-full text-left text-[length:var(--text-14)]">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="py-2 px-3">Название</th>
                <th className="py-2 px-3 w-[180px]">Slug</th>
                <th className="py-2 px-3 w-[120px]">Статьи</th>
                <th className="py-2 px-3 w-[140px]"></th>
              </tr>
            </thead>
            <tbody>
              {mediaTags.flatMap((t) => {
                const isEditing = editingId === t.id;
                const isDisabled = !!t.disabled;
                const isSeoEditing = seoEditingId === t.id;
                const hasSeo = !!t.seo && Object.keys(t.seo).length > 0;
                const isSystem = !!t.system;
                const isPickingColor = colorPickerId === t.id;
                const rows = [];
                rows.push(
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <Input
                          size="sm"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          className="max-w-xs"
                        />
                      ) : (
                        <span className="flex items-center gap-2">
                          <span
                            className={
                              isDisabled
                                ? "font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em] text-muted-foreground line-through"
                                : "font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em] text-foreground"
                            }
                          >
                            {t.label}
                          </span>
                          {isSystem && (
                            <span
                              className="inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground"
                              title="Системный тег — нельзя удалить. Фильтр работает по типу статьи."
                            >
                              Системный
                            </span>
                          )}
                          {isSystem && t.cardColor && (
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-border"
                              style={{
                                backgroundColor: `var(--rm-${t.cardColor}-100)`,
                              }}
                              title={`Цвет на карточке: ${t.cardColor}`}
                            />
                          )}
                          {isDisabled && (
                            <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
                              Скрыт
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground font-mono text-[length:var(--text-12)]">
                      {t.id}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {usage[t.id] ?? 0}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Сохранить"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Отмена"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleDisabled(t.id, isDisabled)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label={isDisabled ? "Включить тег" : "Скрыть тег"}
                              title={
                                isDisabled
                                  ? "Показать тег на публичных страницах"
                                  : "Скрыть тег с публичных страниц"
                              }
                            >
                              {isDisabled ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(t.id, t.label)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Переименовать"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                isSeoEditing
                                  ? handleCancelSeo()
                                  : handleStartSeoEdit(t.id)
                              }
                              className={
                                hasSeo || isSeoEditing
                                  ? "rounded-sm p-1 text-[var(--rm-yellow-100)] hover:bg-muted"
                                  : "rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              }
                              aria-label="SEO для tag-страницы"
                              title={
                                hasSeo
                                  ? "SEO задано — изменить"
                                  : "SEO для tag-страницы"
                              }
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>
                            {isSystem ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setColorPickerId(
                                    isPickingColor ? null : t.id,
                                  )
                                }
                                className={
                                  isPickingColor
                                    ? "rounded-sm p-1 text-foreground bg-muted"
                                    : "rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }
                                aria-label="Цвет на карточке"
                                title="Цвет бейджа на карточке /media"
                              >
                                <Palette className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(t.id)}
                                className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                aria-label="Удалить"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>,
                );
                if (isSystem && isPickingColor) {
                  rows.push(
                    <tr
                      key={`${t.id}-color`}
                      className="border-b border-border bg-muted/20"
                    >
                      <td colSpan={4} className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[length:var(--text-12)] text-muted-foreground">
                            Цвет бейджа на карточке /media:
                          </span>
                          <div className="flex items-center gap-2">
                            {DS_ACCENT_COLORS.map((c) => {
                              const active = t.cardColor === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setMediaTagCardColor(t.id, c.id);
                                    toast.success(
                                      `Цвет бейджа «${t.label}» — ${c.label.toLowerCase()}`,
                                    );
                                  }}
                                  className={
                                    active
                                      ? "h-6 w-6 rounded-full border-2 border-foreground"
                                      : "h-6 w-6 rounded-full border border-border hover:border-foreground"
                                  }
                                  style={{
                                    backgroundColor: `var(${c.cssVar})`,
                                  }}
                                  aria-label={c.label}
                                  title={c.label}
                                />
                              );
                            })}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setColorPickerId(null)}
                            className="ml-auto"
                          >
                            Закрыть
                          </Button>
                        </div>
                      </td>
                    </tr>,
                  );
                }
                if (isSeoEditing) {
                  rows.push(
                    <tr key={`${t.id}-seo`} className="border-b border-border bg-muted/20">
                      <td colSpan={4} className="px-3 py-4">
                        <div className="flex flex-col gap-3">
                          <p className="text-[length:var(--text-12)] text-muted-foreground">
                            SEO-настройки для страниц{" "}
                            <code className="font-mono">/media/tag/{t.id}</code>{" "}и{" "}
                            <code className="font-mono">
                              /media/glossary/tag/{t.id}
                            </code>
                            . Пустые поля = дефолты («Медиа» / «Глоссарий» + название тега).
                          </p>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <label className="flex flex-col gap-1">
                              <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                                H1 — основная часть
                              </span>
                              <NbspInput
                                size="sm"
                                placeholder="Медиа / Глоссарий"
                                value={seoDraft.pageTitlePrefix}
                                onChange={(v) =>
                                  setSeoDraft((s) => ({
                                    ...s,
                                    pageTitlePrefix: v,
                                  }))
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-1">
                              <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                                H1 — акцент (секондари)
                              </span>
                              <NbspInput
                                size="sm"
                                placeholder={t.label}
                                value={seoDraft.pageTitleAccent}
                                onChange={(v) =>
                                  setSeoDraft((s) => ({
                                    ...s,
                                    pageTitleAccent: v,
                                  }))
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-1 md:col-span-2">
                              <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                                Meta title
                              </span>
                              <Input
                                size="sm"
                                placeholder="Авто из H1 + | Rocketmind"
                                value={seoDraft.metaTitle}
                                onChange={(e) =>
                                  setSeoDraft((s) => ({
                                    ...s,
                                    metaTitle: e.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-1 md:col-span-2">
                              <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                                Meta description
                              </span>
                              <Textarea
                                rows={2}
                                placeholder="Короткое описание для выдачи."
                                value={seoDraft.metaDescription}
                                onChange={(e) =>
                                  setSeoDraft((s) => ({
                                    ...s,
                                    metaDescription: e.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-1 md:col-span-2">
                              <span className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground">
                                Лид-текст под H1 (опционально)
                              </span>
                              <Textarea
                                rows={3}
                                placeholder="Один абзац лида, виден на странице."
                                value={seoDraft.intro}
                                onChange={(e) =>
                                  setSeoDraft((s) => ({
                                    ...s,
                                    intro: e.target.value,
                                  }))
                                }
                              />
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" onClick={handleSaveSeo}>
                              Сохранить SEO
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelSeo}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>,
                  );
                }
                return rows;
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить тег?"
        description={
          deleteTarget
            ? `Тег будет удалён у ${usage[deleteTarget] ?? 0} статей. Это действие нельзя отменить.`
            : ""
        }
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
