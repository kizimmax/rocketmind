"use client";

import dynamic from "next/dynamic";
import { Download, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@rocketmind/ui";

// react-pdf тянет pdfjs worker и DOMMatrix — только в клиенте и только
// когда модал действительно показан. Грузим динамически, SSR выключен.
const PdfGallery = dynamic(() => import("./pdf-gallery").then((m) => m.PdfGallery), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] items-center justify-center text-[color:var(--rm-gray-fg-main)]">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  ),
});

export interface FilePreviewFile {
  /** Прямая ссылка на файл (например `/media/uploads/<slug>/<hash>.pdf`). */
  url: string;
  /** Оригинальное имя файла (для скачивания и заголовка окна). */
  fileName: string;
  /** Отображаемое имя (fallback → fileName). */
  displayName?: string;
}

interface Props {
  file: FilePreviewFile | null;
  onClose: () => void;
}

function detectKind(url: string): "pdf" | "image" | "other" {
  const ext = (url.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"].includes(ext)) return "image";
  return "other";
}

export function FilePreviewModal({ file, onClose }: Props) {
  const open = file !== null;
  const title = file ? file.displayName || file.fileName : "";
  const kind = file ? detectKind(file.url) : "other";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        // Широкое окно для PDF, рамки как в темной теме Rocketmind
        className="max-w-[min(1100px,95vw)] gap-0 border-[#404040] bg-[#0A0A0A] p-0 text-[color:var(--rm-gray-fg-main)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">{title || "Предпросмотр файла"}</DialogTitle>

        <header className="flex items-center justify-between gap-3 border-b border-[#404040] px-5 py-3">
          <h2 className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.02em]">
            {title || "Файл"}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {file && (
              <a
                href={file.url}
                download={file.fileName || undefined}
                target="_blank"
                rel="noopener noreferrer"
                title="Скачать"
                className="flex h-8 items-center gap-1.5 rounded-sm border border-[#404040] bg-transparent px-2.5 text-[length:var(--text-12)] text-[color:var(--rm-gray-fg-main)] transition-colors hover:border-[color:var(--rm-yellow-100)] hover:text-[color:var(--rm-yellow-100)]"
              >
                <Download className="h-3.5 w-3.5" />
                Скачать
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              title="Закрыть"
              className="flex h-8 w-8 items-center justify-center rounded-sm text-[color:var(--rm-gray-fg-main)] transition-colors hover:bg-[#1A1A1A]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="bg-[#000000]">
          {file && kind === "pdf" && <PdfGallery url={file.url} />}
          {file && kind === "image" && (
            <div className="flex max-h-[80vh] items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt={title}
                className="max-h-[76vh] max-w-full object-contain"
              />
            </div>
          )}
          {file && kind === "other" && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Предпросмотр для этого типа файла недоступен — скачайте и откройте в родном приложении.
              </p>
              <a
                href={file.url}
                download={file.fileName || undefined}
                className="flex h-9 items-center gap-2 rounded-sm bg-[color:var(--rm-yellow-100)] px-3 text-[length:var(--text-13)] font-medium text-[color:var(--rm-yellow-fg)] transition-colors hover:bg-[color:var(--rm-yellow-700)]"
              >
                <Download className="h-4 w-4" />
                Скачать
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// PdfGallery реализован в ./pdf-gallery.tsx и грузится динамически —
// react-pdf + pdfjs-dist весят ~250KB gzipped, попадают в отдельный chunk.
