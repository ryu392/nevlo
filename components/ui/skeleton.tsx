import { cn } from "@/lib/utils"

export function Skeleton({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(90deg,#e8ede9 25%,#f0f5f1 50%,#e8ede9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        ...style,
      }}
      className={cn("rounded-lg", className)}
    />
  )
}
