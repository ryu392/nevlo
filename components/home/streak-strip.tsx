"use client"
import { CheckIcon, FireIcon } from "@/components/ui/icons"
import { getWeekActivity, useStreakStore } from "@/stores/streak-store"

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const

export function StreakStrip() {
  const current = useStreakStore((s) => s.current)
  const history = useStreakStore((s) => s.history)
  const week = getWeekActivity(history)
  const today = (new Date().getDay() + 6) % 7

  return (
    <section className="bg-surface rounded-2xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="animate-[shake_1s_ease_infinite]">
            <FireIcon />
          </div>
          <span className="text-2xl font-extrabold text-fire">{current}</span>
          <span className="text-[13px] text-ink-muted ml-1">일 연속</span>
        </div>
      </div>
      <ol className="flex gap-[5px]">
        {week.map((active, i) => (
          <li key={i} className="flex-1 text-center">
            <div
              className={`w-8 h-8 rounded-[9px] mx-auto mb-[3px] flex items-center justify-center border-[1.5px] ${
                active
                  ? "bg-brand-50 border-brand/20"
                  : "bg-surface-2 border-border"
              }`}
            >
              {active && <CheckIcon />}
            </div>
            <div
              className={`text-[10px] ${
                i === today ? "text-brand font-semibold" : "text-ink-subtle"
              }`}
            >
              {DAYS[i]}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
