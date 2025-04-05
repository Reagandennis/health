"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Calendar, Clock, User, Edit2, X, Check, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
}

export default function AppointmentsPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/api/auth/login');
            return;
          }
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchAppointments();
    }
  }, [userLoading, router]);

  const handleReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
          status: 'RESCHEDULED'
        }),
      });

      if (!response.ok) throw new Error('Failed to reschedule appointment');

      // Update the appointments list
      setAppointments(appointments.map(appointment => 
        appointment.id === selectedAppointment.id 
          ? { ...appointment, date: newDate, time: newTime, status: 'RESCHEDULED' }
          : appointment
      ));

      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED'
        }),
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Update the appointments list
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'CANCELLED' }
          : appointment
      ));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === "all") return true;
    if (filter === "upcoming") return appointment.status === "SCHEDULED" || appointment.status === "RESCHEDULED";
    if (filter === "past") return appointment.status === "COMPLETED";
    if (filter === "cancelled") return appointment.status === "CANCELLED";
    return true;
  });

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
          <p className="text-gray-600 mb-4">Please log in to access the appointments page.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Appointments</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">There are no appointments matching your current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.patientName} - {appointment.doctorName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                          appointment.status === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-800' : 
                          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {appointment.type}
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {(appointment.status === 'SCHEDULED' || appointment.status === 'RESCHEDULED') && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowRescheduleModal(true);
                            }}
                            className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedAppointment(null);
                  setNewDate("");
                  setNewTime("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
