"use client"
import { create } from "zustand"

interface UIState {
  menuOpen: boolean
  confetti: boolean
  setMenuOpen: (open: boolean) => void
  fireConfetti: (ms?: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  confetti: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  fireConfetti: (ms = 1600) => {
    set({ confetti: true })
    setTimeout(() => set({ confetti: false }), ms)
  },
}))
