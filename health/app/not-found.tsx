'use client';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <a href="/" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Return Home
        </a>
      </div>
    </div>
  );
}
