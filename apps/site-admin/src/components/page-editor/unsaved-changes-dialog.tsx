"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rocketmind/ui";

interface Props {
  open: boolean;
  /** Список человекочитаемых полей, которые поменялись. Опционально. */
  changes?: string[];
  /** Остаться на странице — «Отмена». Также дергается при close по Esc / вне модалки. */
  onCancel: () => void;
  /** Отменить изменения и уйти. */
  onDiscard: () => void;
  /** Сохранить и уйти. */
  onSave: () => void;
}

/**
 * Единая модалка «Несохранённые изменения» для всех редакторов админки.
 * Используется в редакторе страниц (editor-shell) и редакторе статей
 * (article-editor). Шапка + (опциональный) список изменений + тройка кнопок
 * в футере: «Отмена» (остаться) слева, «Да, отменить» + «Да, сохранить» справа.
 */
export function UnsavedChangesDialog({
  open,
  changes = [],
  onCancel,
  onDiscard,
  onSave,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Несохранённые изменения</DialogTitle>
          <DialogDescription>
            {changes.length > 0 ? (
              <>
                <span className="mb-2 block">Вы изменили:</span>
                <ul className="mb-2 list-inside list-disc space-y-0.5">
                  {changes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <span>Что сделать с изменениями?</span>
              </>
            ) : (
              "Есть несохранённые изменения. Что сделать?"
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={onDiscard}>
              Да, отменить
            </Button>
            <Button onClick={onSave}>Да, сохранить</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
