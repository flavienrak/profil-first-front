import React from 'react';
import CvOffresComponent from '@/components/role/candidat/cv-offres/CvOffresComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV et Offres',
  description: 'CV et Offres Profil First',
};

export default function CvOffres() {
  return (
    <div className="h-full w-full flex justify-center overflow-y-auto">
      <div className="max-w-7xl w-full h-full">
        <CvOffresComponent />
      </div>
    </div>
  );
}
