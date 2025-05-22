import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { doctorCredentials } from '../../../doctor-auth/register/route';
import crypto from 'crypto';

// Simple hash function for passwords (in a real app, use bcrypt or similar)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate a random temporary password
function generateTemporaryPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  return result;
}

// Get doctor credentials (for admin view)
export async function GET() {
  try {
    // Return all doctors with their credentials (except password hash)
    const doctors = doctorCredentials.map(({ passwordHash, ...doctor }) => ({
      ...doctor,
      hasCredentials: true
    }));
    
    return NextResponse.json({
      doctors,
      message: 'Doctor credentials retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving doctor credentials:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve doctor credentials' },
      { status: 500 }
    );
  }
}

// Reset doctor password
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.doctorId) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
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
    
    // Generate new temporary password
    const newPassword = generateTemporaryPassword();
    
    // Update password
    doctorCredentials[doctorIndex].passwordHash = hashPassword(newPassword);
    doctorCredentials[doctorIndex].tempPassword = true;
    
    // Return updated doctor (without password hash)
    const { passwordHash, ...updatedDoctor } = doctorCredentials[doctorIndex];
    
    return NextResponse.json({
      doctor: updatedDoctor,
      tempPassword: newPassword,
      message: 'Doctor password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting doctor password:', error);
    return NextResponse.json(
      { error: 'Failed to reset doctor password' },
      { status: 500 }
    );
  }
}
