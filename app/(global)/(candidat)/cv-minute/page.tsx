import React from 'react';
import CvMinuteComponent from '@/components/role/candidat/cv-minute/CvMinuteComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Minute',
  description: 'CV Minute Profil First',
};

export default function CvMinute() {
  return (
    <div className="w-full h-full">
      <CvMinuteComponent />
    </div>
  );
}
