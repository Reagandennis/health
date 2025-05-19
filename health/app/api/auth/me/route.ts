// app/api/auth/me/route.ts
import { cookies } from 'next/headers';
import { getSession, Session } from '@auth0/nextjs-auth0'; // No need for UserProfile here
import { NextResponse } from 'next/server';
import { AUTH0_ROLES_NAMESPACE } from '../../../../lib/constants'; // Adjust path

// Use a type alias and an intersection type
type UserProfileWithRoles = Session['user'] & { // Intersect the base user type with your addition
    roles?: string[];
    // Optionally include the namespaced key in the type if needed
    // [AUTH0_ROLES_NAMESPACE]?: string[];
};

export async function GET() {
    try {
        cookies();
        const session = await getSession();

        if (!session?.user) {
            return NextResponse.json(null);
        }

        // Extract roles from the custom namespace
        const namespacedRoles = session.user[AUTH0_ROLES_NAMESPACE] as string[] | undefined;

        // Create the user profile object. TypeScript infers the type.
        // We explicitly cast session.user and add roles.
        const userProfile: UserProfileWithRoles = {
            ...(session.user as Session['user']), // Spread properties
            roles: namespacedRoles || [],          // Add the roles array
        };

        // Optional: Add namespaced roles explicitly if the type includes it and you need it
        // userProfile[AUTH0_ROLES_NAMESPACE] = namespacedRoles || [];


        return NextResponse.json(userProfile);

    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return new NextResponse('Internal Server Error fetching user session', { status: 500 });
    }
}