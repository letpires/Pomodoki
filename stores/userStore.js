import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      currentUser: false,
      balance: 0,
      balanceLoading: false,
      isLoggedIn: false,
      network: 'testnet',
      loadingWallet: true,
      
      // Setters
      setCurrentUser: (user) => set({ currentUser: user }),
      setBalance: (balance) => set({ balance }),
      setBalanceLoading: (loading) => set({ balanceLoading: loading }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setNetwork: (network) => set({ network }),
      setLoadingWallet: (loading) => set({ loadingWallet: loading }),
      
      // Actions
      login: (user) => set({ 
        currentUser: user, 
        isLoggedIn: true 
      }),
      
      logout: () => set({ 
        currentUser: null, 
        isLoggedIn: false, 
        balance: 0 
      }),
      
      updateBalance: (newBalance) => set({ balance: newBalance }),
      
      resetUser: () => set({
        currentUser: false,
        balance: 0,
        balanceLoading: false,
        isLoggedIn: false,
        loadingWallet: true
      }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        network: state.network,
      }), // Only persist these fields
    }
  )
) 