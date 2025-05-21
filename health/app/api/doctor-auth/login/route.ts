import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Import doctor credentials from register route
import { doctorCredentials } from '../register/route';

// Simple hash function for passwords (in a real app, use bcrypt or similar)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find doctor by email
    const doctor = doctorCredentials.find(d => d.email === body.email);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordHash = hashPassword(body.password);
    if (passwordHash !== doctor.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if doctor is approved by admin
    if (!doctor.approved) {
      return NextResponse.json(
        { error: 'Your account is pending approval by an administrator. Please check back later.' },
        { status: 403 }
      );
    }
    
    // Generate a simple session token (in a real app, use a proper JWT)
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Create session (in a real app, store in a database or Redis)
    const session = {
      token: sessionToken,
      doctorId: doctor.id,
      email: doctor.email,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      isTemporaryPassword: doctor.tempPassword,
      createdAt: new Date().toISOString()
    };
    
    // Return session info
    return NextResponse.json({
      token: sessionToken,
      doctor: {
        id: doctor.id,
        email: doctor.email,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        isTemporaryPassword: doctor.tempPassword
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error in doctor login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
