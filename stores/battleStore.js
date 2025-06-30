import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBattleStore = create(
  persist(
    (set, get) => ({
      battles: [],
      setBattles: (battles) => set({ battles }),
      addBattle: (battle) => set((state) => ({ 
        battles: [battle, ...state.battles] 
      })),
      updateBattle: (id, updates) => set((state) => ({
        battles: state.battles.map(battle => 
          battle.id === id ? { ...battle, ...updates } : battle
        )
      })),
      removeBattle: (id) => set((state) => ({
        battles: state.battles.filter(battle => battle.id !== id)
      })),
      clearBattles: () => set({ battles: [] }),
    }),
    {
      name: 'battles-storage', // unique name for localStorage key
    }
  )
) 