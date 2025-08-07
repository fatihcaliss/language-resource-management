import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// JWT token payload interface
interface TokenPayload {
  subscriptionId?: string
  subscriptionStatus?: SubscriptionStatus
  [key: string]: any
}

// Subscription status constants
export const SUBSCRIPTION_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  FROZEN: 3,
  PAYMENT_DECLINED: 4,
  CLOSED: 5,
} as const

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]

// Function to decode JWT token and extract subscription info
function decodeJWTToken(token: string): TokenPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = parts[1]

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4)

    // Decode base64
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
    )

    // Parse JSON
    const parsedPayload: TokenPayload = JSON.parse(decodedPayload)

    return parsedPayload
  } catch (error) {
    console.error("Error decoding JWT token:", error)
    return null
  }
}

// Function to get subscription info from token
function getSubscriptionInfoFromToken(request: NextRequest): {
  subscriptionId: string
  subscriptionStatus: SubscriptionStatus | null
} {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return {
      subscriptionId: "",
      subscriptionStatus: null,
    }
  }

  const payload = decodeJWTToken(token)

  if (!payload) {
    return {
      subscriptionId: "",
      subscriptionStatus: null,
    }
  }

  return {
    subscriptionId: payload.subscriptionId || "",
    subscriptionStatus: payload.subscriptionStatus || null,
  }
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/login" ||
    path === "/auth/signup" ||
    path === "/auth/activate-user"

  // Define paths that don't require subscription (but need auth)
  const noSubscriptionRequired = [
    "/subscription",
    "/profile",
    "/settings",
    "/help",
    "/contact",
  ]

  // Check if user is authenticated by looking for the auth token in cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // Authentication redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login/signup page,
    // check subscription and redirect accordingly
    const { subscriptionId, subscriptionStatus } =
      getSubscriptionInfoFromToken(request)
    const hasActiveSubscription =
      subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE && subscriptionId !== ""

    if (hasActiveSubscription) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/subscription", request.url))
    }
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access a protected route,
    // redirect to login page
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Subscription validation for authenticated users
  if (token && !isPublicPath) {
    const { subscriptionId, subscriptionStatus } =
      getSubscriptionInfoFromToken(request)

    const requiresSubscription = !noSubscriptionRequired.some((route) =>
      path.startsWith(route)
    )

    if (requiresSubscription) {
      // If no subscription ID or subscription is not active, redirect
      const hasActiveSubscription =
        subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE &&
        subscriptionId !== ""
      if (!hasActiveSubscription) {
        return NextResponse.redirect(new URL("/subscription", request.url))
      }
    }
  }

  return NextResponse.next()
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Match all paths except for static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
