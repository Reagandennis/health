// File: /app/api/admin/reject-doctor/[id]/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated and has admin role
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the doctor application ID from the URL params
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing doctor application ID' }, { status: 400 });
    }
    
    // Get the rejection reason from the request body if provided
    const formData = await request.formData();
    const notes = formData.get('notes') || null;
    
    // Update the doctor application status to REJECTED
    const updatedDoctor = await prisma.doctorApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        notes: notes
      },
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Doctor application rejected successfully',
      doctor: updatedDoctor
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error rejecting doctor application:', error);
    return NextResponse.json({ error: 'Failed to reject doctor application' }, { status: 500 });
  }
}