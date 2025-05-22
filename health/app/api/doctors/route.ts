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
    
    console.log('Received doctor application data:', body);
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.specialization) {
      console.log('Missing required fields:', { 
        firstName: !!body.firstName, 
        lastName: !!body.lastName, 
        email: !!body.email, 
        specialization: !!body.specialization 
      });
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
      yearsOfExperience: typeof body.yearsOfExperience === 'number' ? body.yearsOfExperience : 0,
      education: body.education || '',
      bio: body.bio || '',
      address: body.address || '',
      dateOfBirth: body.dateOfBirth || '',
      currentWorkplace: body.currentWorkplace || '',
      status: 'PENDING', // Default status
      createdAt: new Date().toISOString()
    };
    
    // Add to mock database
    doctorApplications.push(newApplication);
    console.log('Created new doctor application:', newApplication);
    
    // Also register the doctor for authentication
    try {
      const authResponse = await fetch('http://localhost:3000/api/doctor-auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          education: body.education,
          specialty: body.specialization
        }),
      });
      
      const authData = await authResponse.json();
      console.log('Doctor auth registration result:', authData);
      
      // Return the new application with auth data
      return NextResponse.json({
        ...newApplication,
        authData
      });
    } catch (authError) {
      console.error('Error registering doctor auth:', authError);
      // Continue even if auth registration fails
      return NextResponse.json(newApplication);
    }
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
