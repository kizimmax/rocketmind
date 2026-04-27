"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Self-hosted worker, см. apps/site/public/pdf.worker.min.mjs
// (копируется из node_modules/react-pdf/node_modules/pdfjs-dist/build/).
pdfjs.GlobalWorkerOptions.workerSrc = `${
  process.env.NEXT_PUBLIC_BASE_PATH || ""
}/pdf.worker.min.mjs`;

interface Props {
  url: string;
}

export function PdfGallery({ url }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Подстраиваем ширину страницы PDF под контейнер — чтобы заполняло модал по горизонтали.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Сброс страницы при смене файла
  useEffect(() => {
    setPage(1);
    setNumPages(null);
  }, [url]);

  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const next = useCallback(
    () => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p)),
    [numPages],
  );

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const canPrev = page > 1;
  const canNext = numPages !== null && page < numPages;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex max-h-[80vh] justify-center overflow-auto py-4">
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={
            <div className="flex h-[60vh] items-center justify-center text-[color:var(--rm-gray-fg-main)]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          }
          error={
            <div className="flex h-[40vh] items-center justify-center px-6 text-center text-[length:var(--text-13)] text-[color:var(--rm-gray-fg-sub)]">
              Не удалось загрузить PDF.
            </div>
          }
        >
          {width > 0 && (
            <Page
              key={page}
              pageNumber={page}
              width={Math.min(width - 32, 900)}
              // Рендерим текст для a11y/copy, но отключаем annotations для скорости
              renderTextLayer
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      </div>

      {/* Навигация — видна только для многостраничного PDF */}
      {numPages !== null && numPages > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            aria-label="Предыдущая страница"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#404040] bg-[#0A0A0A]/80 text-[color:var(--rm-gray-fg-main)] backdrop-blur-sm transition-all enabled:hover:border-[color:var(--rm-yellow-100)] enabled:hover:text-[color:var(--rm-yellow-100)] disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            aria-label="Следующая страница"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#404040] bg-[#0A0A0A]/80 text-[color:var(--rm-gray-fg-main)] backdrop-blur-sm transition-all enabled:hover:border-[color:var(--rm-yellow-100)] enabled:hover:text-[color:var(--rm-yellow-100)] disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-[#0A0A0A]/80 px-2.5 py-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-main)] backdrop-blur-sm">
            {page} / {numPages}
          </div>
        </>
      )}
    </div>
  );
}
