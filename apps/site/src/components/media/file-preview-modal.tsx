"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
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
  /** Прямая ссылка на файл (например `/uploads/<slug>/<hash>.pdf`). */
  url: string;
  /** Оригинальное имя файла. */
  fileName: string;
  /** Отображаемое имя (fallback → fileName). */
  displayName?: string;
}

interface Props {
  file: FilePreviewFile | null;
  onClose: () => void;
}

type Kind = "pdf" | "image" | "office" | "other";

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

function detectKind(url: string): Kind {
  const ext = (url.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (OFFICE_EXTS.includes(ext)) return "office";
  return "other";
}

/**
 * Office Online Viewer требует абсолютный публичный URL — на localhost он
 * не сможет дотянуться до файла. Возвращаем embed URL только когда мы на
 * не-localhost origin'е.
 */
function buildOfficeEmbed(fileUrl: string, origin: string): string | null {
  if (!origin) return null;
  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(origin)) return null;
  const abs = fileUrl.startsWith("http") ? fileUrl : `${origin}${fileUrl}`;
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(abs)}`;
}

export function FilePreviewModal({ file, onClose }: Props) {
  const open = file !== null;
  const title = file ? file.displayName || file.fileName : "";
  const kind = file ? detectKind(file.url) : "other";

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const officeEmbed = file && kind === "office" ? buildOfficeEmbed(file.url, origin) : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        // Широкое окно для PDF, рамки как в темной теме Rocketmind.
        // bodyClassName=p-0 — отключаем дефолтный padding обёртки, чтобы PDF/изображение шло edge-to-edge.
        className="lg:max-w-[min(1100px,95vw)] border-[#404040] bg-[#0A0A0A] text-[color:var(--rm-gray-fg-main)] [&>button]:hidden"
        bodyClassName="p-0"
      >
        <DialogTitle className="sr-only">{title || "Предпросмотр файла"}</DialogTitle>

        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#404040] bg-[#0A0A0A] px-5 py-3">
          <h2 className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.02em]">
            {title || "Файл"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            title="Закрыть"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[color:var(--rm-gray-fg-main)] transition-colors hover:bg-[#1A1A1A]"
          >
            <X className="h-4 w-4" />
          </button>
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
          {file && kind === "office" && officeEmbed && (
            <iframe
              key={officeEmbed}
              src={officeEmbed}
              title={title}
              className="h-[80vh] w-full border-0 bg-[#0A0A0A]"
            />
          )}
          {file && kind === "office" && !officeEmbed && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Предпросмотр Office-документов доступен только на опубликованном сайте.
              </p>
            </div>
          )}
          {file && kind === "other" && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Предпросмотр для этого типа файла недоступен.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// PdfGallery реализован в ./pdf-gallery.tsx и грузится динамически —
// react-pdf + pdfjs-dist весят ~250KB gzipped, попадают в отдельный chunk.
