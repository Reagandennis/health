import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock appointments data storage (in-memory for demo purposes)
let appointments = [];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.doctorId || !body.patientId || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Doctor ID, patient ID, date, and time are required' },
        { status: 400 }
      );
    }
    
    // Create new appointment
    const newAppointment = {
      id: `appointment${appointments.length + 1}`,
      doctorId: body.doctorId,
      patientId: body.patientId,
      date: body.date,
      time: body.time,
      status: body.status || 'SCHEDULED',
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock database
    appointments.push(newAppointment);
    console.log('Created new appointment:', newAppointment);
    
    // Return the new appointment
    return NextResponse.json(newAppointment);
  } catch (error) {
    console.error('Error in appointments API:', error);
    return NextResponse.json(
      { error: 'Failed to process appointment data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all appointments
  return NextResponse.json(appointments);
}
