export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string
  onDismiss?: () => void
}) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="mb-3 flex items-center justify-between gap-2 rounded-[10px] border border-danger/20 bg-danger/10 px-[14px] py-[10px] text-[13px] text-danger"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[16px] leading-none opacity-70 hover:opacity-100"
          aria-label="닫기"
        >
          ×
        </button>
      )}
    </div>
  )
}
