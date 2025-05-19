'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        // Fetch user data from the API
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                
                const userData = await response.json();
                
                if (!userData) {
                    // Redirect to login if no user data
                    router.push('/api/auth/login');
                    return;
                }
                
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Redirect to login on error
                router.push('/api/auth/login');
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, [router]);
    
    // Show loading state while fetching user data
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
    }
    
    // If no user data and not loading, redirect will happen in useEffect
    if (!user && !loading) {
        return null;
    }

    return (
        <div className="flex h-screen">
            {/* Pass user data to sidebar */}
            <DashboardSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                user={user}
            />

            <div className="flex flex-col flex-1">
                {/* Pass user data to header */}
                <DashboardHeader 
                    onMenuClick={() => setSidebarOpen(true)}
                    user={user}
                />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
