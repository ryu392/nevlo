export type FSRSRating = "Again" | "Hard" | "Good" | "Easy"

export interface FSRSState {
  stability: number
  difficulty: number
  retrievability: number
  lastReview: string
  nextReview: string
  reps: number
  lapses: number
}
