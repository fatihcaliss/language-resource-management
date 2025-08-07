"use client"

// Set auth token in cookies
export const setAuthToken = (token: string) => {
  document.cookie = `auth-token=${token}; path=/; max-age=86400`
}

// Remove auth token from cookies
export const removeAuthToken = () => {
  document.cookie = "auth-token=; path=/; max-age=0"
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") return false

  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith("auth-token=")) {
      const token = cookie.substring("auth-token=".length, cookie.length)
      return token.length > 0
    }
  }
  return false
}

// Set refresh token in cookies
export const setRefreshToken = (refreshToken: string) => {
  document.cookie = `refresh-token=${refreshToken}; path=/; max-age=2592000` // 30 days
}

// Get refresh token from cookies
export const getRefreshToken = (): string | null => {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith("refresh-token=")) {
      return cookie.substring("refresh-token=".length, cookie.length)
    }
  }
  return null
}

// Remove refresh token from cookies
export const removeRefreshToken = () => {
  document.cookie = "refresh-token=; path=/; max-age=0"
}

// Function to refresh the access token using refresh token
export const refreshAccessToken = async (): Promise<{
  success: boolean
  token?: string
  message?: string
}> => {
  try {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      return { success: false, message: "No refresh token found" }
    }

    const response = await fetch(
      "http://localhost:16000/api/login-with-refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    )

    const data = await response.json()

    if (response.ok && data.data?.token) {
      setAuthToken(data.data.token)

      // If the API also returns a new refresh token, update it
      if (data.data.refreshToken) {
        setRefreshToken(data.data.refreshToken)
      }

      return { success: true, token: data.data.token }
    } else {
      return {
        success: false,
        message: data.message || "Failed to refresh token",
      }
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    return { success: false, message: "Failed to refresh token" }
  }
}

export const logout = (): string => {
  removeAuthToken()
  removeRefreshToken()
  localStorage.removeItem("token")

  // Clear subscription status
  // localStorage.removeItem("subscriptionStatus")
  // document.cookie = "subscriptionStatus=; path=/; max-age=0"

  window.location.href = "/auth/login"
  return "Logged out successfully!"
}
