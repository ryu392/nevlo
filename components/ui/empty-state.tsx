import type { ReactNode } from "react"

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <p className="text-[15px] text-ink-subtle mb-4">{title}</p>
      {description && (
        <p className="text-[13px] text-ink-subtle mb-4 leading-relaxed max-w-[280px]">
          {description}
        </p>
      )}
      {action && <div className="mt-2 w-full max-w-[280px]">{action}</div>}
    </div>
  )
}
