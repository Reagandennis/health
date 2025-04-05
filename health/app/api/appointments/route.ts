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
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transform the appointments to match the frontend interface
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patientName,
      doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      date: appointment.date.toISOString().split('T')[0],
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    }));

    return NextResponse.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Get the doctor's ID
    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientName: data.patientName,
        date: new Date(data.date),
        time: data.time,
        type: data.type,
        status: "SCHEDULED",
        doctorId: doctor.id,
        notes: data.notes,
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Format the response to match the frontend interface
    const formattedAppointment = {
      id: newAppointment.id,
      patientName: newAppointment.patientName,
      doctorName: `${newAppointment.doctor.firstName} ${newAppointment.doctor.lastName}`,
      date: newAppointment.date.toISOString().split('T')[0],
      time: newAppointment.time,
      type: newAppointment.type,
      status: newAppointment.status,
      notes: newAppointment.notes,
    };

    return NextResponse.json(
      { appointment: formattedAppointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}