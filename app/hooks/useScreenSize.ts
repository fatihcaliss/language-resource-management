import { useEffect, useState } from "react"

// Define common breakpoints
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

const useScreenSize = () => {
  // Use a null initial state for server-side rendering compatibility
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    // Initialize on client side
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setScreenSize({
        width,
        height,
        isMobile: width < breakpoints.sm,
        isTablet: width >= breakpoints.sm && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      })
    }

    // Set initial size
    updateScreenSize()

    // Add event listener
    window.addEventListener("resize", updateScreenSize)

    // Clean up
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}

export default useScreenSize
