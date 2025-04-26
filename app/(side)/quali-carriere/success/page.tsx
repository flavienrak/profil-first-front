import React from 'react';
import QualiCarriereSuccess from '@/components/quali-carriere/QualiCarriereSuccess';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quali Carrière Success',
  description: 'Quali Carrière Success Profil First',
};

export default function QualiCarriereSuccessPage() {
  return (
    <div className="max-w-7xl w-full h-full p-8">
      <QualiCarriereSuccess />
    </div>
  );
}
