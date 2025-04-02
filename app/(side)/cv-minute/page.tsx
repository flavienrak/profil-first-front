import React from 'react';
import CvMinuteComponent from '@/components/cv-minute/CvMinuteComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV-Minute',
  description: 'CV-Minute Profil First',
};

export default function CvMinute() {
  return (
    <div>
      <CvMinuteComponent />
    </div>
  );
}
