import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../../features/auth/auth.service'
import type { TUser } from '../../features/auth/auth.schema'
import { setAccessToken } from '../api/api-config'


interface TAuthState {
  user: TUser | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setHasHydrated: (status: boolean) => void
  setAuth: (user: TUser, accessToken: string) => void
  getMe: () => Promise<void>
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<TAuthState>()(
  persist<TAuthState>(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false, // <-- manual flag
      setHasHydrated: (status: boolean) => set({ hasHydrated: status }),
      setAuth: (user: TUser, accessToken: string) => {
        if (accessToken) setAccessToken(accessToken)
        set({ user, isAuthenticated: true })
      },
      getMe: async () => {
        try {
          const response = await authService.getMe()
          set({ user: response.data })
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
        }
      },
      initialize: async () => {
        if (get().isAuthenticated) {
          await get().getMe()
        }
      },
      logout: async () => {
        setAccessToken(null)
        set({ user: null, isAuthenticated: false })
        try {
          await authService.logout()
        } catch (error) {
          console.error('Logout request failed:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }) as TAuthState,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  ),
)
