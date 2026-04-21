"use client";

import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@rocketmind/ui";

interface PreviewableFile {
  name: string;
  size: number;
  url?: string;
  type?: string;
}

export function FilePreviewDialog({
  file,
  onOpenChange,
}: {
  file: PreviewableFile | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!file} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {file && (
          <>
            <DialogHeader>
              <DialogTitle className="break-all font-[family-name:var(--font-heading-family)]">
                {file.name}
              </DialogTitle>
              <DialogDescription className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                {formatSize(file.size)}
                {file.type ? ` · ${file.type}` : ""}
              </DialogDescription>
            </DialogHeader>
            <PreviewBody file={file} />
            {file.url && (
              <div className="flex justify-end">
                <a
                  href={file.url}
                  download={file.name}
                  className="inline-flex items-center rounded-sm border border-border bg-background px-3 py-1.5 text-[length:var(--text-14)] text-foreground transition-colors hover:border-foreground"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Скачать
                </a>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PreviewBody({ file }: { file: PreviewableFile }) {
  const { url, type, name } = file;
  if (!url) {
    return <Unsupported />;
  }
  if (type?.startsWith("image/")) {
    return (
      <div className="flex justify-center">
        <img
          src={url}
          alt={name}
          className="max-h-[60vh] max-w-full rounded-sm object-contain"
        />
      </div>
    );
  }
  if (type === "application/pdf") {
    return (
      <iframe
        src={url}
        title={name}
        className="h-[60vh] w-full rounded-sm border border-border bg-background"
      />
    );
  }
  if (type?.startsWith("text/") || /\.(txt|md|json|csv|log)$/i.test(name)) {
    return (
      <iframe
        src={url}
        title={name}
        className="h-[60vh] w-full rounded-sm border border-border bg-background"
      />
    );
  }
  return <Unsupported />;
}

function Unsupported() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <FileText className="h-8 w-8 text-muted-foreground" />
      <p className="text-[length:var(--text-14)] text-muted-foreground">
        Предпросмотр этого типа файла пока недоступен.
      </p>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
