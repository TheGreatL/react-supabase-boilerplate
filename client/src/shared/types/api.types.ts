/**
 * Global API Response Interface
 * Mirrored from the server-side ApiResponse class.
 */
export interface TApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  errors?: any
  statusCode?: number
}

/**
 * Paginated Response Interface
 * Extends the global response for list endpoints.
 */
export interface TPaginatedResponse<T = any> extends TApiResponse<T[]> {
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
