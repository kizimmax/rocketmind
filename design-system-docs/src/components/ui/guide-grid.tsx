import { Children, type ReactNode } from "react"

// ─── Сетка с направляющими ─────────────────────────────────────────────────
//
// Принцип: вместо CSS gap между колонками — реальные 1px CSS-колонки.
// Пример для cols=3: grid-template-columns = "1fr 1px 1fr 1px 1fr"
//                                              col1  G  col2  G  col3
// Ячейки помещаются в нечётные CSS-колонки (1, 3, 5…).
// Направляющие — чётные CSS-колонки (2, 4…) — окрашены или прозрачны.
// guideVisible управляет видимостью без изменения раскладки.

type GridGuidesProps = {
  /** Количество колонок контента */
  cols: number
  /** Показывать направляющие линии (default: true) */
  guideVisible?: boolean
  /** Цвет направляющих (default: rgba(0,0,0,0.07)) */
  guideColor?: string
  /** Вертикальный отступ между строками в px */
  rowGap?: number
  /** Внутренний отступ ячейки в px — задаёт визуальный gap */
  cellPadding?: number
  children: ReactNode
}

function GridGuides({
  cols,
  guideVisible = true,
  guideColor,
  rowGap = 0,
  cellPadding = 8,
  children,
}: GridGuidesProps) {
  const items = Children.toArray(children)
  const rowCount = Math.ceil(items.length / cols)

  // "1fr 1px 1fr 1px … 1fr"
  const template = Array.from({ length: cols * 2 - 1 }, (_, i) =>
    i % 2 === 0 ? "1fr" : "1px"
  ).join(" ")

  const color = guideColor ?? "var(--border)"

  return (
    <div style={{ display: "grid", gridTemplateColumns: template, rowGap }}>

      {/* Вертикальные направляющие: span всех строк */}
      {Array.from({ length: cols - 1 }, (_, i) => (
        <div
          key={`g${i}`}
          style={{
            gridColumn: i * 2 + 2,
            gridRow: `1 / ${rowCount + 1}`,
            background: guideVisible ? color : "transparent",
          }}
        />
      ))}

      {/* Ячейки контента */}
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            gridColumn: (i % cols) * 2 + 1,
            gridRow: Math.floor(i / cols) + 1,
            padding: cellPadding,
            // display:grid на wrapper растягивает Card на всю высоту строки
            display: "grid",
          }}
        >
          {item}
        </div>
      ))}

    </div>
  )
}

export { GridGuides, type GridGuidesProps }
