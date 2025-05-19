// app/dashboard/user/page.tsx
import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';
import { redirect } from 'next/navigation';
import { AUTH0_ROLES_NAMESPACE } from '../../../lib/constants'; // Adjust path

// Helper function for clarity (optional)
async function requireRole(role: string) {
    const session = await getSession();
    const userRoles = session?.user?.[AUTH0_ROLES_NAMESPACE] as string[] | undefined || [];

    // Allow access if user has the specific role (e.g., 'patient')
    // OR if they are an admin/doctor (optional, if they should also see this)
    const hasRequiredRole = userRoles.includes(role);
    // const isAdmin = userRoles.includes('admin');
    // const isDoctor = userRoles.includes('doctor');

    // Adjust logic: Only allow 'patient' role, or redirect others?
    // If only patients:
    if (!session?.user || !hasRequiredRole) {
         console.warn(`Unauthorized access attempt to user dashboard by user ${session?.user?.sub} with roles ${userRoles.join(', ')}`);
         redirect('/unauthorized'); // Or redirect to their specific dashboard if admin/doctor
    }

    // If admins/doctors can also see it:
    // if (!session?.user || (!hasRequiredRole && !isAdmin && !isDoctor)) {
    //     redirect('/unauthorized');
    // }

    return session;
}


export default async function UserDashboard() {
    // --- Role Check ---
    // Ensure user has 'patient' role (or adjust logic as needed)
    const session = await requireRole('patient');
     // We know session and session.user exist here

    // --- Render Patient Dashboard ---
    return (
        <div className="space-y-6 p-6"> {/* Added padding */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {session.user.name ?? session.user.nickname ?? 'User'}!</h2>
                 {/* Example Stats - Replace with actual data fetching */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900">Upcoming Appointments</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">3</p> {/* Replace with dynamic data */}
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900">Completed Visits</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">12</p> {/* Replace with dynamic data */}
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900">Prescriptions</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">5</p> {/* Replace with dynamic data */}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                <div className="space-y-4">
                    {/* TODO: Fetch and display actual recent appointments for the user */}
                    <p className="text-gray-500">No recent appointments to display.</p>
                </div>
            </div>
             {/* Add other patient-specific sections */}
        </div>
    );
}