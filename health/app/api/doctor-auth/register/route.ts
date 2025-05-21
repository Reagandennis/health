import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// In-memory storage for doctor credentials (in a real app, this would be in a database)
let doctorCredentials = [];

// Export for use in other routes
export { doctorCredentials };

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

// Simple hash function for passwords (in a real app, use bcrypt or similar)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if doctor already exists
    const existingDoctor = doctorCredentials.find(d => d.email === body.email);
    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor with this email already exists' },
        { status: 400 }
      );
    }
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Create new doctor credentials
    const newDoctor = {
      id: `doc${doctorCredentials.length + 1}`,
      email: body.email,
      passwordHash: hashPassword(tempPassword),
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      tempPassword: true, // Flag to indicate this is a temporary password
      approved: false, // Default to not approved - requires admin approval
      specialty: body.specialty || '',
      qualifications: body.qualifications || '',
      createdAt: new Date().toISOString()
    };
    
    // Add to storage
    doctorCredentials.push(newDoctor);
    console.log('Created new doctor credentials:', { ...newDoctor, passwordHash: '[HIDDEN]' });
    
    // Return credentials (including the temporary password)
    return NextResponse.json({
      id: newDoctor.id,
      email: newDoctor.email,
      tempPassword: tempPassword,
      message: 'Doctor registration successful. Please save these credentials.'
    });
  } catch (error) {
    console.error('Error in doctor registration:', error);
    return NextResponse.json(
      { error: 'Failed to register doctor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all doctors (without password hashes)
  return NextResponse.json(
    doctorCredentials.map(({ passwordHash, ...doctor }) => doctor)
  );
}
