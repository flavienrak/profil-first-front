import React from 'react';
import QualiCarrierePresentation from '@/components/role/candidat/quali-carriere/presentation/QualiCarrierePresentation';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quali Carrière Présentation',
  description: 'Quali Carrière Présentation Profile First',
};

export default function QualiCarriere() {
  return (
    <div className="w-full h-full">
      <QualiCarrierePresentation />
    </div>
  );
}
