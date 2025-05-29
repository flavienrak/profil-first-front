import React from 'react';
import QualiCarriereStep from '@/components/role/user/quali-carriere/step/synthese/QualiCarriereStep';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quali Carrière Step',
  description: 'Quali Carrière Step Profil First',
};

export default function StepPage() {
  return (
    <div className="w-full h-full">
      <QualiCarriereStep />
    </div>
  );
}
