"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Services() {
    return (
        <div className="flex flex-col min-h-screen bg-[#f3f7f4] font-[family-name:var(--font-geist-sans)] text-[#1d3557]">
            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-16 items-center sm:items-start text-center sm:text-left px-8 sm:px-20 pt-24">
                {/* Hero Section */}
                <section className="flex flex-col items-center sm:items-start gap-6 w-full text-center sm:text-left">
                    <h2 className="text-4xl font-bold text-[#2a9d8f]">Comprehensive Mental Health Services</h2>
                    <p className="text-lg text-[#457b9d] max-w-prose">
                        At Echo Psychology Services, our licensed professionals provide personalized, evidence-based support to
                        help you achieve mental well-being. Whether you need individual therapy or group sessions, we’re here for you.
                    </p>
                </section>

                {/* Services List */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    {[
                        { title: "Individual Counseling", description: "One-on-one therapy tailored to your personal challenges and goals." },
                        { title: "Group Therapy", description: "Join a supportive community for shared experiences and guided support." },
                        { title: "Stress & Anxiety Management", description: "Develop effective techniques to cope with stress and anxiety." },
                        { title: "Couples & Family Therapy", description: "Strengthen relationships through guided communication and conflict resolution." },
                        { title: "Workshops & Seminars", description: "Attend expert-led sessions on mental health awareness and personal growth." },
                        { title: "Trauma & PTSD Therapy", description: "Receive specialized care to help process past trauma and build resilience." },
                    ].map((service, index) => (
                        <div key={index} className="flex flex-col bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-2xl font-semibold text-[#2a9d8f]">{service.title}</h4>
                            <p className="text-[#457b9d] mt-2">{service.description}</p>
                        </div>
                    ))}
                </section>

                {/* Call to Action */}
                <section className="flex flex-col gap-6 text-center sm:text-left pt-16 pb-12"> 
                    <h3 className="text-3xl font-semibold text-[#2a9d8f]">Start Your Journey to Wellness</h3>
                    <p className="text-lg text-[#457b9d] max-w-prose">
                        Take the first step towards a healthier, happier life. Schedule a consultation with our experts today.
                    </p>
                    <Link
                        href="/schedule"
                        className="mt-6 rounded-full bg-[#2a9d8f] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#249177]"
                    >
                        Book a Session
                    </Link>
                </section>
            </main>
        </div>
    );
}
