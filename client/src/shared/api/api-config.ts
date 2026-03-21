import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { env } from '@/env'

// In-memory storage for the access token to avoid localStorage attacks (XSS)
let inMemoryAccessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token
}

export const getAccessToken = () => inMemoryAccessToken

const api = axios.create({
  baseURL: `${env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding tokens if needed (though cookies are handled automatically)
api.interceptors.request.use(
  (config) => {
    // Read from in-memory variable instead of localStorage
    const token = inMemoryAccessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: Error) => Promise.reject(error),
)

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: {
    response?: { status: number }
    config: InternalAxiosRequestConfig & { _retry?: boolean }
  }) => {
    const originalRequest = error.config
    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post<{
          success: boolean
          data: { accessToken: string }
        }>(
          `${env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        )

        if (data.success) {
          const newAccessToken = data.data.accessToken
          console.log('🔄 Token refreshed successfully')

          // Update in-memory token
          setAccessToken(newAccessToken)

          // Update the original request with the NEW token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          // IMPORTANT: Use the 'api' instance to retry so it gets all interceptors
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('❌ Session refresh failed:', refreshError)

        // Clear stale auth data from localStorage before redirecting
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
        }
        setAccessToken(null)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
