import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';

export default async function UserDashboard() {
    const session = await getSession();

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {session?.user.name}!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900">Upcoming Appointments</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">3</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900">Completed Visits</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">12</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900">Prescriptions</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">5</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                <div className="space-y-4">
                    {/* Add appointment list here */}
                </div>
            </div>
        </div>
    );
}

