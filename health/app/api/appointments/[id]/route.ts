import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { date, time, status } = body;

    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify the user is the doctor
    if (appointment.doctor.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(status && { status }),
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

    // Format the response
    const formattedAppointment = {
      id: updatedAppointment.id,
      patientName: updatedAppointment.patientName,
      doctorName: `${updatedAppointment.doctor.firstName} ${updatedAppointment.doctor.lastName}`,
      date: updatedAppointment.date.toISOString().split('T')[0],
      time: updatedAppointment.time,
      type: updatedAppointment.type,
      status: updatedAppointment.status,
      notes: updatedAppointment.notes,
    };

    return NextResponse.json(formattedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 