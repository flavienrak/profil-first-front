'use client';

import React from 'react';
import UserSidebar from '@/components/role/user/UserSidebar';
import Footer from '@/components/utils/Footer';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function UserSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showMenu, showFooter } = useSelector(
    (state: RootState) => state.persistInfos,
  );

  return (
    <div className="relative flex w-full min-h-screen [background-image:var(--bg-primary)] overflow-hidden">
      <UserSidebar showMenu={showMenu} />
      <div
        className={`w-full h-screen flex flex-col transition-[max-width] duration-500  ${
          showMenu ? 'max-w-[calc(100%-16rem)]' : 'max-w-[calc(100%-5rem-1px)]'
        }`}
      >
        <div
          className={`h-full transition-[max-height] duration-500 ${
            showFooter ? 'max-h-[calc(100vh-5rem)]' : 'max-h-screen'
          }`}
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
