'use client';
import React from 'react';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
