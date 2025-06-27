import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Thèque Details',
  description: 'CV Thèque Details Profile First',
};

export default function CvThequeDetailsPage() {
  return (
    <div className="h-full flex items-center justify-center text-[var(--text-secondary-gray)]">
      Sélectionnez un profil pour voir le CV
    </div>
  );
}
