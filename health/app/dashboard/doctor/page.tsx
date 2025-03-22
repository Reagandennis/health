import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DoctorDashboard() {
  const session = await getSession();

  // Redirect to login if the user is not authenticated
  if (!session?.user) {
    redirect('/api/auth/login');
  }

  // Fetch the doctor's application data
  const doctorApplication = await prisma.doctorApplication.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!doctorApplication) {
    return <div>No application found for this user.</div>;
  }

  return (
    <div className="pt-16 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

      {/* Doctor Application Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Application Details</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {doctorApplication.firstName} {doctorApplication.lastName}</p>
          <p><strong>Email:</strong> {doctorApplication.email}</p>
          <p><strong>Specialization:</strong> {doctorApplication.specialization}</p>
          <p><strong>License Number:</strong> {doctorApplication.licenseNumber}</p>
          <p><strong>Application Status:</strong> <strong>{doctorApplication.status}</strong></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Today's Appointments</h2>
          <p className="text-3xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Patients</h2>
          <p className="text-3xl font-bold text-green-600">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">This Week</h2>
          <p className="text-3xl font-bold text-purple-600">32</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Available Slots</h2>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
      </div>

      {/* Upcoming Appointments and Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
          {/* Add upcoming appointments list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Patients</h2>
          {/* Add recent patients list here */}
        </div>
      </div>
    </div>
  );
}