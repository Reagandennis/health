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
    if (!body.currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }
    
    // Verify current password
    const currentPasswordHash = hashPassword(body.currentPassword);
    if (currentPasswordHash !== adminCredentials.passwordHash) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
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
    
    // Update credentials
    let updated = false;
    let message = 'No changes were made';
    
    // Update email if provided
    if (body.newEmail && body.newEmail !== adminCredentials.email) {
      adminCredentials.email = body.newEmail;
      updated = true;
      message = 'Email updated successfully';
    }
    
    // Update password if provided
    if (body.newPassword) {
      adminCredentials.passwordHash = hashPassword(body.newPassword);
      updated = true;
      message = updated ? 'Email and password updated successfully' : 'Password updated successfully';
    }
    
    // Return success
    return NextResponse.json({
      success: updated,
      message: message,
      email: adminCredentials.email
    });
  } catch (error) {
    console.error('Error in admin credential change:', error);
    return NextResponse.json(
      { error: 'Failed to update credentials' },
      { status: 500 }
    );
  }
}
