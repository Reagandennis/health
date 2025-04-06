import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First get the appointment with doctor details
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        doctor: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.doctor.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Perform all updates in a transaction
    const result = await prisma.$transaction([
      // Update appointment status
      prisma.appointment.update({
        where: { id: params.id },
        data: { 
          status: 'COMPLETED'
        }
      }),

      // Update doctor's completed sessions
      prisma.$executeRaw`
        UPDATE "doctor_applications"
        SET "completedSessions" = "completedSessions" + 1,
            "updatedAt" = NOW()
        WHERE id = ${appointment.doctorId}
      `,

      // Update or create wallet and transaction
      prisma.$executeRaw`
        WITH wallet_update AS (
          INSERT INTO "Wallet" ("id", "doctorId", "balance", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${appointment.doctorId}, 2000, NOW(), NOW())
          ON CONFLICT ("doctorId") 
          DO UPDATE SET balance = "Wallet".balance + 2000, "updatedAt" = NOW()
          RETURNING id
        )
        INSERT INTO "Transaction" ("id", "amount", "type", "status", "description", "walletId", "createdAt", "updatedAt")
        SELECT 
          gen_random_uuid(),
          2000,
          'CREDIT',
          'COMPLETED',
          'Payment for completed session',
          id,
          NOW(),
          NOW()
        FROM wallet_update;
      `
    ]);

    return NextResponse.json(result[0]); // Return the updated appointment
  } catch (error) {
    console.error('Error completing appointment:', error);
    return NextResponse.json(
      { error: 'Failed to complete appointment' },
      { status: 500 }
    );
  }
} 