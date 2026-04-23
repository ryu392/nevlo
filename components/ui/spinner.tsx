export function Spinner({ size = 28 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="shrink-0 animate-[spin_0.7s_linear_infinite]"
      role="status"
      aria-label="로딩 중"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="2.5"
        strokeDasharray="14 42"
        strokeLinecap="round"
      />
    </svg>
  )
}
