"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';

interface Doctor {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  status: string;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export default function DoctorDashboard() {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (!user) return;

        const res = await fetch("/api/doctors", {
          credentials: 'include'
        });
        
        if (res.status === 401) {
          router.push('/api/auth/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        console.log('Fetched doctor data:', data);
        setDoctor(data.doctor);
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-teal-600">Loading...</div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {userError.message}</div>
      </div>
    );
  }

  if (!user) {
    router.push('/api/auth/login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-teal-600">Redirecting to login...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Doctor profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
     
        <div className="flex-1 p-6 lg:ml-64">
          <h1 className="text-3xl font-bold text-teal-600 mb-6">Doctor Dashboard</h1>

          {/* Doctor Details */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-teal-600 mb-4 border-b pb-2">
              Your Application Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">Name:</strong> {doctor.firstName} {doctor.lastName}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Email:</strong> {doctor.email}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Specialization:</strong> {doctor.specialization}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">License Number:</strong> {doctor.licenseNumber}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Application Status:</strong> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold 
                  ${doctor.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    doctor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}`}>
                  {doctor.status}
                </span>
              </p>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-teal-600 mb-4 border-b pb-2">
              Your Appointments
            </h2>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No appointments found</p>
              ) : (
                appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong className="text-gray-900">Patient:</strong> {appointment.patientName}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">Time:</strong> {appointment.time}
                        </p>
                        {appointment.notes && (
                          <p className="text-gray-700">
                            <strong className="text-gray-900">Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                        ${appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                          appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => router.push('/dashboard/doctor/appointments')}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              View All Appointments
            </button>
          </div>
        </div>
      </div>
  );
}
