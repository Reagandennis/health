import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from '@auth0/nextjs-auth0';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the doctor's ID
    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Get appointments for this doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const newAppointment = await prisma.appointment.create({
      data: {
        patientName: data.patientName,
        date: new Date(data.date),
        time: data.time,
        type: data.type,
        status: "SCHEDULED",
        doctorId: data.doctorId,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, appointment: newAppointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}