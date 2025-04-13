import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from '@auth0/nextjs-auth0';
import { ApplicationStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session user email:', session.user.email);

    // Get doctor details with wallet
    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email
      },
      include: {
        wallet: true
      }
    });

    if (!doctor) {
      console.log('Doctor not found for email:', session.user.email);
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (doctor.status !== ApplicationStatus.APPROVED) {
      console.log('Doctor not approved. Status:', doctor.status);
      return NextResponse.json({ error: 'Doctor not approved' }, { status: 403 });
    }

    // Calculate total earnings (2000 KES per session)
    const totalEarnings = doctor.completedSessions * 2000;

    return NextResponse.json({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialization: doctor.specialization,
      status: doctor.status,
      createdAt: doctor.createdAt,
      wallet: {
        balance: doctor.wallet?.balance || 0
      },
      totalEarnings,
      completedSessions: doctor.completedSessions
    });
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor data' },
      { status: 500 }
    );
  }
} 