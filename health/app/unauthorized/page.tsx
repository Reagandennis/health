// app/unauthorized/page.tsx
import Link from 'next/link';
import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have the necessary permissions to access this page.
        </p>
        <Link href="/">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Go back to Home
          </span>
        </Link>
         {/* Optionally, add a link to login or contact support */}
      </div>
    </div>
  );
}