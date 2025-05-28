import React from 'react';
import CrossSourcingComponent from '@/components/role/recruiter/cross-sourcing/CrossSourcingComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cross Sourcing',
  description: 'Cross Sourcing Profil First',
};

export default function CrossSourcingPage() {
  return <CrossSourcingComponent />;
}
