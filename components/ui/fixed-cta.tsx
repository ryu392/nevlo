"use client"
import { Button } from "./button"

export function FixedCTA({
  label,
  onClick,
  disabled,
  variant = "primary",
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "accent" | "danger"
}) {
  return (
    <div className="sticky bottom-0 bg-bg border-t border-surface-2 px-5 pt-3 pb-6 mt-2">
      <Button
        variant={variant}
        fullWidth
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    </div>
  )
}
