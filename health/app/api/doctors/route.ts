import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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

// Handle unsupported methods (e.g., GET, PUT, DELETE)
export function GET() {
  return NextResponse.json({ error: 'GET method is not allowed on this route.' }, { status: 405 });
}
