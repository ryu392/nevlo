import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tone =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent"
  | "neutral"

const toneClass: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand border border-brand/20",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  danger: "bg-danger/10 text-danger border border-danger/20",
  info: "bg-info/10 text-info border border-info/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  neutral: "bg-surface-2 text-ink-muted border border-border",
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-[2px] rounded-lg text-[11px] font-bold",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
