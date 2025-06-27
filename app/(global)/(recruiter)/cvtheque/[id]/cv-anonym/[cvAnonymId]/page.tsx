import React from 'react';
import CvAnonymComponent from '@/components/role/recruiter/cvtheque/cv-anonym/CvAnonymComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Thèque Preview',
  description: 'CV Thèque Preview Profile First',
};

export default function CvAnonymPage() {
  return (
    <div className="w-full h-full">
      <CvAnonymComponent />
    </div>
  );
}
