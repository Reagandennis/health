import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
return (
    <div className="grid grid-rows-[60px_1fr_80px] items-center justify-items-center min-h-screen bg-[#f3f7f4] p-8 sm:p-20 gap-16 font-[family-name:var(--font-geist-sans)] text-[#1d3557]">
    {/* Header */}
    <header className="row-start-1 w-full flex items-center justify-between px-6 sm:px-20">
        <h1 className="text-3xl font-bold text-[#2a9d8f]">Echo</h1>
        <nav className="flex gap-6 text-sm">
        <a href="#services" className="hover:underline text-[#1d3557]">Services</a>
        <Link href="/schedule" className="hover:underline text-[#1d3557]">Schedule</Link>
        <Link href="/doctors" className="hover:underline text-[#1d3557]">Be a Doctor</Link>
        <a href="#contact" className="hover:underline text-[#1d3557]">Contact</a>
        </nav>
    </header>

    {/* Main Content */}
    <main className="row-start-2 flex flex-col gap-16 items-center sm:items-start text-center sm:text-left">
        {/* Hero Section */}
        <section className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-6 w-full">
        {/* Text Content */}
        <div className="flex flex-col gap-6 sm:w-1/2">
            <h2 className="text-4xl font-bold text-[#2a9d8f]">Your Safe Space for Mental Wellness</h2>
            <p className="text-lg text-[#457b9d] max-w-prose">
            At Echo Psychology Services, we are committed to creating a secure and supportive environment where you can explore your thoughts and emotions. Our experienced team of licensed professionals is here to guide you through personalized strategies for mental well-being.
            </p>
            <p className="text-lg text-[#457b9d] max-w-prose">
            Whether you are seeking help for stress, anxiety, depression, or relationship challenges, we are here to assist. We believe in the power of listening, understanding, and collaborating to achieve your goals.
            </p>
            <div className="flex gap-4">
            <Link
                href="/schedule"
                className="rounded-full bg-[#2a9d8f] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#249177]"
            >
                Schedule Now
            </Link>
            <a
                className="rounded-full bg-[#1d3557] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#163049]"
                href="#services"
            >
                Learn More
            </a>
            </div>
        </div>

        {/* Image Content */}
        <div className="sm:w-1/2 flex justify-center">
            <Image
            src="/safe-space.jpg"
            alt="A serene and welcoming therapy space"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
            />
        </div>
        </section>

        {/* Services Section */}
        <section id="services" className="flex flex-col gap-8">
        <h3 className="text-3xl font-semibold text-[#2a9d8f]">Comprehensive Services</h3>
        <p className="text-lg text-[#457b9d]">
            We provide a range of evidence-based services tailored to your unique needs. Our approach combines empathy, professionalism, and expertise to ensure you feel supported every step of the way.
        </p>
        <div className="flex flex-wrap gap-6">
            <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full sm:w-[48%]">
            <h4 className="text-2xl font-semibold text-[#2a9d8f]">Individual Counseling</h4>
            <p className="text-[#457b9d] mt-2">
                Work one-on-one with our licensed therapists to explore personal challenges, develop coping strategies, and achieve meaningful growth in a confidential space.
            </p>
            </div>
            <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full sm:w-[48%]">
            <h4 className="text-2xl font-semibold text-[#2a9d8f]">Group Therapy</h4>
            <p className="text-[#457b9d] mt-2">
                Join a supportive community and share experiences in a safe group setting. Benefit from collective wisdom and mutual encouragement.
            </p>
            </div>
            <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full sm:w-[48%]">
            <h4 className="text-2xl font-semibold text-[#2a9d8f]">Stress & Anxiety Management</h4>
            <p className="text-[#457b9d] mt-2">
                Learn practical strategies and techniques to manage stress and reduce anxiety, empowering you to regain balance and peace of mind.
            </p>
            </div>
            <div className="flex flex-col bg-white p-6 rounded-lg shadow-md w-full sm:w-[48%]">
            <h4 className="text-2xl font-semibold text-[#2a9d8f]">Couples & Family Therapy</h4>
            <p className="text-[#457b9d] mt-2">
                Enhance communication, resolve conflicts, and build stronger relationships with the support of our experienced therapists.
            </p>
            </div>
        </div>
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="flex flex-col gap-8">
        <h3 className="text-3xl font-semibold text-[#2a9d8f]">Schedule a Session</h3>
        <p className="text-lg text-[#457b9d] max-w-prose">
            Your well-being is our priority. We offer flexible scheduling options to fit your lifestyle, ensuring that professional support is always within reach. Our simple booking process allows you to select a convenient time to connect with a licensed therapist.
        </p>
        <p className="text-lg text-[#457b9d] max-w-prose">
            Whether you need a single session or ongoing support, our team is here to help. Take the first step towards improved mental health today.
        </p>
        <Link
            href="/schedule"
            className="rounded-full bg-[#2a9d8f] text-[#f3f7f4] px-8 py-3 text-base font-semibold hover:bg-[#249177]"
        >
            Book Your Appointment
        </Link>
        </section>
    </main>

    {/* Footer */}
    <footer id="contact" className="row-start-3 w-full flex flex-col sm:flex-row gap-8 items-center justify-between px-6 sm:px-20 bg-[#2a9d8f] text-[#f3f7f4] py-6 text-center sm:text-left">
        <div>
        <h4 className="text-lg font-semibold">Contact Us</h4>
        <p>Email: <a href="mailto:info@psychologyservices.com" className="underline">info@psychologyservices.com</a></p>
        <p>Phone: <a href="tel:+1234567890" className="underline">+1 (234) 567-890</a></p>
        </div>
        <div>
        <h4 className="text-lg font-semibold">Visit Us</h4>
        <p>123 Wellness Way<br />Suite 100<br />Your City, State, ZIP</p>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">Find us on Google Maps</a>
        </div>
        <div>
        <h4 className="text-lg font-semibold">Stay Connected</h4>
        <p>Follow us on our social platforms for updates and tips:</p>
        <div className="flex gap-4 justify-center sm:justify-start">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Instagram</a>
        </div>
        </div>
    </footer>
    </div>
);
}
