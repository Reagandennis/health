import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

// Handle all Auth0 related routes (/api/auth/login, /api/auth/logout, /api/auth/callback)
export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/'
    })
});

