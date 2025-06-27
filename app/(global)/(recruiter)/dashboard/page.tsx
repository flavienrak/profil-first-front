import React from 'react';
// import DashboardComponent from '@/components/role/recruiter/dashboard/DashboardComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Profile First',
};

export default function DashboardPage() {
  return (
    <div className="h-full w-full flex justify-center overflow-y-auto">
      <div className="max-w-7xl w-full h-full">
        {/* <DashboardComponent />; */}
      </div>
    </div>
  );
}
