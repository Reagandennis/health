import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'

// This function will be wrapped with Auth0's middleware
async function middleware(req: NextRequest) {
  // Allow authentication routes to pass through
  if (req.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Protected API routes - require authentication
  if (req.nextUrl.pathname.startsWith('/api/') && !req.nextUrl.pathname.startsWith('/api/auth/')) {
    // Auth0 middleware will handle the authentication check
    // If user is not authenticated, it will redirect to login
    return NextResponse.next()
  }
  
  // For non-API routes, simply pass through
  return NextResponse.next()
}

// Wrap the middleware with Auth0's middleware handler
export default withMiddlewareAuthRequired(middleware)

export const config = {
  matcher: [
    // Only match API routes that need protection
    '/api/:path*',
    // Exclude static files and public assets
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
