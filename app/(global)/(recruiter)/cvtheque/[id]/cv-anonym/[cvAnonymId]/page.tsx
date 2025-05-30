import React from 'react';
import CvAnonymComponent from '@/components/role/recruiter/cvtheque/cv-anonym/CvAnonymComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CVThèque Preview',
  description: 'CVThèque Preview Profil First',
};

export default function CvAnonymPage() {
  return (
    <div className="w-full h-full">
      <CvAnonymComponent />
    </div>
  );
}
