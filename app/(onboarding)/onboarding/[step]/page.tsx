import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CameraIcon, ClockIcon, SparkIcon } from "@/components/ui/icons"

type Slide = {
  title: string
  desc: string
  icon: React.ReactNode
}

const SLIDES: Slide[] = [
  {
    title: "오답 문제를 찍으면\nAI가 복습 카드로 만들어요",
    desc: "사진 한 장이면 충분해요. AI가 핵심 아이디어 중심의 복습 카드를 자동 생성합니다.",
    icon: <CameraIcon size={48} className="text-brand" />,
  },
  {
    title: "과학적 스케줄링으로\n딱 잊을 때 복습해요",
    desc: "FSRS 알고리즘이 기억력을 학습해서, 가장 효율적인 타이밍에 복습합니다.",
    icon: <ClockIcon size={48} />,
  },
  {
    title: "AI가 직접 문제 세트를\n만들어드리기도 해요",
    desc: "공부하고 싶은 주제를 입력하면 연습 문제와 풀이를 자동 생성합니다.",
    icon: <SparkIcon size={48} className="text-accent" />,
  },
]

export default async function OnboardingStep({
  params,
}: {
  params: Promise<{ step: string }>
}) {
  const { step } = await params
  const idx = parseInt(step, 10) - 1
  if (!Number.isFinite(idx) || idx < 0 || idx >= SLIDES.length) notFound()
  const slide = SLIDES[idx]
  const nextHref = idx < SLIDES.length - 1 ? `/onboarding/${idx + 2}` : "/pricing"

  return (
    <main className="min-h-screen flex flex-col px-7 py-10 max-w-[440px] mx-auto">
      <div className="flex gap-[6px] mb-10">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded ${
              i <= idx ? "bg-brand" : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-center animate-[fadeUp_0.3s_ease_both]">
        <div className="mb-6 animate-[shake_2s_ease_infinite]">{slide.icon}</div>
        <h1 className="text-[22px] font-extrabold leading-[1.5] mb-3 whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-[14px] text-ink-muted leading-[1.8]">{slide.desc}</p>
      </div>
      <Link href={nextHref} className="block">
        <Button fullWidth>{idx < SLIDES.length - 1 ? "다음" : "시작하기"}</Button>
      </Link>
    </main>
  )
}
