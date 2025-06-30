import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOverviewStore = create(
  persist(
    (set, get) => ({
      overview: [
        { key: "streak", icon: "🔥", label: "Streak", value: 0 },
        { key: "focusTime", icon: "⏳", label: "Focus time", value: "0m" },
        { key: "sessions", icon: "🍅", label: "Sessions", value: 0 },
      ],
      setOverview: (overview) => set({ overview }),
      updateOverviewItem: (key, updates) => set((state) => ({
        overview: state.overview.map(item => 
          item.key === key ? { ...item, ...updates } : item
        )
      })),
      updateOverviewValue: (key, value) => set((state) => ({
        overview: state.overview.map(item => 
          item.key === key ? { ...item, value } : item
        )
      })),
      resetOverview: () => set({
        overview: [
          { key: "streak", icon: "🔥", label: "Streak", value: 0 },
          { key: "focusTime", icon: "⏳", label: "Focus time", value: "0m" },
          { key: "sessions", icon: "🍅", label: "Sessions", value: 0 },
        ]
      }),
    }),
    {
      name: 'overview-storage', // unique name for localStorage key
    }
  )
) 