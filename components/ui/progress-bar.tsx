export function ProgressBar({
  value,
  max = 100,
  tone = "success",
}: {
  value: number
  max?: number
  tone?: "success" | "brand" | "warning"
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const bg =
    tone === "brand"
      ? "bg-brand"
      : tone === "warning"
        ? "bg-warning"
        : "bg-success"
  return (
    <div className="h-[3px] bg-surface">
      <div
        className={`h-full transition-[width] duration-300 ${bg}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
