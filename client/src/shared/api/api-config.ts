import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { env } from '#/env'

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
    // If you use Bearer tokens in headers instead of just cookies:
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
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
          localStorage.setItem('accessToken', data.data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
          return axios(originalRequest)
        }
      } catch (refreshError) {
        // Broad logout or redirect to login
        localStorage.removeItem('accessToken')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
