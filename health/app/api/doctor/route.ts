import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { doctorCredentials } from '../../doctor-auth/register/route';

// Mock patient data for demonstration
const mockPatients = [
  {
    id: 'pat1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    dateOfBirth: '1985-05-15',
    address: '123 Main St, Anytown, USA',
    medicalHistory: [
      { date: '2023-01-15', diagnosis: 'Anxiety', notes: 'Prescribed meditation and weekly therapy' },
      { date: '2023-03-10', diagnosis: 'Insomnia', notes: 'Sleep hygiene education provided' }
    ]
  },
  {
    id: 'pat2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '234-567-8901',
    dateOfBirth: '1990-08-22',
    address: '456 Oak Ave, Somewhere, USA',
    medicalHistory: [
      { date: '2023-02-05', diagnosis: 'Depression', notes: 'Started on therapy and lifestyle changes' },
      { date: '2023-04-20', diagnosis: 'Stress', notes: 'Recommended stress management techniques' }
    ]
  },
  {
    id: 'pat3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '345-678-9012',
    dateOfBirth: '1978-11-30',
    address: '789 Pine St, Elsewhere, USA',
    medicalHistory: [
      { date: '2023-01-25', diagnosis: 'PTSD', notes: 'Trauma-focused therapy initiated' },
      { date: '2023-03-15', diagnosis: 'Panic Disorder', notes: 'Breathing exercises and cognitive techniques taught' }
    ]
  }
];

// Mock appointments data
const mockAppointments = [
  {
    id: 'app1',
    doctorId: 'doc1',
    patientId: 'pat1',
    date: '2025-05-25',
    time: '10:00 AM',
    status: 'SCHEDULED',
    notes: 'Follow-up session'
  },
  {
    id: 'app2',
    doctorId: 'doc1',
    patientId: 'pat2',
    date: '2025-05-26',
    time: '2:30 PM',
    status: 'SCHEDULED',
    notes: 'Initial consultation'
  },
  {
    id: 'app3',
    doctorId: 'doc1',
    patientId: 'pat3',
    date: '2025-05-24',
    time: '11:15 AM',
    status: 'COMPLETED',
    notes: 'Therapy session completed'
  },
  {
    id: 'app4',
    doctorId: 'doc2',
    patientId: 'pat1',
    date: '2025-05-27',
    time: '3:00 PM',
    status: 'SCHEDULED',
    notes: 'Second opinion'
  }
];

// Get doctor data with patients and appointments
export async function GET(request: NextRequest) {
  try {
    // Get doctor ID from token or session
    // For demo, we'll extract from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Find doctor by token (in a real app, verify JWT)
    // For demo, we'll just use the first approved doctor
    const doctor = doctorCredentials.find(d => d.approved === true);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found or not approved' },
        { status: 404 }
      );
    }
    
    // Get doctor's appointments
    const doctorAppointments = mockAppointments
      .filter(a => a.doctorId === doctor.id)
      .map(appointment => {
        // Find patient for this appointment
        const patient = mockPatients.find(p => p.id === appointment.patientId);
        
        return {
          id: appointment.id,
          patientId: appointment.patientId,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          notes: appointment.notes
        };
      });
    
    // Get doctor's patients (unique patients from appointments)
    const patientIds = [...new Set(doctorAppointments.map(a => a.patientId))];
    const doctorPatients = mockPatients
      .filter(p => patientIds.includes(p.id))
      .map(({ id, firstName, lastName, email, phone, dateOfBirth, address, medicalHistory }) => ({
        id,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        medicalHistory
      }));
    
    // Calculate statistics
    const completedSessions = doctorAppointments.filter(a => a.status === 'COMPLETED').length;
    const upcomingAppointments = doctorAppointments.filter(a => a.status === 'SCHEDULED').length;
    
    // Return doctor data with patients and appointments
    const { passwordHash, ...doctorData } = doctor;
    
    return NextResponse.json({
      ...doctorData,
      status: doctor.approved ? 'APPROVED' : 'PENDING',
      wallet: { balance: 25000 }, // Mock wallet data
      totalEarnings: 75000, // Mock earnings
      completedSessions,
      totalPatients: doctorPatients.length,
      upcomingAppointments,
      appointments: doctorAppointments,
      patients: doctorPatients
    });
  } catch (error) {
    console.error('Error retrieving doctor data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve doctor data' },
      { status: 500 }
    );
  }
}
