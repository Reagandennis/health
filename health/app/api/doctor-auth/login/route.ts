import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import doctor credentials from register route
import { doctorCredentials } from '../register/route';

// Password hashing using Web Crypto API
async function hashPassword(password) {
  // Convert the string to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash the data using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
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
    const passwordHash = await hashPassword(body.password);
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
    
    // Generate a simple session token using Web Crypto API
    const randomValues = new Uint8Array(32);
    crypto.getRandomValues(randomValues);
    const sessionToken = Array.from(randomValues).map(b => b.toString(16).padStart(2, '0')).join('');
    
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
