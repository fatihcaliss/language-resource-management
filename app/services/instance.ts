import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"

// Create base axios instance
export const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/",
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

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error("Unauthorized access")
      // You might want to redirect to login or refresh token
    }
    return Promise.reject(error)
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
