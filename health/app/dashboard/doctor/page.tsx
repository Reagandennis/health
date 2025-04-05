"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSidebar from '../../components/DashboardSidebar';
import WalletSection from '../../components/WalletSection';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: string;
  createdAt: string;
  walletBalance: number;
  totalEarnings: number;
  completedSessions: number;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
}

export default function DoctorDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/api/auth/login');
            return;
          }
          throw new Error('Failed to fetch doctor data');
        }
        const data = await response.json();
        console.log('Fetched doctor data:', data);
        setDoctor(data.doctor);
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchDoctorData();
    }
  }, [userLoading, router]);

  const calculateEarnings = (completedSessions: number) => {
    return completedSessions * 2000; // 2000 KES per session
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Unauthorized access</h1>
          <p className="text-gray-600 mb-4">Please log in to access the doctor dashboard.</p>
          <button
            onClick={() => router.push('/api/auth/login')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor profile not found</h1>
          <p className="text-gray-600 mb-4">Your doctor profile has not been created or approved yet.</p>
          <button
            onClick={() => router.push('/apply')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Apply as Doctor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                  <p className="text-2xl font-semibold text-gray-900">KES {doctor?.walletBalance?.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">KES {doctor?.totalEarnings?.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">{doctor?.completedSessions || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Profile Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {doctor.name}</p>
                  <p><span className="font-medium">Email:</span> {doctor.email}</p>
                  <p><span className="font-medium">Specialization:</span> {doctor.specialization}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      doctor.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      doctor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h2>
                <div className="space-y-2">
                  <button 
                    onClick={() => router.push('/dashboard/appointments')}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    View All Appointments
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/patients')}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Manage Patients
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Recent Appointments</h2>
              <button 
                onClick={() => router.push('/dashboard/appointments')}
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                View All
              </button>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                            appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
              <p className="text-3xl font-bold text-green-600">
                KES {doctor.walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>
              <p className="text-3xl font-bold text-blue-600">
                KES {calculateEarnings(doctor.completedSessions).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Completed Sessions</h2>
              <p className="text-3xl font-bold text-purple-600">
                {doctor.completedSessions}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <WalletSection />
          </div>
        </div>
      </main>
    </div>
  );
}
