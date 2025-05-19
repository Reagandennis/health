// /app/api/auth/[auth0]/route.ts
import {
    handleAuth,
    handleLogin,
    handleCallback,
    handleLogout, // Import handleLogout
    Session,
    Claims // Import Claims if using session.user properties directly
} from '@auth0/nextjs-auth0';

// Assuming you have a shared Prisma Client instance exported from lib/prisma
// If not, replace with: import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient();
import { prisma } from '../../../../lib/prisma';
// Make sure UserRole enum is available if using strict types, otherwise use strings like 'PATIENT'
// import { UserRole } from '@prisma/client';


// Function to sync user with DB after successful login/callback
const afterCallback = async (req: Request, session: Session, state: any): Promise<Session> => {
    const user = session.user as Claims; // Cast session.user to Claims to access properties easily

    if (user && user.sub && user.email) {
        console.log(`afterCallback: Processing user ${user.email} (sub: ${user.sub})`);
        try {
            const dbUser = await prisma.user.upsert({
                where: {
                    auth0Sub: user.sub, // Unique identifier from Auth0
                },
                update: {
                    // Fields to update if the user already exists in your DB
                    email: user.email,
                    name: user.name ?? user.nickname, // Use name or fallback to nickname
                    // Avoid updating role or hasSelectedRole here unless intended
                },
                create: {
                    // Fields to set if creating a new user in your DB
                    auth0Sub: user.sub,
                    email: user.email,
                    name: user.name ?? user.nickname,
                    role: 'PATIENT', // Default role for new users (using string value)
                    hasSelectedRole: false, // New users haven't made the choice yet
                },
            });
            console.log(`afterCallback: User ${user.email} synced (upserted). DB User ID: ${dbUser.id}`);
        } catch (error: any) {
            console.error(`!!! afterCallback: Error during Prisma upsert for user ${user.email} (sub: ${user.sub}) !!!`);
            console.error('Detailed Error:', error);
            // Optionally log more details like error.message, error.stack
        }
    } else {
         console.warn('afterCallback: Auth0 user session missing sub or email. Cannot sync.', session);
    }
    // IMPORTANT: Always return the session object
    return session;
};

// Configure the main Auth0 route handler
export const GET = handleAuth({
    // Handle Login: Redirect to Auth0, return to /role-selection
    login: handleLogin({
        returnTo: '/role-selection',
        // authorizationParams: { scope: 'openid profile email additional_scopes' } // Customize scopes if needed
    }),

    // Handle Signup: Can be configured similarly to login if needed
    // signup: handleSignUp({ ... }),

    // Handle Callback: Process Auth0 response, run afterCallback for DB sync
    callback: handleCallback({
        afterCallback // Register the sync function here
        // redirectUri: process.env.AUTH0_CALLBACK_URL // Usually inferred from AUTH0_BASE_URL
    }),

    // Handle Logout: Clear session, redirect to Auth0 logout, return to home ('/')
    logout: handleLogout({
        returnTo: '/', // Redirect to home page after logout completes
    }),

    // Handle Profile API Route (optional, if you use /api/auth/me)
    // profile: handleProfile({ ... })
});

// Reminder: Ensure all required AUTH0_* environment variables and DATABASE_URL are correctly set in your .env file.
// Reminder: Ensure your shared Prisma client instance in lib/prisma.ts is correctly set up.