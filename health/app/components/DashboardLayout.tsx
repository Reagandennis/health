'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {children}
      {!isDashboard && <Footer />}
    </>
  );
} 