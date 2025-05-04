import React from 'react';
import OpportunitesCompontent from '@/components/role/user/opportunites/OpportunitesCompontent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes opportunités',
  description: 'Mes opportunités Profil First',
};

export default function OpportunitesPage() {
  return (
    <div className="h-full w-full flex justify-center overflow-y-auto">
      <div className="max-w-7xl w-full h-full">
        <OpportunitesCompontent />
      </div>
    </div>
  );
}
