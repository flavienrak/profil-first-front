import React from 'react';
import QualiCarriereComponent from '@/components/role/candidat/quali-carriere/QualiCarriereComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quali Carrière',
  description: 'Quali Carrière Profil First',
};

export default function QualiCarriere() {
  return (
    <div className="w-full h-full">
      <QualiCarriereComponent />
    </div>
  );
}
