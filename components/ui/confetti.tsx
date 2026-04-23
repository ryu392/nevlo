"use client"

const PALETTE = ["#2E8B57", "#22C55E", "#F59E0B", "#F87171", "#A78BFA"]

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
      style={{ height: 120 }}
      aria-hidden
    >
      {Array.from({ length: 20 }).map((_, i) => {
        const size = 6 + Math.random() * 6
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${60 + Math.random() * 40}px`,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              background: PALETTE[i % PALETTE.length],
              animation: `confetti ${0.6 + Math.random() * 0.8}s ease ${
                Math.random() * 0.3
              }s both`,
            }}
          />
        )
      })}
    </div>
  )
}
