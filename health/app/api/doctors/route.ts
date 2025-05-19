import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock storage for doctor applications (in a real app, this would be in a database)
let doctorApplications = [
  {
    id: "doc1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    specialization: "PSYCHIATRY",
    licenseNumber: "PSY12345",
    yearsOfExperience: 10,
    education: "MD, Harvard Medical School",
    bio: "Experienced psychiatrist specializing in anxiety and depression.",
    status: "APPROVED",
    createdAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.specialization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new doctor application
    const newApplication = {
      id: `doc${doctorApplications.length + 1}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || '',
      specialization: body.specialization,
      licenseNumber: body.licenseNumber || '',
      yearsOfExperience: body.yearsOfExperience || 0,
      education: body.education || '',
      bio: body.bio || '',
      status: 'PENDING', // Default status
      createdAt: new Date().toISOString()
    };
    
    // Add to mock database
    doctorApplications.push(newApplication);
    console.log('Created new doctor application:', newApplication);
    
    // Return the new application
    return NextResponse.json(newApplication);
  } catch (error) {
    console.error('Error in doctor application:', error);
    return NextResponse.json(
      { error: 'Failed to process doctor application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all doctor applications
  return NextResponse.json(doctorApplications);
}
