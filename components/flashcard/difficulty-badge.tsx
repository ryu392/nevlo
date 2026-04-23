import { Badge } from "@/components/ui/badge"
import type { Difficulty } from "@/types"

export function DifficultyBadge({ difficulty }: { difficulty?: Difficulty }) {
  if (!difficulty) return null
  const tone =
    difficulty === "어려움" ? "danger" : difficulty === "쉬움" ? "success" : "warning"
  return <Badge tone={tone}>{difficulty}</Badge>
}
