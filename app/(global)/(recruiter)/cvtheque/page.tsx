import React from 'react';
import CvThequeComponent from '@/components/role/recruiter/cvtheque/CvThequeComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CVThèque',
  description: 'CVThèque Profil First',
};

export default function CvThequePage() {
  return (
    <div className="w-full h-full">
      <CvThequeComponent />
    </div>
  );
}
