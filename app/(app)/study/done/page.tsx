"use client"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/ui/confetti"
import { Header } from "@/components/ui/header"
import { TrophyIcon } from "@/components/ui/icons"
import { useSessionStore } from "@/stores/session-store"
import { useUIStore } from "@/stores/ui-store"
import type { FSRSRating } from "@/types"

const TILES: { rating: FSRSRating; tone: string }[] = [
  { rating: "Again", tone: "text-danger bg-danger/10" },
  { rating: "Hard", tone: "text-warning bg-warning/10" },
  { rating: "Good", tone: "text-info bg-info/10" },
  { rating: "Easy", tone: "text-success bg-success/10" },
]

export default function StudyDonePage() {
  const results = useSessionStore((s) => s.results)
  const reset = useSessionStore((s) => s.reset)
  const confetti = useUIStore((s) => s.confetti)

  const counts = useMemo(() => {
    const tally: Record<FSRSRating, number> = {
      Again: 0,
      Hard: 0,
      Good: 0,
      Easy: 0,
    }
    for (const r of results) tally[r.rating] += 1
    return tally
  }, [results])

  return (
    <>
      <Header />
      <Confetti show={confetti} />
      <div className="flex flex-col items-center text-center py-14 px-5 animate-[pop_0.5s_ease_both]">
        <div className="animate-[bounceIn_0.5s_ease]">
          <TrophyIcon />
        </div>
        <p className="text-[20px] font-extrabold mt-4">오늘의 학습 완료!</p>
        <p className="text-[14px] text-ink-muted mt-2">
          {results.length}개 카드 복습했어요
        </p>
      </div>

      <section className="px-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((t) => (
            <div
              key={t.rating}
              className={`rounded-2xl px-4 py-5 ${t.tone} animate-[fadeUp_0.3s_ease_both]`}
            >
              <div className="text-[13px] font-semibold opacity-80">
                {t.rating}
              </div>
              <div className="text-[28px] font-extrabold leading-none mt-1">
                {counts[t.rating]}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/home"
          className="block mt-6"
          onClick={() => reset()}
        >
          <Button fullWidth>홈으로</Button>
        </Link>
      </section>
    </>
  )
}
