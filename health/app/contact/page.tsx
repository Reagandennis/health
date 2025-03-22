'use client'

import { useState } from 'react'
import Link from 'next/link'
import React from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-20 py-12">
      <h2 className="text-4xl font-bold text-[#2a9d8f] text-center mb-6">Contact Us</h2>
      <p className="text-center text-gray-600 mb-10">We'd love to hear from you! Fill out the form below or reach out through our support center.</p>
      
      {/* Contact Form */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        {submitted ? (
          <p className="text-green-600 text-center font-semibold">Thank you! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-[#2a9d8f] focus:border-[#2a9d8f]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-[#2a9d8f] focus:border-[#2a9d8f]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                rows={4}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-[#2a9d8f] focus:border-[#2a9d8f]"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#2a9d8f] text-white py-3 rounded-lg font-semibold hover:bg-[#249177] transition">
              Send Message
            </button>
          </form>
        )}
      </div>
      
      {/* Support Center */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Support Center</h3>
        <p className="text-gray-600 mb-6">Need help? Explore our dedicated support pages:</p>
        <div className="flex justify-center gap-6">
          <Link href="/support/users" className="bg-[#2a9d8f] text-white px-6 py-3 rounded-lg hover:bg-[#249177] transition">
            User Support
          </Link>
          <Link href="/support/doctors" className="bg-[#1d3557] text-white px-6 py-3 rounded-lg hover:bg-[#152947] transition">
            Doctor Support
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800">How do I schedule an appointment?</h4>
            <p className="text-gray-600 mt-1">You can schedule an appointment by visiting our <Link href="/schedule" className="text-[#2a9d8f] hover:underline">Schedule Page</Link>.</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800">How can I become a doctor on the platform?</h4>
            <p className="text-gray-600 mt-1">Interested doctors can apply through our <Link href="/doctors" className="text-[#2a9d8f] hover:underline">Doctor Signup Page</Link>.</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800">Where can I find more support?</h4>
            <p className="text-gray-600 mt-1">For more help, visit our <Link href="/support/users" className="text-[#2a9d8f] hover:underline">User Support</Link> or <Link href="/support/doctors" className="text-[#2a9d8f] hover:underline">Doctor Support</Link> pages.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;