"use client";

import React, { useState, useEffect } from "react";

export default function Schedule() {
  interface Doctor {
    id: string;
    name: string;
    specialty: string;
    availability?: string[];
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [patientFirstName, setPatientFirstName] = useState<string>("");
  const [patientLastName, setPatientLastName] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/admin");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch doctors");
        }
        const data = await response.json();
        console.log("Doctors Data:", data);

        // Transform API data to match expected structure
        const transformedData = data.map((doctor: any) => ({
          id: doctor.id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialization,
        }));

        setDoctors(transformedData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error instanceof Error ? error.message : "Error fetching doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      // First create or get the patient
      const patientResponse = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: patientFirstName,
          lastName: patientLastName,
          email: patientEmail,
          phone: patientPhone,
          dateOfBirth: new Date().toISOString(),
          gender: "Unknown"
        }),
      });

      const patientData = await patientResponse.json();
      console.log("Patient API Response:", patientData);
      
      if (!patientResponse.ok) {
        throw new Error(patientData.error || "Failed to create patient");
      }

      if (!patientData.id) {
        throw new Error("Patient ID not received from server");
      }

      console.log("Patient created/found:", patientData);

      // Then create the appointment with the patient ID
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          patientId: patientData.id,
          date: appointmentDate,
          time: appointmentTime,
          status: "SCHEDULED"
        }),
      });

      const appointmentData = await appointmentResponse.json();
      console.log('Appointment creation response:', appointmentData);

      if (!appointmentResponse.ok) {
        throw new Error(appointmentData.error || "Failed to schedule appointment");
      }

      setSuccessMessage("Your appointment has been scheduled successfully!");
      // Reset form
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setPatientFirstName("");
      setPatientLastName("");
      setPatientEmail("");
      setPatientPhone("");
      setNotes("");
    } catch (error) {
      console.error('Error in appointment scheduling:', error);
      setError(error instanceof Error ? error.message : "Error scheduling appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] pt-16">
      <header className="mt-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-[#2a9d8f]">
            Schedule an Appointment
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#457b9d] mb-4">
                Select a Doctor
              </h2>
              {loading ? (
                <p>Loading doctors...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedDoctor === doctor.id
                            ? "bg-[#2a9d8f] text-white"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm opacity-90">{doctor.specialty}</p>
                      </div>
                    ))
                  ) : (
                    <p>No approved doctors available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#457b9d]">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                      value={patientFirstName}
                      onChange={(e) => setPatientFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#457b9d]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                      value={patientLastName}
                      onChange={(e) => setPatientLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#457b9d]">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#457b9d]">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#457b9d]">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#457b9d]">
                    Select Time
                  </label>
                  <input
                    type="time"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f] transition duration-300 ease-in-out"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#2a9d8f] text-white px-6 py-3 text-lg font-semibold shadow-md hover:bg-[#249177] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedDoctor || !appointmentDate || !appointmentTime || !patientFirstName || !patientLastName || !patientEmail}
                >
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
