import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';

export default async function AdminDashboard() {
    const session = await getSession();

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900">Active Doctors</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">48</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900">Today's Appointments</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">156</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-900">New Registrations</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">23</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        {/* Add activity list here */}
                    </div>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                        {/* Add system status information here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

