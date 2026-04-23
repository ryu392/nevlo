import type { FSRSRating, FSRSState } from "@/types"

const DECAY = -0.5
const FACTOR = 19 / 81
const RETENTION_TARGET = 0.9

const W = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0589, 1.4352,
  0.1472, 1.0945, 0.1985, 0.3762, 0.0761, 0.2503, 0.9474, 2.9898,
]

const RATING: Record<FSRSRating, number> = { Again: 1, Hard: 2, Good: 3, Easy: 4 }

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const retrievability = (t: number, s: number) =>
  Math.pow(1 + FACTOR * (t / s), DECAY)
const initS = (r: number) => Math.max(W[r - 1], 0.1)
const initD = (r: number) => clamp(W[4] - Math.exp(W[5] * (r - 1)) + 1, 1, 10)

function nextD(d: number, r: number) {
  const d0 = initD(RATING.Easy)
  return clamp(
    W[7] * d0 + (1 - W[7]) * (d + -W[6] * (r - 3) * ((10 - d) / 9)),
    1,
    10,
  )
}

function recallS(d: number, s: number, r: number, rating: number) {
  return (
    s *
    (Math.exp(W[8]) *
      (11 - d) *
      Math.pow(s, -W[9]) *
      (Math.exp(W[10] * (1 - r)) - 1) *
      (rating === 2 ? W[15] : 1) *
      (rating === 4 ? W[16] : 1) +
      1)
  )
}

function forgetS(d: number, s: number, r: number) {
  return W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) *
    Math.exp(W[14] * (1 - r))
}

function nextInterval(s: number) {
  return Math.max(
    Math.round((s / FACTOR) * (Math.pow(RETENTION_TARGET, 1 / DECAY) - 1)),
    1,
  )
}

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export function initFSRS(rating: FSRSRating): FSRSState {
  const r = RATING[rating]
  const s = initS(r)
  const d = initD(r)
  return {
    stability: s,
    difficulty: d,
    retrievability: 1,
    lastReview: new Date().toISOString(),
    nextReview: addDays(nextInterval(s)),
    reps: 1,
    lapses: rating === "Again" ? 1 : 0,
  }
}

export function updateFSRS(state: FSRSState, rating: FSRSRating): FSRSState {
  const r = RATING[rating]
  const now = new Date()
  const elapsed =
    (now.getTime() - new Date(state.lastReview).getTime()) / 86_400_000
  const R = retrievability(elapsed, state.stability)
  const D = nextD(state.difficulty, r)
  const S = Math.max(
    rating === "Again"
      ? forgetS(state.difficulty, state.stability, R)
      : recallS(state.difficulty, state.stability, R, r),
    0.1,
  )
  return {
    stability: S,
    difficulty: D,
    retrievability: R,
    lastReview: now.toISOString(),
    nextReview: addDays(nextInterval(S)),
    reps: state.reps + 1,
    lapses: state.lapses + (rating === "Again" ? 1 : 0),
  }
}

export function isDue(state: FSRSState): boolean {
  return new Date() >= new Date(state.nextReview)
}

export function urgencyScore(state: FSRSState): number {
  return (new Date().getTime() - new Date(state.nextReview).getTime()) /
    86_400_000
}

export function defaultFSRS(): FSRSState {
  const n = new Date().toISOString()
  return {
    stability: 0,
    difficulty: 5,
    retrievability: 0,
    lastReview: n,
    nextReview: n,
    reps: 0,
    lapses: 0,
  }
}

export function intervalLabel(rating: FSRSRating): string {
  switch (rating) {
    case "Again":
      return "1분"
    case "Hard":
      return "10분"
    case "Good":
      return "1일"
    case "Easy":
      return "4일"
  }
}
