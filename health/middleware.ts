import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
// Allow all auth-related routes to pass through
if (req.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
}

// Protected routes logic here if needed
return NextResponse.next()
}

export const config = {
matcher: [
    // Exclude auth routes and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
],
}
