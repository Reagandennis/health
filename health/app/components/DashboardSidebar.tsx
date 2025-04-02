"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Home,
  X,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function DashboardSidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const [currentPath, setCurrentPath] = useState("");

  // Fix hydration issues with usePathname
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Navigation items with role-based access control
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["doctor", "admin", "patient"] },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, roles: ["doctor", "patient"] },
    { name: "Patients", href: "/dashboard/patients", icon: Users, roles: ["doctor"] },
    { name: "Medical Records", href: "/dashboard/records", icon: FileText, roles: ["doctor", "patient"] },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, roles: ["doctor", "patient", "admin"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["doctor", "patient", "admin"] },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-teal-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button - Mobile only */}
        <div className="flex items-center justify-end p-4 lg:hidden">
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-1 px-2">
          {navigation
            .filter((item) => !userRole || item.roles.includes(userRole))
            .map((item) => {
              const isCurrentPage = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage ? "bg-teal-800 text-white" : "text-teal-100 hover:bg-teal-600"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isCurrentPage ? "text-white" : "text-teal-200 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
        </nav>
      </div>
    </>
  );
}
