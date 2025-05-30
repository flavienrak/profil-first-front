import React from 'react';

import { Metadata } from 'next';
import CrossSourcingComponent from '@/components/role/recruiter/cross-sourcing/CrossSourcingComponent';

export const metadata: Metadata = {
  title: 'Cross Sourcing',
  description: 'Cross Sourcing Profil First',
};

export default function CrossSourcingFilterPage() {
  return (
    <div className="w-full h-full">
      <CrossSourcingComponent />
    </div>
  );
}
