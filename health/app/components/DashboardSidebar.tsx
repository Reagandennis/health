'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    Users,
    FileText,
    MessageSquare,
    Settings,
    Home,
    X
} from 'lucide-react';
import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard/doctor', icon: Home },
        { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
        { name: 'Patients', href: '/dashboard/doctor/patients', icon: Users },
        { name: 'Medical Records', href: '/dashboard/doctor/records', icon: FileText },
        { name: 'Messages', href: '/dashboard/doctor/messages', icon: MessageSquare },
        { name: 'Settings', href: '/dashboard/doctor/settings', icon: Settings },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-teal-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button - Mobile only */}
                <div className="flex items-center justify-end p-4 lg:hidden">
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="mt-8 space-y-1 px-2">
                    {navigation.map((item) => {
                        const isCurrentPage = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isCurrentPage
                                        ? 'bg-teal-800 text-white'
                                        : 'text-teal-100 hover:bg-teal-600'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                        isCurrentPage
                                            ? 'text-white'
                                            : 'text-teal-200 group-hover:text-white'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Pro Badge */}
                <div className="mt-auto p-4">
                    <div className="rounded-lg bg-teal-800 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-600 text-white">
                                    Pro
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">
                                    Upgrade to Pro
                                </p>
                                <p className="text-xs text-teal-200">
                                    Access all features
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
