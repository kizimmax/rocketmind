export function PreviewBar({ exitHref }: { exitHref: string }) {
  return (
    <div
      className="fixed bottom-6 left-6 z-[100] flex max-w-[360px] flex-col gap-2 rounded-sm border border-[#0A0A0A]/20 px-4 py-3 shadow-lg"
      style={{ backgroundColor: "var(--rm-yellow-100)", color: "#0A0A0A" }}
    >
      <span className="font-['Loos_Condensed',sans-serif] text-[12px] font-medium uppercase tracking-[0.04em]">
        Предпросмотр
      </span>
      <span className="text-[12px] leading-[1.35]">
        Чтобы увидеть свежие правки, вернись в редактор и снова нажми
        «Предпросмотр» — изменения сами сюда не подтягиваются.
      </span>
      <a
        href={exitHref}
        className="self-start text-[11px] font-medium uppercase tracking-[0.04em] underline underline-offset-2 hover:no-underline"
      >
        Выйти из предпросмотра
      </a>
    </div>
  );
}
