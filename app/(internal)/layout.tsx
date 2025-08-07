"use client"

import { ReactNode } from "react"

interface InternalLayoutProps {
  children: ReactNode
}

export default function InternalLayout({ children }: InternalLayoutProps) {
  // Subscription protection is now handled by middleware
  // This layout just renders the children directly
  return <>{children}</>
}
