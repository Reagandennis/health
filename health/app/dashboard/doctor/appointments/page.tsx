'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  type: string;
  notes?: string;
}

// Mock data for testing
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    date: '2024-03-20',
    time: '09:00 AM',
    status: 'SCHEDULED',
    type: 'Initial Consultation',
    notes: 'First time patient, anxiety symptoms'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    date: '2024-03-19',
    time: '02:30 PM',
    status: 'COMPLETED',
    type: 'Follow-up',
    notes: 'Monthly check-in, medication review'
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    date: '2024-03-21',
    time: '11:00 AM',
    status: 'SCHEDULED',
    type: 'Therapy Session',
    notes: 'Weekly therapy session'
  },
  {
    id: '4',
    patientName: 'Emma Wilson',
    date: '2024-03-18',
    time: '10:00 AM',
    status: 'CANCELLED',
    type: 'Initial Consultation'
  },
  {
    id: '5',
    patientName: 'David Lee',
    date: '2024-03-22',
    time: '03:00 PM',
    status: 'SCHEDULED',
    type: 'Emergency Consultation',
    notes: 'Urgent appointment requested'
  }
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppointments(mockAppointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );
      
      toast.success('Appointment updated successfully');
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return aptDate >= today;
      case 'past':
        return aptDate < today;
      default:
        return true;
    }
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 mb-8">My Appointments</h1>
        
        {/* Filter Controls */}
        <div className="mb-6 flex gap-4">
          {['all', 'upcoming', 'past'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-4 py-2 rounded-lg ${
                filter === option 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-white text-teal-600 border border-teal-600'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No appointments found</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {apt.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {apt.type}
                      </p>
                      {apt.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {apt.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                      {apt.status === 'SCHEDULED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(apt.id, 'COMPLETED')}
                            className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, 'CANCELLED')}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
