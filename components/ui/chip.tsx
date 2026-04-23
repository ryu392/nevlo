import { cn } from "@/lib/utils"

export function Chip({
  label,
  onRemove,
  className,
}: {
  label: string
  onRemove?: () => void
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] px-[10px] py-[4px]",
        "bg-brand-50 border border-brand/20 rounded-full",
        "text-[12px] text-brand",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="opacity-60 hover:opacity-100 text-[14px] leading-none"
          aria-label={`${label} 제거`}
        >
          ×
        </button>
      )}
    </span>
  )
}
