import React from 'react';
import QualiCarriereStep from '@/components/user/quali-carriere/step/synthese/QualiCarriereStep';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quali Carrière Step',
  description: 'Quali Carrière Step Profil First',
};

export default function StepPage() {
  return <QualiCarriereStep />;
}
