"use client"

export function ImageGrid({
  urls,
  onRemove,
}: {
  urls: string[]
  onRemove?: (index: number) => void
}) {
  if (!urls.length) return null
  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {urls.map((url, i) => (
        <div key={url} className="relative">
          <img
            src={url}
            alt={`업로드한 이미지 ${i + 1}`}
            className="w-[76px] h-[76px] rounded-xl object-cover border-2 border-brand/20"
          />
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`이미지 ${i + 1} 제거`}
              className="absolute -top-[6px] -right-[6px] w-5 h-5 rounded-full bg-danger text-white text-[12px] font-bold flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
