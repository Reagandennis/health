// /app/role-selection/page.tsx
'use client'; // This component needs client-side interaction (button clicks, redirects)

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's router
import { useUser } from '@auth0/nextjs-auth0/client'; // Hook to get user info client-side
import React from 'react';

export default function RoleSelectionPage() {
    const router = useRouter();
    const { user, error, isLoading } = useUser(); // Auth0 client-side hook

    // API call function
    const markRoleSelected = async () => {
        try {
            const response = await fetch('/api/user/select-role', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to mark role selection');
            }
            console.log('Successfully marked role as selected via API.');
            return true;
        } catch (err) {
            console.error('Error calling /api/user/select-role:', err);
            // Handle error - maybe show a message to the user
            return false;
        }
    };

    const handleSelectDoctor = async () => {
        const success = await markRoleSelected();
        if (success) {
            router.push('/doctors'); // Redirect to doctor application form
        } else {
            // Handle failure (e.g., show error message)
        }
    };

    const handleSelectPatient = async () => {
        const success = await markRoleSelected();
        if (success) {
            router.push('/schedule'); // Redirect to patient scheduling page
        } else {
            // Handle failure
        }
    };

    // Handle loading/error states from Auth0 hook
    useEffect(() => {
        if (!isLoading && !user && !error) {
            // Not logged in, redirect to login (although middleware might handle this too)
            router.push('/api/auth/login?returnTo=/role-selection');
        }
        // You could potentially fetch the DB user role here if needed for display logic
        // but the primary check/redirect logic lives in middleware.
    }, [isLoading, user, error, router]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user profile: {error.message}</div>;
    if (!user) return <div>Redirecting to login...</div>; // Or show login button

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.nickname}!</h1>
                <p className="text-gray-700 mb-6">How would you like to proceed?</p>
                <div className="space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={handleSelectDoctor}
                        className="w-full md:w-auto px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Apply to be a Doctor
                    </button>
                    <button
                        onClick={handleSelectPatient}
                        className="w-full md:w-auto px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
                    >
                        Continue as a Patient
                    </button>
                </div>
                 <p className="mt-6 text-sm text-gray-500">
                     You can change how you access features later in your profile (feature to be added).
                 </p>
            </div>
        </div>
    );
}