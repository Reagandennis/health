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
    specialization: 'PSYCHOLOGY',
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
        const errorMessage = responseData.error || responseData.message || 'Submission failed';
        throw new Error(errorMessage);
      }

      toast.success('Application submitted successfully!');
      setShowSuccessMessage(true);

      setTimeout(() => {
        router.push('/dashboard/doctor');
      }, 3000);

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
      if (error instanceof Error) {
        toast.error(error.message);
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
            {[
              ['First Name', 'firstName'],
              ['Last Name', 'lastName'],
              ['Email', 'email'],
              ['Phone Number', 'phone'],
              ['Date of Birth', 'dateOfBirth', 'date'],
              ['License Number', 'licenseNumber'],
              ['Address', 'address'],
              ['Current Workplace', 'currentWorkplace'],
            ].map(([label, key, type = 'text']) => (
              <div key={key} className="flex flex-col">
                <input
                  type={type}
                  placeholder={label as string}
                  value={formData[key as keyof DoctorFormData] as string}
                  onChange={(e) => updateFormData(key as keyof DoctorFormData, e.target.value)}
                  required={key !== 'currentWorkplace'}
                  className="input p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            ))}

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
