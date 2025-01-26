import React, { useState } from 'react';
import { toast } from 'sonner';

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
  credentials: string | null; // Change to string to handle base64 encoding
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
          yearsOfExperience: Number(formData.yearsOfExperience)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Submission failed');
      }

      toast.success('Application submitted successfully!');
      
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
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof DoctorFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Doctor Application</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            className="input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            required
            className="input"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={(e) => updateFormData('licenseNumber', e.target.value)}
            required
            className="input"
          />
          <select
            value={formData.specialization}
            onChange={(e) => updateFormData('specialization', e.target.value)}
            required
            className="input"
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
          <input
            type="number"
            placeholder="Years of Experience"
            value={formData.yearsOfExperience}
            onChange={(e) => updateFormData('yearsOfExperience', Number(e.target.value))}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Current Workplace"
            value={formData.currentWorkplace}
            onChange={(e) => updateFormData('currentWorkplace', e.target.value)}
            className="input"
          />
        </div>
        
        <textarea
          placeholder="Education Details"
          value={formData.education}
          onChange={(e) => updateFormData('education', e.target.value)}
          required
          className="input w-full h-24"
        />
        
        <textarea
          placeholder="Professional Bio"
          value={formData.bio}
          onChange={(e) => updateFormData('bio', e.target.value)}
          required
          className="input w-full h-24"
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}