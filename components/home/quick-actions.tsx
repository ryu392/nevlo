"use client"
import Link from "next/link"
import { CameraIcon, SparkIcon } from "@/components/ui/icons"
import { useCaptureStore } from "@/stores/capture-store"

export function QuickActions() {
  const resetCapture = useCaptureStore((s) => s.resetAll)
  return (
    <div className="grid grid-cols-2 gap-[10px] mb-4">
      <Link
        href="/capture"
        onClick={resetCapture}
        className="bg-surface rounded-2xl py-5 px-[14px] text-center border border-border hover:border-brand transition text-brand"
      >
        <CameraIcon className="mb-2 mx-auto" />
        <div className="text-[14px] font-bold text-ink">문제 촬영</div>
        <div className="text-[12px] text-ink-subtle mt-[3px]">
          사진 → AI 카드
        </div>
      </Link>
      <Link
        href="/ai"
        className="bg-accent/10 rounded-2xl py-5 px-[14px] text-center border border-accent/20 hover:border-accent transition text-accent"
      >
        <SparkIcon className="mb-2 mx-auto" />
        <div className="text-[14px] font-bold text-accent">AI 세트 생성</div>
        <div className="text-[12px] text-accent/70 mt-[3px]">
          주제 → 문제 생성
        </div>
      </Link>
    </div>
  )
}
