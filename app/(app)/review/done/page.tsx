"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/ui/confetti"
import { Header } from "@/components/ui/header"
import { TrophyIcon } from "@/components/ui/icons"
import { useUIStore } from "@/stores/ui-store"

function DoneInner() {
  const params = useSearchParams()
  const count = parseInt(params.get("n") ?? "0", 10) || 0
  const confetti = useUIStore((s) => s.confetti)
  return (
    <>
      <Header />
      <Confetti show={confetti} />
      <div className="flex flex-col items-center text-center py-20 px-5 animate-[pop_0.5s_ease_both]">
        <div className="animate-[bounceIn_0.5s_ease]">
          <TrophyIcon />
        </div>
        <p className="text-[20px] font-extrabold mt-4">
          {count}개 카드 저장 완료!
        </p>
        <p className="text-[14px] text-ink-muted mt-2 leading-relaxed">
          FSRS 스케줄링이 적용되었어요.
        </p>
        <Link href="/home" className="mt-6 w-full max-w-[200px]">
          <Button fullWidth>홈으로</Button>
        </Link>
      </div>
    </>
  )
}

export default function ReviewDonePage() {
  return (
    <Suspense>
      <DoneInner />
    </Suspense>
  )
}
