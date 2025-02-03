import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json(session?.user || null);
    } catch (error) {
        console.error('Error in /api/auth/me:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

