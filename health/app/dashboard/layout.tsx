import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import React from 'react';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session?.user) {
        redirect('/api/auth/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={session.user} />
            <div className="flex">
                <DashboardSidebar userRole={session.user?.role} />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

