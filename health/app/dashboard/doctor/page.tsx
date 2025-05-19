// app/dashboard/doctor/page.tsx
import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { AUTH0_ROLES_NAMESPACE } from '../../../lib/constants'; // Adjust path

const prisma = new PrismaClient(); // Keep instance if not using global prisma instance from lib

// Helper function for clarity (optional)
async function requireRole(role: string) {
    const session = await getSession();
    const userRoles = session?.user?.[AUTH0_ROLES_NAMESPACE] as string[] | undefined || [];

    if (!session?.user || !userRoles.includes(role)) {
        console.warn(`Unauthorized access attempt to doctor dashboard by user ${session?.user?.sub}`);
        redirect('/unauthorized'); // Or redirect based on role
    }
    return session;
}

export default async function DoctorDashboard() {
    // --- Role Check ---
    // Ensure the user has the 'doctor' role
    const session = await requireRole('doctor');
    // We know session and session.user exist here because requireRole checks it
    const userEmail = session.user.email;

     if (!userEmail) {
         // This should technically not happen if Auth0 is configured correctly
         console.error("Doctor session exists but email is missing:", session.user.sub);
         redirect('/unauthorized?error=missing_email');
     }


    // --- Data Fetching ---
    // Fetch the specific doctor application for the *logged-in doctor*
    const doctorApplication = await prisma.doctorApplication.findUnique({
        where: {
            // Use email OR preferably the Auth0 subject ID (sub) if you store it
            // during application submission or user profile creation in your DB.
            // Using email assumes it's unique and verified for doctors.
            email: userEmail,
            // OR: userId: session.user.sub, // If you link applications to Auth0 user ID
        },
    });

    // --- Handle Application Status ---
    if (!doctorApplication) {
        // A user has the 'doctor' role in Auth0, but no application found in DB.
        // This could be an admin error or inconsistent state.
        // Option 1: Redirect them away
         // redirect('/application-not-found');
        // Option 2: Show a message
         return <div className="pt-16 p-6 text-center text-red-600">Error: Your doctor profile could not be found. Please contact support.</div>;
    }

    const { status } = doctorApplication;

    // You might want different views based on status for the doctor
    // if (status === 'PENDING' || status === 'UNDER_REVIEW') {
    //    return <DoctorPendingView application={doctorApplication} />;
    // }
    // if (status === 'REJECTED') {
    //    return <DoctorRejectedView application={doctorApplication} />;
    // }
    // Only show the full dashboard if approved
    if (status !== 'APPROVED') {
         return (
             <div className="pt-16 p-6 bg-gray-100 min-h-screen">
                  <div
                    className={`p-4 text-center font-semibold text-white rounded-lg mb-6 ${
                      status === 'REJECTED' ? 'bg-red-600' : 'bg-yellow-500'
                    }`}
                  >
                    Application Status: {status}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                       <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Application is {status}</h2>
                       <p>Your application details:</p>
                       {/* Display basic info or rejection reason */}
                       <p><strong>Name:</strong> {doctorApplication.firstName} {doctorApplication.lastName}</p>
                       {status === 'REJECTED' && <p><strong>Reason:</strong> {doctorApplication.notes || 'No reason provided'}</p>}
                       <p className="mt-4">You do not have access to the full dashboard until your application is approved. Please contact support if you have questions.</p>
                   </div>
             </div>
         );
    }


    // --- Render Approved Doctor Dashboard ---
    return (
        <div className="pt-16 p-6 bg-gray-100 min-h-screen">
            {/* Status Banner (for approved state) */}
            <div className="p-4 text-center font-semibold text-white rounded-lg mb-6 bg-green-600">
                Application Status: {status}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

            {/* Display details only if approved */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Profile Information</h2>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {doctorApplication.firstName} {doctorApplication.lastName}</p>
                    <p><strong>Email:</strong> {doctorApplication.email}</p>
                    <p><strong>Phone:</strong> {doctorApplication.phone}</p>
                    <p><strong>Specialization:</strong> {doctorApplication.specialization}</p>
                    <p><strong>Experience:</strong> {doctorApplication.yearsOfExperience} years</p>
                    <p><strong>Education:</strong> {doctorApplication.education}</p>
                    <p><strong>Current Workplace:</strong> {doctorApplication.currentWorkplace || 'N/A'}</p>
                    <p><strong>Bio:</strong> {doctorApplication.bio}</p>
                </div>
            </div>

            {/* Add other doctor-specific sections here (e.g., Appointments, Patients) */}
            {/* ... */}
        </div>
    );
}