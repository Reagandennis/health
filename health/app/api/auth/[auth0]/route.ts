import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    // Change returnTo to redirect to a role-based redirect handler
    returnTo: '/api/auth/redirect',
    authorizationParams: {
      screen_hint: 'signup',
    },
  }),
  callback: handleCallback({
    afterCallback: (req, res, session) => {
      // Ensure session is properly returned
      return session;
    }
  }),
});
