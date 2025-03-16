'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';

interface DoctorFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    licenseNumber: string;
    specialization: string;
    yearsOfExperience: number;
    education: string;
    bio: string;
    currentWorkplace?: string;
    credentials: string | null;
}

export default function DoctorRegistration() {
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    licenseNumber: '',
    specialization: 'PSYCHOLOGY', // Default value
    yearsOfExperience: 0,
    education: '',
    bio: '',
    currentWorkplace: '',
    credentials: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: Number(formData.yearsOfExperience),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Extract error message properly from responseData
        const errorMessage = responseData.error || 
                            (typeof responseData.message === 'string' ? responseData.message : 'Submission failed');
        throw new Error(errorMessage);
      }

      toast.success('Application submitted successfully!');
      setShowSuccessMessage(true);

      // Wait for 3 seconds then redirect
      setTimeout(() => {
        router.push('/dashboard/doctor');
      }, 3000);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        licenseNumber: '',
        specialization: 'PSYCHOLOGY',
        yearsOfExperience: 0,
        education: '',
        bio: '',
        currentWorkplace: '',
        credentials: null,
      });
    } catch (error) {
      console.error('Submission Error:', error);
      
      // Improved error handling
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        // Handle potential JSON or other object errors
        const errorObj = error as Record<string, any>;
        const errorMessage = errorObj.message || errorObj.error || JSON.stringify(error);
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'An error occurred with your submission');
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof DoctorFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {loading && <LoadingSpinner />}
      
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 pt-16">
        <h1 className="text-4xl font-extrabold text-teal-600 mb-6 text-center">Doctor Application</h1>

        {showSuccessMessage && (
          <div className="p-4 mb-6 bg-teal-100 text-teal-800 rounded-lg text-center">
            <p>Your application has been submitted successfully! We will reach out to you via phone or email soon.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <select
                value={formData.specialization}
                onChange={(e) => updateFormData('specialization', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="GENERAL_PRACTICE">General Practice</option>
                <option value="PSYCHIATRY">Psychiatry</option>
                <option value="PSYCHOLOGY">Psychology</option>
                <option value="COUNSELING">Counseling</option>
                <option value="BEHAVIORAL_THERAPY">Behavioral Therapy</option>
                <option value="CLINICAL_PSYCHOLOGY">Clinical Psychology</option>
                <option value="CHILD_PSYCHOLOGY">Child Psychology</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.yearsOfExperience}
                onChange={(e) => updateFormData('yearsOfExperience', Number(e.target.value))}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                required
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Current Workplace"
                value={formData.currentWorkplace}
                onChange={(e) => updateFormData('currentWorkplace', e.target.value)}
                className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <textarea
              placeholder="Education Details"
              value={formData.education}
              onChange={(e) => updateFormData('education', e.target.value)}
              required
              className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 h-32"
            />
          </div>

          <div className="flex flex-col">
            <textarea
              placeholder="Professional Bio"
              value={formData.bio}
              onChange={(e) => updateFormData('bio', e.target.value)}
              required
              className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 h-32"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-1/3 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition duration-300"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}