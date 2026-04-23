import { cn } from "@/lib/utils"
import type { SolutionStep } from "@/types"
import { MathText } from "@/components/math/math-text"

export function StepTimeline({
  steps,
  revealedCount,
  onRevealNext,
}: {
  steps: SolutionStep[]
  revealedCount?: number
  onRevealNext?: () => void
}) {
  return (
    <ol className="relative pl-7 list-none">
      <span
        aria-hidden
        className="absolute left-[9px] top-[14px] bottom-[14px] w-[1.5px] bg-border rounded"
      />
      {steps.map((step, i) => {
        const isRevealed = revealedCount === undefined || i < revealedCount
        const isNext = revealedCount !== undefined && i === revealedCount

        if (isRevealed) {
          return (
            <li key={i} className="relative mb-2">
              <Dot isKey={step.isKey} />
              <div
                className={cn(
                  "rounded-[10px] px-[13px] py-[10px] text-[14px] leading-[1.7] border",
                  step.isKey
                    ? "bg-brand-50 border-brand/20 text-brand"
                    : "bg-surface border-border text-ink",
                )}
              >
                <div className="flex items-center gap-[6px] mb-1">
                  <span className="text-[11px] text-ink-subtle">단계 {i + 1}</span>
                  {step.isKey && (
                    <span className="text-[10px] font-extrabold rounded px-[7px] py-[1px] border bg-brand-50 border-brand/20 text-brand">
                      {step.label || step.keyLabel || "핵심"}
                    </span>
                  )}
                </div>
                <MathText text={step.text} />
              </div>
            </li>
          )
        }

        return (
          <li
            key={i}
            className={cn("relative mb-2", isNext && "cursor-pointer")}
            onClick={isNext ? onRevealNext : undefined}
          >
            <Dot isKey={false} />
            <div
              className={cn(
                "rounded-[10px] px-[13px] py-[10px] border bg-surface border-border text-ink transition-opacity",
                isNext ? "opacity-50 hover:opacity-75" : "opacity-25",
              )}
            >
              <span className="text-[13px] text-ink-subtle">단계 {i + 1}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Dot({ isKey }: { isKey: boolean }) {
  const size = isKey ? 12 : 8
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-[13px] rounded-full border-2 border-bg",
        isKey ? "bg-brand" : "bg-border",
      )}
      style={{
        left: -(size / 2 + 10),
        width: size,
        height: size,
      }}
    />
  )
}
