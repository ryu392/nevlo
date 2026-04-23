"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ErrorBanner } from "@/components/ui/error-banner"
import { Header } from "@/components/ui/header"
import { SITE } from "@/config/site"
import { useCardsStore } from "@/stores/cards-store"

interface Row {
  label: string
  description: string
}

const ROWS: Row[] = [
  { label: "알림 설정", description: "복습 리마인더" },
  { label: "요금제 관리", description: "월간 구독" },
  { label: "계정 정보", description: "이메일, 비밀번호" },
  { label: "고객센터", description: "문의" },
]

export default function SettingsPage() {
  const clear = useCardsStore((s) => s.clear)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [notice, setNotice] = useState("")

  const reset = () => {
    clear()
    setConfirmOpen(false)
    setNotice("모든 카드를 삭제했어요.")
  }

  return (
    <>
      <Header title="설정" backTo="/mypage" />
      <section className="px-5 pt-4 pb-10">
        <ErrorBanner message={notice} onDismiss={() => setNotice("")} />

        <div className="space-y-2">
          {ROWS.map((r) => (
            <button
              key={r.label}
              type="button"
              className="w-full text-left bg-surface rounded-[12px] px-4 py-[14px] hover:bg-surface-2 transition"
            >
              <div className="text-[14px] font-semibold">{r.label}</div>
              <div className="text-[13px] text-ink-muted mt-[2px]">
                {r.description}
              </div>
            </button>
          ))}
        </div>

        <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-[1.5px] mt-8 mb-3">
          데이터
        </div>
        {confirmOpen ? (
          <div className="bg-danger/10 border border-danger/30 rounded-[12px] p-4">
            <p className="text-[13px] text-danger leading-[1.6] mb-3">
              모든 카드와 학습 기록이 지워져요. 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-2">
              <Button
                fullWidth
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
              >
                취소
              </Button>
              <Button fullWidth variant="danger" onClick={reset}>
                삭제 확정
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full text-left bg-surface rounded-[12px] px-4 py-[14px] hover:bg-surface-2 transition"
          >
            <div className="text-[14px] font-semibold text-danger">
              모든 카드 초기화
            </div>
            <div className="text-[13px] text-ink-muted mt-[2px]">
              로컬에 저장된 모든 데이터를 지웁니다.
            </div>
          </button>
        )}

        <div className="text-center text-[12px] text-ink-subtle mt-8">
          {SITE.name} v{SITE.version}
        </div>
      </section>
    </>
  )
}
