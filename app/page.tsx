import Link from "next/link"
import { Wordmark } from "@/components/logo/wordmark"
import { SITE } from "@/config/site"

export default function SplashPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-10 text-center max-w-[440px] mx-auto">
      <div className="animate-[pop_0.5s_ease_both]">
        <Wordmark size={48} className="block mb-2" />
        <p className="text-[15px] text-ink-muted">{SITE.tagline}</p>
      </div>
      <Link
        href="/login"
        className="mt-10 w-full max-w-[280px] bg-brand text-white rounded-[14px] py-[15px] text-center text-[15px] font-bold hover:bg-brand-600 transition"
      >
        시작하기
      </Link>
    </main>
  )
}
