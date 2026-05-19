"use client";

import { Dialog, DialogContent, Button } from "@rocketmind/ui";

interface ProgramClosedModalProps {
  programTitle: string;
  open: boolean;
  onClose: () => void;
}

export function ProgramClosedModal({
  programTitle,
  open,
  onClose,
}: ProgramClosedModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col gap-5 py-2 text-center">
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Программа завершена
          </h2>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Ваша обучающая программа{" "}
            <span className="text-foreground">«{programTitle}»</span>{" "}
            завершена. Теперь доступ к AI-экспертам возможен только по подписке.
          </p>
          <Button onClick={onClose}>Продолжить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
