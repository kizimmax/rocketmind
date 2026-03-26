import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  // Base: flat, Loos Condensed, uppercase — consistent with buttons and labels
  "inline-flex items-center gap-1 rounded-sm border border-transparent px-2 whitespace-nowrap font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] transition-all",
  {
    variants: {
      variant: {
        // ── Neutral ──────────────────────────────────────────────────────
        neutral:
          "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",

        // ── Yellow ───────────────────────────────────────────────────────
        "yellow-solid":
          "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-700)]",
        "yellow-subtle":
          "bg-[var(--rm-yellow-900)] text-[var(--rm-yellow-fg-subtle)] border-[var(--rm-yellow-700)]",

        // ── Violet ───────────────────────────────────────────────────────
        "violet-solid":
          "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] border-[var(--rm-violet-700)]",
        "violet-subtle":
          "bg-[var(--rm-violet-900)] text-[var(--rm-violet-fg-subtle)] border-[var(--rm-violet-700)]",

        // ── Sky ──────────────────────────────────────────────────────────
        "sky-solid":
          "bg-[var(--rm-sky-100)] text-[var(--rm-sky-fg)] border-[var(--rm-sky-700)]",
        "sky-subtle":
          "bg-[var(--rm-sky-900)] text-[var(--rm-sky-fg-subtle)] border-[var(--rm-sky-700)]",

        // ── Terracotta ───────────────────────────────────────────────────
        "terracotta-solid":
          "bg-[var(--rm-terracotta-100)] text-[var(--rm-terracotta-fg)] border-[var(--rm-terracotta-700)]",
        "terracotta-subtle":
          "bg-[var(--rm-terracotta-900)] text-[var(--rm-terracotta-fg-subtle)] border-[var(--rm-terracotta-700)]",

        // ── Pink ─────────────────────────────────────────────────────────
        "pink-solid":
          "bg-[var(--rm-pink-100)] text-[var(--rm-pink-fg)] border-[var(--rm-pink-700)]",
        "pink-subtle":
          "bg-[var(--rm-pink-900)] text-[var(--rm-pink-fg-subtle)] border-[var(--rm-pink-700)]",

        // ── Blue ─────────────────────────────────────────────────────────
        "blue-solid":
          "bg-[var(--rm-blue-100)] text-[var(--rm-blue-fg)] border-[var(--rm-blue-700)]",
        "blue-subtle":
          "bg-[var(--rm-blue-900)] text-[var(--rm-blue-fg-subtle)] border-[var(--rm-blue-700)]",

        // ── Red ──────────────────────────────────────────────────────────
        "red-solid":
          "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)] border-[var(--rm-red-700)]",
        "red-subtle":
          "bg-[var(--rm-red-900)] text-[var(--rm-red-fg-subtle)] border-[var(--rm-red-700)]",

        // ── Green ────────────────────────────────────────────────────────
        "green-solid":
          "bg-[var(--rm-green-100)] text-[var(--rm-green-fg)] border-[var(--rm-green-700)]",
        "green-subtle":
          "bg-[var(--rm-green-900)] text-[var(--rm-green-fg-subtle)] border-[var(--rm-green-700)]",

        // ── Legacy shadcn aliases (backward compat) ──────────────────────
        default:
          "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-700)]",
        secondary:
          "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",
        destructive:
          "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)] border-[var(--rm-red-700)]",
        outline:
          "border-border text-foreground",
      },
      size: {
        sm: "h-5 text-[length:var(--text-12)]",
        md: "h-6 text-[length:var(--text-12)]",
        lg: "h-7 text-[length:var(--text-14)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
)

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]
export type BadgeSize = VariantProps<typeof badgeVariants>["size"]

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
