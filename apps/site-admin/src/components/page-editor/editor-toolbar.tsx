"use client";

import { Undo2, Redo2, X, ExternalLink } from "lucide-react";
import { Button, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@rocketmind/ui";

interface EditorToolbarProps {
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isPublished: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePublish: (published: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onPreview?: () => void | Promise<void>;
}

export function EditorToolbar({
  isDirty,
  canUndo,
  canRedo,
  isPublished,
  onUndo,
  onRedo,
  onTogglePublish,
  onSave,
  onCancel,
  onPreview,
}: EditorToolbarProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm border border-border bg-background px-4 py-3 shadow-lg">
      <TooltipProvider>
        {/* Undo */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canUndo}
                onClick={onUndo}
              />
            }
          >
            <Undo2 className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Отменить</TooltipContent>
        </Tooltip>

        {/* Redo */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canRedo}
                onClick={onRedo}
              />
            }
          >
            <Redo2 className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Повторить</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Publish switch */}
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--text-12)] text-muted-foreground">
            {isPublished ? "Опубликована" : "Скрыта"}
          </span>
          <Switch
            checked={isPublished}
            onCheckedChange={onTogglePublish}
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Cancel */}
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-sm" onClick={onCancel} />}
          >
            <X className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Отменить все изменения</TooltipContent>
        </Tooltip>

        {/* Preview */}
        {onPreview && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void onPreview()}
                >
                  <ExternalLink className="mr-1 h-3.5 w-3.5" />
                  Предпросмотр
                </Button>
              }
            >
              <span />
            </TooltipTrigger>
            <TooltipContent>Открыть на сайте в режиме черновика</TooltipContent>
          </Tooltip>
        )}

        {/* Save */}
        <Button
          disabled={!isDirty}
          onClick={onSave}
          className="bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] hover:bg-[var(--rm-yellow-700)]"
        >
          Сохранить изменения
        </Button>
      </TooltipProvider>
    </div>
  );
}
