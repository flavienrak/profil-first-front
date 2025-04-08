'use client';

import React from 'react';
import Sidebar from '@/components/utils/Sidebar';
import Footer from '@/components/utils/Footer';
import Loading from '../loading';

import { UidContext } from '@/providers/UidProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function SideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = React.useContext(UidContext);
  const { showMenu, showFooter } = useSelector(
    (state: RootState) => state.persistInfos,
  );

  if (!context || (context && context.isLoading)) return <Loading />;
  return (
    <div className="relative flex w-full min-h-screen overflow-hidden">
      <Sidebar showMenu={showMenu} />
      <div
        className={`w-full h-screen flex flex-col transition-[max-width] duration-500  ${
          showMenu ? 'max-w-[calc(100%-16rem)]' : 'max-w-[calc(100%-5rem-1px)]'
        }`}
      >
        <div
          className={`h-full transition-[max-height] duration-500 ${
            showFooter
              ? 'max-h-[calc(100vh-5rem-2px)]'
              : 'max-h-[calc(100vh-2px)]'
          }`}
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
