import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

// Custom error handler for debugging Auth0 callback issues
const customHandleCallback = async (req: NextRequest, params: { auth0: string[] }) => {
  try {
    // Call the default handler with explicit redirect URI for port 3001
    return await handleCallback(req, {
      redirectUri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
      afterCallback: (req, session) => {
        // You can customize session behavior here if needed
        return session;
      }
    });
  } catch (error) {
    // Log detailed error information
    console.error('Auth0 callback error:', error);
    
    // Return a more informative error response
    return NextResponse.json(
      { error: 'Authentication error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

// Custom login handler with error handling
const customHandleLogin = async (req: NextRequest) => {
  try {
    // Using the proper login handler with returnTo parameter support
    return await handleLogin(req, {
      returnTo: req.nextUrl.searchParams.get('returnTo') || '/',
      authorizationParams: {
        // You can add additional parameters here if needed
        // scope: 'openid profile email read:appointments',
      }
    });
  } catch (error) {
    console.error('Auth0 login error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
};

// Custom logout handler with error handling
const customHandleLogout = async (req: NextRequest) => {
  try {
    // Using the proper logout handler
    return await handleLogout(req, {
      returnTo: process.env.AUTH0_BASE_URL || '/'
    });
  } catch (error) {
    console.error('Auth0 logout error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
};

export const GET = handleAuth({
  callback: customHandleCallback,
  login: customHandleLogin,
  logout: customHandleLogout
});
