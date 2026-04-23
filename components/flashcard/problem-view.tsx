import { MathText } from "@/components/math/math-text"

export function ProblemView({ text }: { text: string }) {
  return (
    <div className="bg-surface rounded-[16px] p-[22px] mb-5 min-h-[110px]">
      <div className="text-[15px] leading-[1.9]">
        <MathText text={text} />
      </div>
    </div>
  )
}
