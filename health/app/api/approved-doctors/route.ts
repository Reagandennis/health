import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all approved doctors
    const doctors = await prisma.doctorApplication.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        email: true,
      },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
