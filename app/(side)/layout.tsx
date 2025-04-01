'use client';

import React from 'react';

import Sidebar from '@/components/utils/Sidebar';
import Footer from '@/components/utils/Footer';

export default function SideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {children}
        <Footer />
      </div>
    </div>
  );
}
