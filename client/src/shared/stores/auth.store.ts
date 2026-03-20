import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../../features/auth/auth.service'
import { setAccessToken } from '../api/api-config'

interface TUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

interface TAuthState {
  user: TUser | null
  isAuthenticated: boolean
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
      setAuth: (user: TUser, accessToken: string) => {
        if (accessToken) {
          setAccessToken(accessToken)
        }
        set({ user, isAuthenticated: true })
      },
      getMe: async () => {
        try {
          const response = await authService.getMe()
          if (response.success) {
            set({ user: response.data })
          }
        } catch (error: unknown) {
          console.error('Failed to fetch user profile:', error)
          // Interceptor will handle token refresh, no need to logout immediately
        }
      },
      initialize: async () => {
        // Try fetching user profile if we believe we're authenticated.
        // If we don't have an access token in memory yet, the api-config interceptor
        // will implicitly use our http-only cookie to silent-refresh one!
        if (get().isAuthenticated) {
          await get().getMe()
        }
      },
      logout: async () => {
        setAccessToken(null)
        set({ user: null, isAuthenticated: false })
        try {
          // Call backend to destroy the session/refresh token cookie entirely
          await authService.logout()
        } catch (error: unknown) {
          console.error('Logout request failed:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // IMPORTANT: Never persist the access token if it was added to the state.
      // We only store insensitive info here.
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }) as TAuthState,
    },
  ),
)
