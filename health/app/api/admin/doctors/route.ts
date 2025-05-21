import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { doctorCredentials } from '../../doctor-auth/register/route';

// Get all doctors with their approval status
export async function GET() {
  try {
    // Return all doctors (without password hashes)
    const doctors = doctorCredentials.map(({ passwordHash, ...doctor }) => doctor);
    
    return NextResponse.json({
      doctors,
      message: 'Doctors retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving doctors:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve doctors' },
      { status: 500 }
    );
  }
}

// Update doctor approval status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.doctorId || body.approved === undefined) {
      return NextResponse.json(
        { error: 'Doctor ID and approval status are required' },
        { status: 400 }
      );
    }
    
    // Find doctor by ID
    const doctorIndex = doctorCredentials.findIndex(d => d.id === body.doctorId);
    if (doctorIndex === -1) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Update approval status
    doctorCredentials[doctorIndex].approved = body.approved;
    doctorCredentials[doctorIndex].reviewedAt = new Date().toISOString();
    if (body.notes) {
      doctorCredentials[doctorIndex].notes = body.notes;
    }
    
    // Return updated doctor (without password hash)
    const { passwordHash, ...updatedDoctor } = doctorCredentials[doctorIndex];
    
    return NextResponse.json({
      doctor: updatedDoctor,
      message: body.approved ? 'Doctor approved successfully' : 'Doctor application rejected'
    });
  } catch (error) {
    console.error('Error updating doctor approval:', error);
    return NextResponse.json(
      { error: 'Failed to update doctor approval status' },
      { status: 500 }
    );
  }
}
