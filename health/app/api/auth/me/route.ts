import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

// You can use withApiAuthRequired to ensure authentication for this route
export async function GET() {
    try {
        const session = await getSession(); // Getting session info

        // If session exists, return the user data, else return null
        return NextResponse.json(session?.user || null);
    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
