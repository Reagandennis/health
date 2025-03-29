// File: /app/dashboard/doctor/[id]/page.js
import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '../../../../lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Server actions for handling form submission
async function approveDoctor(formData) {
  'use server';
  
  const id = formData.get('doctorId');
  
  try {
    await prisma.doctorApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
      },
    });
    
    // Redirect back to admin dashboard
    redirect('/dashboard/admin');
  } catch (error) {
    console.error('Error approving doctor:', error);
    throw new Error('Failed to approve doctor application');
  }
}

async function rejectDoctor(formData) {
  'use server';
  
  const id = formData.get('doctorId');
  const notes = formData.get('notes');
  
  try {
    await prisma.doctorApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        notes: notes || null,
      },
    });
    
    // Redirect back to admin dashboard
    redirect('/dashboard/admin');
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    throw new Error('Failed to reject doctor application');
  }
}

export default async function ReviewDoctor({ params }) {
  const session = await getSession();
  const { id } = params;

  // Fetch the doctor's details
  const doctor = await prisma.doctorApplication.findUnique({
    where: { id },
  });

  if (!doctor) {
    return <div className="p-6">Doctor not found.</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Doctor Application</h2>
      
      {/* Doctor Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.firstName} {doctor.lastName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.specialization}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">License Number</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.licenseNumber}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.yearsOfExperience}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Education</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.education}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <p className="mt-1 text-sm text-gray-900">{doctor.bio}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-4">
        <form action={approveDoctor}>
          <input type="hidden" name="doctorId" value={doctor.id} />
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Approve Doctor
          </button>
        </form>
        
        <form action={rejectDoctor} className="space-y-3">
          <input type="hidden" name="doctorId" value={doctor.id} />
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Rejection Reason (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Provide a reason for rejection"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Reject Application
          </button>
        </form>
        
        <Link
          href="/dashboard/admin"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
}