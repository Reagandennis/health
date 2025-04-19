import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/',
    authorizationParams: {
      screen_hint: 'signup',  // 👈 tells Auth0 to open the Sign Up tab
    },
  }),
});
