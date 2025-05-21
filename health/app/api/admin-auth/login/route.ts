import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Admin credentials (in a real app, this would be in a secure database)
let adminCredentials = {
  email: "reaganowiti8@gmail.com",
  passwordHash: hashPassword("Admin5607"),
  lastLogin: null
};

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
    
    // Check if email matches
    if (body.email !== adminCredentials.email) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordHash = hashPassword(body.password);
    if (passwordHash !== adminCredentials.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate a simple session token (in a real app, use a proper JWT)
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Update last login
    adminCredentials.lastLogin = new Date().toISOString();
    
    // Return session info
    return NextResponse.json({
      token: sessionToken,
      admin: {
        email: adminCredentials.email,
        role: 'admin'
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
