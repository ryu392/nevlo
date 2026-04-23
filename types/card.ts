import type { FSRSState } from "./fsrs"

export type Difficulty = "쉬움" | "보통" | "어려움"
export type Confidence = "high" | "medium" | "low"

export interface SolutionStep {
  text: string
  isKey: boolean
  keyLabel?: string
  label?: string
}

export interface Card {
  id: string
  createdAt: string
  problemText: string
  imageUrl?: string
  source?: string
  page?: string
  subject?: string
  difficulty?: Difficulty
  ideas: string[]
  steps: SolutionStep[]
  fsrs: FSRSState
}

export interface DraftCard {
  id: string
  imageUrl?: string
  text: string
  source: string
  page: string
  confidence: Confidence | null
  ideas: string[]
  ideaInput: string
  loading: boolean
}

export interface ReviewCard {
  id: string
  problemText: string
  imageUrl?: string
  source?: string
  page?: string
  ideas: string[]
  steps: SolutionStep[]
  difficulty: Difficulty
  loading: boolean
}
