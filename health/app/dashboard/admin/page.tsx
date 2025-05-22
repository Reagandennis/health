'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState(null);
  const router = useRouter();

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/admin/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle doctor approval/rejection
  const handleApprovalChange = async (doctorId, approved, notes = '') => {
    setActionInProgress(true);
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, approved, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update doctor status');
      }

      // Update local state
      setDoctors(doctors.map(doctor => 
        doctor.id === doctorId 
          ? { ...doctor, approved, reviewedAt: new Date().toISOString(), notes }
          : doctor
      ));

      // Refresh the data
      router.refresh();
    } catch (err) {
      console.error('Error updating doctor status:', err);
      setError('Failed to update doctor status. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (doctorId) => {
    setActionInProgress(true);
    setResetPasswordData(null);
    try {
      const response = await fetch('/api/admin/doctors/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();
      setResetPasswordData({
        doctorId,
        tempPassword: data.tempPassword,
        doctorName: doctors.find(d => d.id === doctorId)?.firstName + ' ' + doctors.find(d => d.id === doctorId)?.lastName
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Close password reset modal
  const closePasswordModal = () => {
    setResetPasswordData(null);
  };

  // Filter doctors by approval status
  const approvedDoctors = doctors.filter(doctor => doctor.approved === true);
  const pendingDoctors = doctors.filter(doctor => doctor.approved === false && !doctor.reviewedAt);
  const rejectedDoctors = doctors.filter(doctor => doctor.approved === false && doctor.reviewedAt);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading doctor applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Password Reset Modal */}
      {resetPasswordData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Password Reset Successful</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-3">
                  New temporary password for {resetPasswordData.doctorName}:
                </p>
                <div className="bg-gray-100 p-3 rounded-md mb-3">
                  <p className="text-md font-mono text-gray-800">{resetPasswordData.tempPassword}</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Please provide this password to the doctor. They will be prompted to change it on their next login.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closePasswordModal}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Approved Doctors</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{approvedDoctors.length}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Pending Approval</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingDoctors.length}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900">Rejected Applications</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{rejectedDoctors.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Pending Approvals Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-700 mb-4">Pending Approvals</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No pending applications</td>
                    </tr>
                  ) : (
                    pendingDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.qualifications}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleApprovalChange(doctor.id, true)}
                            disabled={actionInProgress}
                            className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Reason for rejection:');
                              if (notes !== null) {
                                handleApprovalChange(doctor.id, false, notes);
                              }
                            }}
                            disabled={actionInProgress}
                            className="text-red-600 hover:text-red-900 mr-3 disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handlePasswordReset(doctor.id)}
                            disabled={actionInProgress}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Approved Doctors Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Approved Doctors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvedDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No approved doctors found</td>
                    </tr>
                  ) : (
                    approvedDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.qualifications}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.reviewedAt ? new Date(doctor.reviewedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handlePasswordReset(doctor.id)}
                            disabled={actionInProgress}
                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => {
                              const confirmed = confirm('Are you sure you want to revoke this doctor\'s approval?');
                              if (confirmed) {
                                handleApprovalChange(doctor.id, false, 'Approval revoked by admin');
                              }
                            }}
                            disabled={actionInProgress}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Revoke Approval
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Rejected Applications Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Rejected Applications</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rejectedDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No rejected applications</td>
                    </tr>
                  ) : (
                    rejectedDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.qualifications}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.reviewedAt ? new Date(doctor.reviewedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.notes || 'No reason provided'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handlePasswordReset(doctor.id)}
                            disabled={actionInProgress}
                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleApprovalChange(doctor.id, true)}
                            disabled={actionInProgress}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
