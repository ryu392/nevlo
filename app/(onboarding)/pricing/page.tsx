"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const PLANS = [
  {
    id: "annual",
    name: "연간 구독",
    price: "5,900",
    sub: "월 5,900원 (연 70,800원)",
    badge: "BEST",
    disc: "25% 할인",
  },
  {
    id: "monthly",
    name: "월간 구독",
    price: "7,900",
    sub: "매월 자동 결제",
    badge: null,
    disc: null,
  },
] as const

export default function PricingPage() {
  const [selected, setSelected] = useState<"annual" | "monthly">("annual")
  return (
    <main className="min-h-screen px-5 py-8 max-w-[440px] mx-auto">
      <div className="text-center mb-6 animate-[fadeUp_0.3s_ease_both]">
        <h1 className="text-[22px] font-extrabold mb-1">요금제 선택</h1>
        <p className="text-[14px] text-ink-muted">7일 무료 체험 후 자동 결제</p>
      </div>

      {PLANS.map((plan) => {
        const active = selected === plan.id
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            aria-pressed={active}
            className={`w-full text-left bg-bg rounded-2xl p-5 mb-[10px] relative overflow-hidden transition ${
              active ? "border-2 border-brand" : "border border-border"
            }`}
          >
            {plan.badge && (
              <span className="absolute top-0 right-0 bg-brand text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
                {plan.badge}
              </span>
            )}
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-[16px] font-bold mb-[3px]">{plan.name}</div>
                <div className="text-[13px] text-ink-muted">{plan.sub}</div>
              </div>
              <div className="text-right">
                <div
                  className={`text-[22px] font-extrabold ${
                    active ? "text-brand" : "text-ink"
                  }`}
                >
                  {plan.price}
                  <span className="text-[13px] font-normal">/월</span>
                </div>
                {plan.disc && (
                  <div className="text-[12px] text-success mt-[2px]">
                    {plan.disc}
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}

      <Link href="/home" className="block mt-2">
        <Button fullWidth>7일 무료로 시작하기</Button>
      </Link>
    </main>
  )
}
