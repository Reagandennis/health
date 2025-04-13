'use client';
import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import React from 'react';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const user = {
        name: "Dr. John Doe",
        role: "Cardiologist",
        avatar: "/public/echo-image.jpg"
    };

    return (
        <div className="flex h-screen">
            {/* Pass only expected props to DashboardSidebar */}
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-col flex-1">
                {/* Pass user data correctly */}
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
