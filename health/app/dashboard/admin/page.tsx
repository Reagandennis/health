// app/dashboard/admin/page.tsx
import { getSession } from '@auth0/nextjs-auth0';
import React from 'react';
import { prisma } from '../../../lib/prisma'; // Adjust path
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AUTH0_ROLES_NAMESPACE } from '../../../lib/constants'; // Adjust path

// Helper function for clarity (optional)
async function requireRole(role: string) {
    const session = await getSession();
    const userRoles = session?.user?.[AUTH0_ROLES_NAMESPACE] as string[] | undefined || [];

    if (!session?.user || !userRoles.includes(role)) {
        console.warn(`Unauthorized access attempt to admin dashboard by user ${session?.user?.sub}`);
        redirect('/unauthorized'); // Or redirect to '/' or '/api/auth/login'
    }
    return session; // Return session for convenience
}

export default async function AdminDashboard() {
    // --- Role Check ---
    await requireRole('admin'); // Ensures only users with 'admin' role proceed

    // --- Data Fetching (Only runs if role check passes) ---
    const [approvedDoctors, pendingDoctors, rejectedDoctors, underReviewDoctors] = await Promise.all([
        prisma.doctorApplication.findMany({ where: { status: 'APPROVED' } }),
        prisma.doctorApplication.findMany({ where: { status: 'PENDING' } }),
        prisma.doctorApplication.findMany({ where: { status: 'REJECTED' } }),
        prisma.doctorApplication.findMany({ where: { status: 'UNDER_REVIEW' } }),
    ]);

    const totalApplications = approvedDoctors.length + pendingDoctors.length + rejectedDoctors.length + underReviewDoctors.length;

    // --- Render Admin Dashboard ---
    return (
        <div className="space-y-6 p-6"> {/* Added padding */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="bg-blue-50 p-6 rounded-lg">
                         <h3 className="text-lg font-semibold text-blue-900">Total Applications</h3>
                         <p className="text-3xl font-bold text-blue-600 mt-2">{totalApplications}</p>
                     </div>
                     {/* Other stats boxes... */}
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

             {/* Application Tables Section */}
             <div className="grid grid-cols-1 gap-6">
                 {/* Approved Doctors Table */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-700 mb-4">Approved Doctors</h3>
                      <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                              {/* ... thead ... */}
                               <thead className="bg-gray-50">
                                  <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License #</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved On</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                  {approvedDoctors.length === 0 ? (
                                      <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No approved doctors found</td></tr>
                                  ) : (
                                      approvedDoctors.map(doctor => (
                                          <tr key={doctor.id}>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.licenseNumber}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.reviewedAt?.toLocaleDateString() ?? 'N/A'}</td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Pending Approvals Table */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-yellow-700 mb-4">Pending Approvals</h3>
                      <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                             {/* ... thead ... */}
                             <thead className="bg-gray-50">
                                  <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License #</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                  {pendingDoctors.length === 0 ? (
                                      <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No pending applications</td></tr>
                                  ) : (
                                      pendingDoctors.map(doctor => (
                                          <tr key={doctor.id}>
                                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.licenseNumber}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.createdAt.toLocaleDateString()}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                   {/* Link to a specific review page - ensure this page is also protected */}
                                                  <Link
                                                      href={`/dashboard/admin/review/${doctor.id}`} // Changed path to be under admin
                                                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                  >
                                                      Review
                                                  </Link>
                                              </td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Rejected Applications Table */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                       <h3 className="text-xl font-semibold text-red-700 mb-4">Rejected Applications</h3>
                       <div className="overflow-x-auto">
                           <table className="min-w-full bg-white">
                               {/* ... thead ... */}
                               <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected On</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    </tr>
                                </thead>
                               <tbody className="divide-y divide-gray-200">
                                   {rejectedDoctors.length === 0 ? (
                                       <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No rejected applications</td></tr>
                                   ) : (
                                       rejectedDoctors.map(doctor => (
                                           <tr key={doctor.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.licenseNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.reviewedAt?.toLocaleDateString() ?? 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.notes || 'No reason provided'}</td>
                                           </tr>
                                       ))
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>
             </div>
        </div>
    );
}