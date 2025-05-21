import { NextRequest, NextResponse } from 'next/server';
import { doctorCredentials } from './app/api/doctor-auth/register/route';

// Middleware to check authentication and authorization
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Doctor dashboard access check
  if (path.startsWith('/dashboard/doctor')) {
    // Get doctor token from cookies
    const doctorToken = request.cookies.get('doctorToken')?.value;
    
    // If no token, redirect to login
    if (!doctorToken) {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }
    
    // In a real app, verify the token and get doctor ID
    // For demo, we'll just check if any approved doctor exists
    const approvedDoctor = doctorCredentials.find(d => d.approved === true);
    
    // If no approved doctor or token doesn't match, redirect to login
    if (!approvedDoctor) {
      return NextResponse.redirect(new URL('/doctor/login', request.url));
    }
    
    // Allow access to dashboard
    return NextResponse.next();
  }
  
  // Continue for other routes
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/dashboard/doctor/:path*',
  ],
};
