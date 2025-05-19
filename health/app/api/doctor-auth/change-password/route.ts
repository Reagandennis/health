import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// In-memory storage for doctor credentials (in a real app, this would be in a database)
// This should be imported from a shared module in a real application
let doctorCredentials = [];

// Simple hash function for passwords (in a real app, use bcrypt or similar)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.doctorId || !body.newPassword) {
      return NextResponse.json(
        { error: 'Doctor ID and new password are required' },
        { status: 400 }
      );
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
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
    
    // Update password
    doctorCredentials[doctorIndex] = {
      ...doctorCredentials[doctorIndex],
      passwordHash: hashPassword(body.newPassword),
      tempPassword: false,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updated doctor password:', { 
      id: doctorCredentials[doctorIndex].id,
      email: doctorCredentials[doctorIndex].email,
      tempPassword: doctorCredentials[doctorIndex].tempPassword
    });
    
    // Return success
    return NextResponse.json({
      message: 'Password updated successfully',
      isTemporaryPassword: false
    });
  } catch (error) {
    console.error('Error in password change:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
