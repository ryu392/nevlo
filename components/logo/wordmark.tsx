import { cn } from "@/lib/utils"

export function Wordmark({
  size = 24,
  className,
  tone = "brand",
}: {
  size?: number
  className?: string
  tone?: "brand" | "ink"
}) {
  return (
    <span
      className={cn(
        "font-extrabold italic tracking-[-0.03em] leading-none select-none",
        tone === "brand" ? "text-brand" : "text-ink",
        className,
      )}
      style={{ fontSize: size, fontFamily: "var(--font-sans)" }}
    >
      Nevlo
    </span>
  )
}
