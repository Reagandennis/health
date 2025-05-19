import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0';

export async function middleware(req: NextRequest) {
  // Allow all auth-related routes to pass through
  if (req.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Protected dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard/')) {
    try {
      // We can't directly use getSession in middleware due to Edge Runtime limitations
      // Instead, we check for the presence of the auth cookie
      const authCookie = req.cookies.get('appSession');
      
      if (!authCookie) {
        // Redirect to login if no auth cookie is found
        const loginUrl = new URL('/api/auth/login', req.url);
        // Add the current URL as a return_to parameter
        loginUrl.searchParams.set('returnTo', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Allow access to continue if cookie is present
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Redirect to login on error
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected dashboard routes
    '/dashboard/:path*',
    // Auth routes
    '/api/auth/:path*'
  ],
}
