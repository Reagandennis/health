import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    // Get the user session from Auth0
    const session = await getSession();
    
    // If there's no session, the user is not authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return the user information
    return NextResponse.json({ 
      user: session.user,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication error occurred' },
      { status: 500 }
    );
  }
};
