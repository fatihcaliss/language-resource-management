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

export const login = async (
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Login attempt:", { username, password })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAuthToken("dummy-token")
    return { success: true, message: "Login successful!" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Failed to login. Please try again." }
  }
}

export const signup = async (
  userData: any
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Signup attempt:", userData)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAuthToken("dummy-token")
    return { success: true, message: "Account created successfully!" }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    }
  }
}

export const logout = (): string => {
  removeAuthToken()
  window.location.href = "/auth/login"
  return "Logged out successfully!"
}
