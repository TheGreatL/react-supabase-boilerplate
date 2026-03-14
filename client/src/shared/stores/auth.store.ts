import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string) => void
  getMe: () => Promise<void>
  initialize: () => Promise<void>
  logout: () => void
}

import { authService } from '../../features/auth/auth.service'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
        }
        set({ user, isAuthenticated: true })
      },
      getMe: async () => {
        try {
          const response = await authService.getMe()
          if (response.success) {
            set({ user: response.data, isAuthenticated: true })
          }
        } catch (error) {
          get().logout()
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
