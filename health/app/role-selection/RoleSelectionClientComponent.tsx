// /app/role-selection/RoleSelectionClientComponent.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// Accept userName as a prop from the server component
export default function RoleSelectionClientComponent({ userName }: { userName: string }) {
    const router = useRouter();

    const markRoleSelectedAndRedirect = async (destination: string) => {
        try {
            // Call the API first to mark selection as done
            const response = await fetch('/api/user/select-role', {
                method: 'POST',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to mark role selection');
            }
            console.log('Successfully marked role as selected via API.');
            // Only redirect after successful API call
            router.push(destination);

        } catch (err: any) {
            console.error('Error during role selection confirmation or redirect:', err);
            // TODO: Show an error message to the user on this page
            alert(`An error occurred: ${err.message || 'Please try again.'}`);
        }
    };

    const handleSelectDoctor = () => {
        // Mark selection done via API, then redirect to application form
        markRoleSelectedAndRedirect('/doctors');
    };

    const handleSelectPatient = () => {
        // Mark selection done via API, then redirect to scheduling page
        markRoleSelectedAndRedirect('/schedule');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Welcome, {userName}!</h1>
                <p className="text-gray-700 mb-6">How would you like to use the platform today?</p>
                <div className="space-y-4">
                    <button
                        onClick={handleSelectDoctor}
                        className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    >
                        Apply to be a Doctor
                    </button>
                    <button
                        onClick={handleSelectPatient}
                        className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                    >
                        Continue as a Patient
                    </button>
                </div>
                {/* <p className="mt-6 text-sm text-gray-500">
                    This choice helps us direct you initially.
                </p> */}
            </div>
        </div>
    );
}