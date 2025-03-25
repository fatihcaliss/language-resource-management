"use client"

import { useTheme } from "../components/providers/theme-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()

  return (
    <div
      className={`auth-layout bg-gradient-to-b from-[#1677ff] to-[#99c3ff] ${
        theme === "dark"
          ? "dark:bg-gradient-to-b dark:from-[#001529] dark:to-[#00152900]"
          : ""
      }`}
    >
      {children}
    </div>
  )
}
