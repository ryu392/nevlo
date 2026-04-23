"use client"
import Link from "next/link"
import { useMemo } from "react"
import { Header } from "@/components/ui/header"
import { selectStats, useCardsStore } from "@/stores/cards-store"
import { useStreakStore } from "@/stores/streak-store"

interface Stat {
  label: string
  value: string | number
  tone: string
}

interface MenuItem {
  label: string
  description: string
  href: string
}

const MENU: MenuItem[] = [
  { label: "내 덱 관리", description: "카드 삭제 및 검색", href: "/deck" },
  { label: "설정", description: "알림, 요금제, 계정", href: "/settings" },
]

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

export default function MyPage() {
  const cards = useCardsStore((s) => s.cards)
  const currentStreak = useStreakStore((s) => s.current)
  const bestStreak = useStreakStore((s) => s.best)
  const history = useStreakStore((s) => s.history)

  const stats: Stat[] = useMemo(() => {
    const s = selectStats(cards)
    return [
      { label: "등록 문제", value: s.count, tone: "text-accent" },
      { label: "총 복습", value: s.totalReps, tone: "text-brand" },
      { label: "정답률", value: `${s.accuracy}%`, tone: "text-info" },
      { label: "최장 연속", value: `${bestStreak}일`, tone: "text-fire" },
    ]
  }, [cards, bestStreak])

  const { monthLabel, calendarCells } = useMemo(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const todayISO = `${year}-${pad(month + 1)}-${pad(today.getDate())}`
    const label = MONTH_NAMES[month]
    const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    type Cell = null | { iso: string; day: number; active: boolean; isToday: boolean; isFuture: boolean }
    const cells: Cell[] = [
      ...Array<Cell>(firstDayOfWeek).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const iso = `${year}-${pad(month + 1)}-${pad(i + 1)}`
        return {
          iso,
          day: i + 1,
          active: history.includes(iso),
          isToday: iso === todayISO,
          isFuture: iso > todayISO,
        }
      }),
    ]

    return { monthLabel: label, calendarCells: cells }
  }, [history])

  return (
    <>
      <Header title="내 기록" backTo="/home" />
      <section className="px-5 pt-4 pb-10">
        <div className="flex items-center gap-[14px] mb-5 animate-[fadeUp_0.3s_ease_both]">
          <div className="w-[54px] h-[54px] rounded-full bg-accent/15 flex items-center justify-center text-accent text-[22px] font-extrabold">
            N
          </div>
          <div>
            <div className="text-[18px] font-extrabold">Nevlo 학습자</div>
            <div className="text-[13px] text-ink-muted mt-[2px]">
              연속 {currentStreak}일 학습 중
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface rounded-[14px] px-3 py-4 text-center animate-[fadeUp_0.3s_ease_both]"
            >
              <div className={`text-[24px] font-extrabold leading-none ${s.tone}`}>
                {s.value}
              </div>
              <div className="text-[12px] text-ink-muted mt-[6px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mb-3">
          {monthLabel} 활동
        </div>
        <div className="bg-surface rounded-[14px] px-4 py-4 mb-6">
          <div className="grid grid-cols-7 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="text-center text-[10px] text-ink-subtle font-medium">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-[4px]">
            {calendarCells.map((cell, i) =>
              cell === null ? (
                <div key={`empty-${i}`} />
              ) : (
                <div
                  key={cell.iso}
                  className={[
                    "aspect-square rounded-[5px] flex items-center justify-center text-[11px] font-medium mx-[2px]",
                    cell.active
                      ? "bg-brand text-white"
                      : cell.isFuture
                        ? "text-ink-subtle"
                        : "bg-surface-2 text-ink-subtle",
                    cell.isToday ? "ring-1 ring-brand ring-offset-1 ring-offset-surface" : "",
                  ].join(" ")}
                >
                  {cell.day}
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="block bg-surface rounded-[12px] px-4 py-[14px] hover:bg-surface-2 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold">{m.label}</div>
                  <div className="text-[13px] text-ink-muted mt-[2px]">
                    {m.description}
                  </div>
                </div>
                <span className="text-ink-subtle text-[18px]">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
