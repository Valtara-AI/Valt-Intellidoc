import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/chat',
  '/documents',
  '/search',
  '/admin',
  '/api/chat',
  '/api/documents',
  '/api/admin',
]

// Define admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // Redirect to sign-in if no token
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Check admin routes
    const isAdminRoute = adminRoutes.some(route => 
      pathname.startsWith(route)
    )

    if (isAdminRoute && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // CSP for enhanced security
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    )

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}