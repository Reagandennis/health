'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import React from 'react';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="bg-white shadow-sm fixed w-full z-10">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left section with menu button and logo */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                    <Link href="/" className="ml-4">
                        <Image
                            src="/logo.png"
                            alt="Health Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* Right section with notifications and profile */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                        <Bell className="h-6 w-6 text-gray-600" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Image
                                src="/default-avatar.png"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-700">Dr. John Doe</p>
                                <p className="text-xs text-gray-500">Cardiologist</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {/* Add logout logic */}}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
