'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronDown, Menu, Upload } from 'lucide-react';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showUploadMenu, setShowUploadMenu] = useState(false);

    if (isLoading) {
        return (
            <header className="bg-white shadow-sm fixed w-full z-10">
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                </div>
            </header>
        );
    }

    if (error) {
        return (
            <header className="bg-white shadow-sm fixed w-full z-10">
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="text-red-500">Error loading user data</div>
                </div>
            </header>
        );
    }

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
                            <div className="relative group">
                                <Image
                                    src={user?.picture || "/default-avatar.png"}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/default-avatar.png';
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowUploadMenu(!showUploadMenu);
                                    }}
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Upload className="h-3 w-3 text-gray-600" />
                                </button>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
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
                                    <Link
                                        href="/api/auth/logout"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </Link>
                                </div>
                            </div>
                        )}

                        {showUploadMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu">
                                    <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                        Upload New Picture
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Handle file upload here
                                                    console.log('File selected:', file);
                                                    // You can implement the upload logic here
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
