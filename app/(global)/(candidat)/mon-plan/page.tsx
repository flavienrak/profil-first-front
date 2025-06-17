import React from 'react';
import MonPlanComponent from '@/components/role/candidat/mon-plan/MonPlanComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Plan',
  description: 'Mon Plan Profil First',
};

export default function MonPlanPage() {
  return (
    <div className="w-full h-full">
      <MonPlanComponent />
    </div>
  );
}
