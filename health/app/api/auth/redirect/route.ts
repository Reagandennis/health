import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// This route will handle redirecting users to the appropriate dashboard based on their role
export async function GET(request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      // If no session, redirect to login
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Get user role from session
    // Note: You may need to adjust this based on how roles are stored in your Auth0 user object
    const userRole = session.user.role || 
                    (session.user['https://your-namespace/roles'] ? 
                     session.user['https://your-namespace/roles'][0] : 
                     'user'); // Default to user role if none found
    
    // Redirect based on role
    switch(userRole.toLowerCase()) {
      case 'admin':
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      case 'doctor':
        return NextResponse.redirect(new URL('/dashboard/doctor', request.url));
      case 'user':
      default:
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
  } catch (error) {
    console.error('Error in role-based redirect:', error);
    // On error, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
