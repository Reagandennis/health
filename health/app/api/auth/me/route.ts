import { cookies } from 'next/headers';
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Explicitly await cookies before using getSession
        await (await cookies()).getAll(); // This addresses the warning
        
        const session = await getSession(); // Getting session info
        
        // If session exists, return the user data, else return null
        return NextResponse.json(session?.user || null);
    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}