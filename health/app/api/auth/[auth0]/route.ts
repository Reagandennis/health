import { handleAuth, handleLogin} from '@auth0/nextjs-auth0';


export const GET = handleAuth({
    login: handleLogin({
        returnTo: '/',
        authorizationParams: {
            prompt: 'login', // Forces the login screen every time
        },
    }),
});
