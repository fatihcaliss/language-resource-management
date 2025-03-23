import { AxiosError } from "axios"

// Common response type for all API calls
export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

// Common error type
export interface ApiError {
  status: number
  message: string
  detail?: string
}

// Helper function to format error from API
export const formatApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const responseData = error.response?.data as any

    return {
      status,
      message: responseData?.message || error.message,
      detail: responseData?.detail || "An error occurred",
    }
  }

  return {
    status: 500,
    message: "Unknown error",
    detail:
      error instanceof Error ? error.message : "An unexpected error occurred",
  }
}

// Common type for paginated response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
