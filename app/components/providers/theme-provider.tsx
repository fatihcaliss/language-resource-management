"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { theme as antdTheme, ConfigProvider } from "antd"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (prefersDark) {
      setTheme("dark")
    }

    setMounted(true)
  }, [])

  // Update localStorage when theme changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme)
      // Update html class for potential CSS targeting
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Custom theme configuration
  const customTheme = {
    token: {
      colorPrimary: "#1677ff",
      colorSuccess: "#52c41a",
      colorWarning: "#faad14",
      colorError: "#ff4d4f",
      colorInfo: "#1677ff",
      borderRadius: 6,
      wireframe: false,
    },
    algorithm:
      theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  }

  // Avoid rendering with wrong theme on first load
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={customTheme} wave={{ disabled: true }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
