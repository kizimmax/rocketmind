"use client"

// Корневой `/` — реэкспорт страницы «Интро» (`/introduction`), чтобы и закладки
// на корень, и пункт сайдбара «Интро» открывали один и тот же контент.
// Server `redirect()` нельзя использовать: production-сборка идёт через
// `output: "export"`, который redirects не поддерживает.
export { default } from "./introduction/page"
