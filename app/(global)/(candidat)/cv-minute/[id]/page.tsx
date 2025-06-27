import React from 'react';
import CvPreview from '@/components/role/candidat/cv-minute/id/CvPreview';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Minute Preview',
  description: 'CV Minute Preview Profile First',
};

export default function CvMinutePage() {
  return (
    <div className="w-full h-full">
      <CvPreview />
    </div>
  );
}
