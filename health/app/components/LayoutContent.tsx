'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
} 