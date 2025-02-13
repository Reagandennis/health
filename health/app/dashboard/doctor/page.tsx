import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function DoctorDashboard() {
  const session = await getSession();

  // Redirect to login if the user is not authenticated
  if (!session?.user) {
    redirect('/api/auth/login');
  }

  return (
    // The `pt-16` class adds 4rem of padding at the top, pushing content below the fixed navbar
    <div className="pt-16 space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Today's Appointments</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Total Patients</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">145</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">This Week</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">32</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">Available Slots</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {/* Add upcoming appointments list here */}
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-4">
            {/* Add recent patients list here */}
          </div>
        </div>
      </div>
    </div>
  );
}
