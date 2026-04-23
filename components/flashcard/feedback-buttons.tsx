import type { FSRSRating } from "@/types"
import { intervalLabel } from "@/lib/fsrs"

const OPTIONS: Array<{
  label: FSRSRating
  toneText: string
  toneBg: string
}> = [
  { label: "Again", toneText: "text-danger", toneBg: "bg-danger/10" },
  { label: "Hard", toneText: "text-warning", toneBg: "bg-warning/10" },
  { label: "Good", toneText: "text-info", toneBg: "bg-info/10" },
  { label: "Easy", toneText: "text-success", toneBg: "bg-success/10" },
]

export function FeedbackButtons({
  onSubmit,
}: {
  onSubmit: (rating: FSRSRating) => void
}) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onSubmit(opt.label)}
          className={`flex-1 rounded-[12px] border border-border ${opt.toneBg} px-1 py-[13px] text-center hover:brightness-95 transition active:scale-[0.98]`}
        >
          <div className={`text-[14px] font-bold ${opt.toneText}`}>
            {opt.label}
          </div>
          <div className="text-[11px] text-ink-subtle mt-[2px]">
            {intervalLabel(opt.label)}
          </div>
        </button>
      ))}
    </div>
  )
}
