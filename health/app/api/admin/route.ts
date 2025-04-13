import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
  
        if (!session || !session.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Admin data retrieved',
            stats: {
                totalUsers: 120,
                totalDoctors: 15,
                totalPatients: 105,
                appointmentsToday: 8
            }
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
  
        if (!session || !session.user) {
            return NextResponse.json(
                { message: 'Unauthorized. No session.' },
                { status: 401 }
            );
        }

        const data = await request.json();
        
        return NextResponse.json(
            { message: 'Admin route accessed successfully', data },
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            { message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
