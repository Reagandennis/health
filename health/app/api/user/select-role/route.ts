// /app/api/user/select-role/route.ts
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Adjust import path

const prisma = new PrismaClient(); // Use global instance ideally

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.user?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { auth0Sub: session.user.sub },
        });

        if (!user) {
            console.error(`User not found in DB during role selection update: ${session.user.sub}`);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Mark that the user has made their initial choice
        await prisma.user.update({
            where: { id: user.id },
            data: { hasSelectedRole: true },
        });

        console.log(`User ${user.email} marked as having selected a role.`);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in /api/user/select-role:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}