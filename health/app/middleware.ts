// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const { pathname } = req.nextUrl;
    // Optional: Add more detailed logging if needed during debugging
    // console.log(`\n--- Middleware processing path: ${pathname} ---`);

    // Define paths that DON'T require authentication
    const publicPaths = [
        '/', // Root path is public
        '/api/auth/login',
        '/api/auth/logout',
        '/api/auth/callback',
        '/role-selection', // Handles its own auth checks/redirects internally
        '/unauthorized',
        // Add any other public paths like /about, /contact etc.
    ];

    // Define patterns for assets and internal Next.js routes that should always be allowed
    const isAssetOrInternal =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('/favicon.ico');

    if (isAssetOrInternal) {
        // console.log('Middleware: Path is asset/internal. Allowing.');
        return res; // Allow asset/internal requests
    }

    // Check if the path is one of the defined public paths
    const isPublic = publicPaths.includes(pathname);

    // Allow public paths OR general API routes (except protected ones)
    // Consider adding specific checks for sensitive API routes if needed later
    if (isPublic || pathname.startsWith('/api/')) {
        // Note: /api/auth/* routes are handled above in publicPaths check
        // console.log(`Middleware: Path identified as public or API [${pathname}]. Allowing.`);
        return res;
    }

    // --- Authentication Check for all OTHER paths (Protected Routes) ---
    // console.log(`Middleware: Path [${pathname}] is protected. Checking session...`);
    const session = await getSession(req, res);

    if (!session?.user) {
        // --- User is NOT authenticated, redirect to HOME page ---
        const homeUrl = new URL('/', req.url);
        console.log(`Middleware: No session for protected route ${pathname}. Redirecting to home: ${homeUrl.toString()}`);
        return NextResponse.redirect(homeUrl);
        // --- End of Redirect Logic ---
    }

    // --- User IS authenticated ---
    // Allow access to the originally requested protected route.
    // Page/Layout specific logic will handle role selection redirects if needed.
    // console.log(`Middleware: User ${session.user.sub} is authenticated. Allowing access to protected route: ${pathname}`);
    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * This ensures middleware runs on pages and API routes but skips static assets.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};