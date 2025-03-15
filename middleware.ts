import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/login" || path === "/auth/signup"

  // Check if user is authenticated by looking for the auth token in cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login/signup page,
    // redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access a protected route,
    // redirect to login page
    return NextResponse.redirect(new URL("/auth/login", request.url))
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
