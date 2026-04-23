"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface StreakState {
  current: number
  best: number
  lastActiveDate: string
  history: string[]
  tick: () => void
  wasActiveOn: (isoDate: string) => boolean
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      current: 0,
      best: 0,
      lastActiveDate: "",
      history: [],
      tick: () => {
        const today = todayISO()
        const s = get()
        if (s.lastActiveDate === today) return
        const next = s.lastActiveDate === yesterdayISO() ? s.current + 1 : 1
        set({
          current: next,
          best: Math.max(next, s.best),
          lastActiveDate: today,
          history: Array.from(new Set([...s.history, today])).slice(-365),
        })
      },
      wasActiveOn: (isoDate) => get().history.includes(isoDate),
    }),
    { name: "nevlo:streak" },
  ),
)

export function getWeekActivity(history: string[]): boolean[] {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - mondayOffset)
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return history.includes(d.toISOString().slice(0, 10))
  })
}
