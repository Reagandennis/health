'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: 'GENERAL_PRACTICE',
    licenseNumber: '',
    yearsOfExperience: '',
    education: '',
    bio: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First submit the doctor application
      const applicationResponse = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: new Date().toISOString(), // Placeholder
          address: 'Address will be collected later', // Placeholder
        }),
      });

      const applicationData = await applicationResponse.json();

      if (!applicationResponse.ok) {
        throw new Error(applicationData.error || 'Failed to submit application');
      }

      // Then register the doctor for authentication
      const authResponse = await fetch('/api/doctor-auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.error || 'Failed to create login credentials');
      }

      // Show credentials to the user
      setCredentials(authData);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/doctor/login');
  };

  // Specialization options
  const specializations = [
    'GENERAL_PRACTICE',
    'PSYCHIATRY',
    'PSYCHOLOGY',
    'COUNSELING',
    'BEHAVIORAL_THERAPY',
    'CLINICAL_PSYCHOLOGY',
    'CHILD_PSYCHOLOGY',
    'OTHER'
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Doctor Registration
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Join our platform to help patients with their mental health needs
          </p>
        </div>

        {credentials ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-green-50">
              <h3 className="text-lg leading-6 font-medium text-green-800">
                Registration Successful!
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-green-700">
                Your application has been submitted for review. Please save your login credentials.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{credentials.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Temporary Password</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                    {credentials.tempPassword}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-4">
                  Please save these credentials. You will be asked to change your password after first login.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Proceed to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>
                        {spec.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    id="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    id="yearsOfExperience"
                    min="0"
                    required
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    rows={3}
                    required
                    value={formData.education}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
