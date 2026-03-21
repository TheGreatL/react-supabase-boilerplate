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
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

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
      if (isRefreshing) {
        // If already refreshing, wait for the new token
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      originalRequest._retry = true
      isRefreshing = true

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

          // Process other requests in queue
          processQueue(null, newAccessToken)

          // Update the original request with the NEW token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('❌ Session refresh failed:', refreshError)
        processQueue(refreshError, null)

        // Clear stale auth data from localStorage before redirecting
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
          window.location.href = '/login?reason=expired'
        }
        setAccessToken(null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
