"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success("Скопировано в буфер обмена", {
      description: label || value.slice(0, 60) + (value.length > 60 ? "..." : ""),
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md
                 text-muted-foreground hover:text-foreground hover:bg-accent
                 transition-all duration-150 cursor-pointer shrink-0"
      title="Копировать"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  )
}
