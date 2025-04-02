'use client';

import React, { useContext } from 'react';

import Sidebar from '@/components/utils/Sidebar';
import Footer from '@/components/utils/Footer';
import Loading from '../loading';
import { UidContext } from '@/providers/UidProvider';

export default function SideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useContext(UidContext);

  if (!context || (context && context.isLoading)) return <Loading />;
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
