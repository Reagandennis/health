"use client";

import React from "react";
import { useState } from "react";

export default function Schedule() {
  interface Doctor {
    id: string;
    name: string;
    specialty: string;
    availability?: string[];
  }

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const doctors: Doctor[] = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Psychiatrist" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Psychologist" },
    { id: "3", name: "Dr. Emily Williams", specialty: "Therapist" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ selectedDoctor, appointmentDate, appointmentTime, notes });
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] pt-16">
        <header className=" mt-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-[#2a9d8f]">
            Schedule an Appointment
          </h1>
        </div>
      </header>

    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#457b9d] mb-4">
                Select a Doctor
              </h2>
              <div className="space-y-4">
                {doctors.map((doctor) => (
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
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#457b9d]">
                    Select Date
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f]"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#457b9d]">
                    Select Time
                    <input
                      type="time"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f]"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#457b9d]">
                    Additional Notes
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2a9d8f] focus:ring-[#2a9d8f]"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#2a9d8f] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#249177] transition-colors"
                  disabled={!selectedDoctor || !appointmentDate || !appointmentTime}
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
