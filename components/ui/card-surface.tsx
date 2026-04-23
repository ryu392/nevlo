import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function CardSurface({
  children,
  className,
  tone = "default",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode
  className?: string
  tone?: "default" | "muted" | "brand" | "accent"
  as?: "div" | "section" | "article"
  onClick?: () => void
}) {
  const toneClass =
    tone === "brand"
      ? "bg-brand-50 border-brand/20"
      : tone === "accent"
        ? "bg-accent/10 border-accent/20"
        : tone === "muted"
          ? "bg-surface-2 border-border"
          : "bg-surface border-border"
  return (
    <Tag
      className={cn("rounded-[16px] border p-4", toneClass, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
