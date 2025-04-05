import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { doctor: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.doctor.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: 'COMPLETED' },
    });

    // Credit doctor's wallet
    const SESSION_FEE = 2000; // KES per session
    await prisma.$transaction([
      // Create credit transaction
      prisma.transaction.create({
        data: {
          amount: SESSION_FEE,
          type: 'CREDIT',
          status: 'COMPLETED',
          description: `Payment for completed session ${appointment.id}`,
          wallet: {
            connect: { doctorId: appointment.doctorId },
          },
        },
      }),
      // Update wallet balance
      prisma.wallet.update({
        where: { doctorId: appointment.doctorId },
        data: { balance: { increment: SESSION_FEE } },
      }),
      // Update doctor's completed sessions count
      prisma.doctorApplication.update({
        where: { id: appointment.doctorId },
        data: { completedSessions: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error completing appointment:', error);
    return NextResponse.json(
      { error: 'Failed to complete appointment' },
      { status: 500 }
    );
  }
} 