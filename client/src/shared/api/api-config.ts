import CONFIG from '@/shared/constants/config'
import API_ENDPOINTS from '@/shared/constants/api-endpoints'
import type { TApiResponse } from '../types/api.types'

// In-memory storage for the access token to avoid localStorage attacks (XSS)
let inMemoryAccessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token
}

export const getAccessToken = () => inMemoryAccessToken

/**
 * Helper to get a cookie value by name
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

type TRequestConfig = RequestInit & {
  _retry?: boolean
}

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

async function request<T>(
  url: string,
  config: TRequestConfig = {},
): Promise<TApiResponse<T>> {
  const fullUrl = url.startsWith('http') ? url : `${CONFIG.API_URL}/api${url}`

  const headers = new Headers(config.headers)
  if (
    !headers.has('Content-Type') &&
    config.body &&
    !(config.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json')
  }

  // Handle CSRF Token for stat-changing methods
  if (config.method && !['GET', 'HEAD', 'OPTIONS'].includes(config.method)) {
    const csrfToken = getCookie('csrf-token')
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken)
    }
  }

  if (inMemoryAccessToken) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`)
  }

  try {
    const response = await fetch(fullUrl, {
      ...config,
      headers,
      credentials: config.credentials || 'include',
    })

    // Handle 401 and Refresh Logic
    if (response.status === 401 && !config._retry) {
      const isAuthRoute =
        url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
        url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
        url.includes(API_ENDPOINTS.AUTH.REFRESH)

      if (!isAuthRoute) {
        if (isRefreshing) {
          await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          // The request function will automatically pick up the new token from inMemoryAccessToken
          return request<T>(url, { ...config, _retry: true })
        }

        config._retry = true
        isRefreshing = true

        try {
          const refreshResponse = await fetch(
            `${CONFIG.API_URL}/api${API_ENDPOINTS.AUTH.REFRESH}`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'X-CSRF-Token': getCookie('csrf-token') || '',
              },
            },
          )
          const refreshData = await refreshResponse.json()

          if (refreshData.success && refreshData.data.accessToken) {
            const newAccessToken = refreshData.data.accessToken
            console.log('🔄 Token refreshed successfully (Fetch)')
            setAccessToken(newAccessToken)
            processQueue(null, newAccessToken)
            return request<T>(url, { ...config, _retry: true })
          } else {
            throw new Error('Refresh failed')
          }
        } catch (refreshError) {
          console.error('❌ Session refresh failed (Fetch):', refreshError)
          processQueue(refreshError, null)
          if (typeof window !== 'undefined') {
            // Delegate cleanup to the auth store — it owns session state
            const {useAuthStore} = await import('../stores/auth.store')
            useAuthStore.getState().logout()
            window.location.href = '/login?reason=expired'
          }
          setAccessToken(null)
          throw refreshError
        } finally {
          isRefreshing = false
        }
      }
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      // Create an error object that loosely mirrors Axios error structure
      const error: any = new Error(data.message || 'API Request Failed')
      error.response = {
        status: response.status,
        data: data,
      }
      throw error
    }

    return data
  } catch (error) {
    // If it's already a formatted error, rethrow it
    if ((error as any).response) throw error

    // Otherwise wrap it
    const apiError: any = new Error((error as Error).message || 'Network Error')
    apiError.response = { status: 0, data: { message: apiError.message } }
    throw apiError
  }
}

const api = {
  get: <T>(url: string, config?: TRequestConfig) =>
    request<T>(url, { ...config, method: 'GET' }),

  post: <T>(url: string, data?: any, config?: TRequestConfig) =>
    request<T>(url, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: <T>(url: string, data?: any, config?: TRequestConfig) =>
    request<T>(url, {
      ...config,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  patch: <T>(url: string, data?: any, config?: TRequestConfig) =>
    request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  delete: <T>(url: string, config?: TRequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),
}

export default api
