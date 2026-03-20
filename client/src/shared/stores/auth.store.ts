import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../../features/auth/auth.service'

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
  logout: () => void
}

export const useAuthStore = create<TAuthState>()(
  persist<TAuthState>(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user: TUser, accessToken: string) => {
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
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
          // Don't logout automatically here to avoid infinite loops
        }
      },
      initialize: async () => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          await get().getMe()
        }
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
