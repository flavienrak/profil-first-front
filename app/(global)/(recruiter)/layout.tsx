'use client';

import React from 'react';
import RecruiterSidebar from '@/components/role/recruiter/RecruiterSidebar';

import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export default function RecruiterSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showMenu } = useSelector((state: RootState) => state.persistInfos);
  return (
    <div className="relative flex w-full min-h-screen overflow-hidden">
      <RecruiterSidebar showMenu={showMenu} />
      <div
        className={`w-full h-screen flex flex-col transition-[max-width] duration-500  ${
          showMenu ? 'max-w-[calc(100%-16rem)]' : 'max-w-[calc(100%-5rem-1px)]'
        }`}
      >
        <div className="h-full transition-[max-height] duration-500 max-h-[calc(100vh-2px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
