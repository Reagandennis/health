import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSession } from '@auth0/nextjs-auth0';


// Validation schema using zod
const doctorApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Valid phone number is required'),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  address: z.string().min(1, 'Address is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  specialization: z.enum([
    'GENERAL_PRACTICE',
    'PSYCHIATRY',
    'PSYCHOLOGY',
    'COUNSELING',
    'BEHAVIORAL_THERAPY',
    'CLINICAL_PSYCHOLOGY',
    'CHILD_PSYCHOLOGY',
    'OTHER',
  ]),
  yearsOfExperience: z.number().min(0),
  education: z.string().min(1, 'Education details are required'),
  bio: z.string().min(1, 'Bio is required'),
  currentWorkplace: z.string().optional(),
  credentials: z.string().optional().nullable(), // Handle base64-encoded strings
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  notes: z.string().optional(),
  reviewedAt: z.date().optional(),
  reviewedBy: z.string().optional(),
});

// Appointment schema
const appointmentSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  date: z.string().transform((str) => new Date(str)),
  time: z.string().min(1, 'Time is required'),
  type: z.string().min(1, 'Appointment type is required'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  patientId: z.string().optional(),
});

// POST method for handling doctor application submission
export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    console.log('Received body:', body);
    const validatedData = doctorApplicationSchema.parse(body);

    // Create a new doctor application in the database
    const application = await prisma.doctorApplication.create({
      data: {
        ...validatedData,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        credentials: validatedData.credentials || undefined,
      },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

// GET method to fetch doctor's appointments
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get doctor ID from the authenticated user
    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email,
        status: 'APPROVED',
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Fetch appointments for the doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// PATCH method to update appointment status
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    // Verify the doctor owns this appointment
    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email,
        status: 'APPROVED',
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}