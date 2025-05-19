import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock patient data storage (in-memory for demo purposes)
let patients = [
  {
    id: "patient1",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "123-456-7890",
    dateOfBirth: new Date("1990-01-01").toISOString(),
    gender: "Female"
  }
];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }
    
    // Check if patient already exists by email
    let patient = patients.find(p => p.email === body.email);
    
    if (patient) {
      // Return existing patient
      console.log('Returning existing patient:', patient);
      return NextResponse.json(patient);
    }
    
    // Create new patient
    const newPatient = {
      id: `patient${patients.length + 1}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || '',
      dateOfBirth: body.dateOfBirth || new Date().toISOString(),
      gender: body.gender || 'Unknown'
    };
    
    // Add to mock database
    patients.push(newPatient);
    console.log('Created new patient:', newPatient);
    
    // Return the new patient
    return NextResponse.json(newPatient);
  } catch (error) {
    console.error('Error in patients API:', error);
    return NextResponse.json(
      { error: 'Failed to process patient data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all patients
  return NextResponse.json(patients);
}
