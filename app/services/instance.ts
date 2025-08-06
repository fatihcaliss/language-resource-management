import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

import { refreshAccessToken, removeAuthToken, removeRefreshToken } from "./auth"

// Create base axios instance
export const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:15000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false
// Store pending requests that should be retried after token refresh
let failedQueue: { resolve: Function; reject: Function }[] = []

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh the token
        const result = await refreshAccessToken()

        if (result.success && result.token) {
          // Update token in localStorage
          localStorage.setItem("token", result.token)

          // Update Authorization header for the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${result.token}`
          }

          // Process any queued requests with the new token
          processQueue(null, result.token)

          // Retry the original request with the new token
          return axiosInstance(originalRequest)
        } else {
          // If refresh failed, clear auth and redirect to login
          removeAuthToken()
          removeRefreshToken()
          localStorage.removeItem("token")

          // Process queue with error
          processQueue(new Error("Token refresh failed"))

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login"
          }

          return Promise.reject(error)
        }
      } catch (refreshError) {
        // Handle refresh error
        processQueue(refreshError)

        // Clear auth and redirect to login
        removeAuthToken()
        removeRefreshToken()
        localStorage.removeItem("token")

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error?.response?.data)
  }
)

// Helper functions for API calls
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T, AxiosResponse<T>>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T, AxiosResponse<T>>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T, AxiosResponse<T>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T, AxiosResponse<T>>(url, config),
}

// Create and configure QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Optional: Create custom error handler for query errors
export const handleQueryError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    console.error(`API Error (${status}): ${message}`)
    // You can add custom error handling logic here
  } else {
    console.error("Unknown error:", error)
  }
}
