'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronDown, Menu, Upload, X } from 'lucide-react';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New Appointment',
            message: 'Patient John Doe scheduled an appointment for tomorrow at 10:00 AM',
            timestamp: '5 minutes ago',
            read: false
        },
        {
            id: '2',
            title: 'Appointment Reminder',
            message: 'You have an appointment with Jane Smith in 30 minutes',
            timestamp: '10 minutes ago',
            read: false
        },
        {
            id: '3',
            title: 'Profile Update',
            message: 'Your profile information has been updated successfully',
            timestamp: '1 hour ago',
            read: true
        },
        {
            id: '4',
            title: 'System Notification',
            message: 'The system will be undergoing maintenance on Saturday at 2:00 AM',
            timestamp: '2 hours ago',
            read: true
        }
    ]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
                setShowNotifications(false);
            }
            if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
                setShowProfileMenu(false);
            }
            if (!target.closest('.upload-dropdown') && !target.closest('.upload-button')) {
                setShowUploadMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mark notification as read
    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    // Get unread notifications count
    const unreadCount = notifications.filter(notification => !notification.read).length;

    if (isLoading) {
        return (
            <header className="bg-white shadow-sm w-full z-10">
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                </div>
            </header>
        );
    }

    if (error) {
        return (
            <header className="bg-white shadow-sm w-full z-10">
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="text-red-500">Error loading user data</div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm w-full z-10">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left section with menu button and logo */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 flex items-center"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-6 w-6 text-teal-600" />
                        <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">Menu</span>
                    </button>
                    <Link href="/" className="ml-4">
                        <Image
                            src="/echo-image.jpg"
                            alt="Health Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* Right section with notifications and profile */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button 
                            className="p-2 rounded-lg hover:bg-gray-100 notification-button relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-label="Notifications"
                        >
                            <Bell className="h-6 w-6 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-xs text-teal-600 hover:text-teal-800"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {notifications.map((notification) => (
                                                <div 
                                                    key={notification.id} 
                                                    className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-teal-50' : ''}`}
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <div className="flex justify-between">
                                                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-200 text-center">
                                    <Link 
                                        href="/dashboard/notifications" 
                                        className="text-xs text-teal-600 hover:text-teal-800"
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 profile-button"
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
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity upload-button"
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
                            <div className="profile-dropdown absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                            <div className="upload-dropdown absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
