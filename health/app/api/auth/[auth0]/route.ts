import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/',
    authorizationParams: {
      screen_hint: 'signup',
    },
  }),
  callback: handleCallback,  // Use default callback handling
});
